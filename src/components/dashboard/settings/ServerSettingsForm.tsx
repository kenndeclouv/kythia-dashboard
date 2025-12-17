// src/components/dashboard/ServerSettingsForm.tsx
'use client';

// React Imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

// Libs
import { fetchAPI } from '@/libs/api'; // Kita reuse fetcher ini tapi di client side

type Props = {
	guildId: string;
	initialSettings: any; // Data setting dari DB
};

const ServerSettingsForm = ({ guildId, initialSettings }: Props) => {
	// State Form
	const [formData, setFormData] = useState(initialSettings);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const router = useRouter();

	// Handle Input Change
	const handleChange = (field: string, value: any) => {
		setFormData((prev: any) => ({ ...prev, [field]: value }));
	};

	// Handle Save (PATCH ke API Bot)
	const handleSave = async () => {
		setLoading(true);

		try {
			// Panggil API PATCH yang udah kita buat di Hono
			// Endpoint: /api/guilds/settings/:id
			const res = await fetch(`/api/proxy/guilds/settings/${guildId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			// Simulasi sukses dulu
			setToast({
				open: true,
				message: 'Settings saved successfully! 🎉',
				severity: 'success',
			});
			router.refresh(); // Refresh data server component
		} catch (error) {
			setToast({
				open: true,
				message: 'Failed to save settings',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Card>
				<CardHeader
					title="General Configuration"
					subheader="Basic bot settings for this server"
				/>
				<CardContent>
					<Grid container spacing={6}>
						{/* --- PREFIX INPUT --- */}
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Bot Prefix"
								placeholder="k!"
								value={formData.prefix}
								onChange={(e) => handleChange('prefix', e.target.value)}
								helperText="Custom prefix for text commands"
							/>
						</Grid>

						{/* --- LANGUAGE DROPDOWN --- */}
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel>Language</InputLabel>
								<Select
									label="Language"
									value={formData.lang || 'en'}
									onChange={(e) => handleChange('lang', e.target.value)}
								>
									<MenuItem value="en">English</MenuItem>
									<MenuItem value="id">Indonesia</MenuItem>
									<MenuItem value="ar">Arabic</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						{/* --- BUTTONS --- */}
						<Grid item xs={12} className="flex gap-4">
							<Button
								variant="contained"
								onClick={handleSave}
								disabled={loading}
								startIcon={
									loading ? (
										<CircularProgress size={20} color="inherit" />
									) : (
										<i className="tabler-device-floppy" />
									)
								}
							>
								{loading ? 'Saving...' : 'Save Changes'}
							</Button>
							<Button
								type="reset"
								variant="outlined"
								color="secondary"
								onClick={() => setFormData(initialSettings)}
							>
								Reset
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Toast Notification */}
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={() => setToast((p) => ({ ...p, open: false }))}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert severity={toast.severity} variant="filled">
					{toast.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default ServerSettingsForm;
