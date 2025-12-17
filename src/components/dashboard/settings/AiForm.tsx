'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type Props = {
	guildId: string;
	initialSettings: any;
	channels: { id: string; name: string }[];
};

const AiForm = ({ guildId, initialSettings, channels }: Props) => {
	const [formData, setFormData] = useState(initialSettings);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const router = useRouter();

	const handleSave = async () => {
		setLoading(true);

		try {
			await fetch(`/api/proxy/guilds/settings/${guildId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			setToast({
				open: true,
				message: 'AI settings saved!',
				severity: 'success',
			});
			router.refresh();
		} catch (error) {
			setToast({ open: true, message: 'Failed to save', severity: 'error' });
		} finally {
			setLoading(false);
		}
	};

	// Handle Channel Selection
	const handleChannelsChange = (newValue: any[]) => {
		// Simpan array ID channel
		setFormData((prev: any) => ({
			...prev,
			aiChannelIds: newValue.map((ch) => (typeof ch === 'string' ? ch : ch.id)),
		}));
	};

	// Helper buat nyari object channel dari ID yang tersimpan di DB
	const selectedChannels = channels.filter((ch) =>
		(formData.aiChannelIds || []).includes(ch.id),
	);

	return (
		<Grid container spacing={6}>
			{/* === AI CONFIG === */}
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="🤖 AI-Enabled Channels"
						subheader="Select channels where users can chat with Kythia AI"
					/>
					<CardContent>
						<Autocomplete
							multiple
							options={channels}
							getOptionLabel={(option) => `#${option.name}`}
							value={selectedChannels}
							onChange={(_, newValue) => handleChannelsChange(newValue)}
							renderInput={(params) => (
								<TextField
									{...params}
									variant="outlined"
									label="Select Channels"
									placeholder="Add channel..."
								/>
							)}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => (
									<Chip
										label={`#${option.name}`}
										size="small"
										color="primary"
										variant="outlined"
										{...getTagProps({ index })}
										key={index}
									/>
								))
							}
						/>

						<div className="mt-4 flex gap-4 text-center">
							<div className="flex-1 p-4 rounded bg-primary/10 border border-primary/20">
								<Typography variant="h4" color="primary">
									{selectedChannels.length}
								</Typography>
								<Typography variant="caption">Active Channels</Typography>
							</div>
							<div className="flex-1 p-4 rounded bg-success/10 border border-success/20">
								<Typography variant="h4" color="success">
									24/7
								</Typography>
								<Typography variant="caption">Availability</Typography>
							</div>
						</div>
					</CardContent>
				</Card>
			</Grid>

			{/* === INFO CARDS (Static) === */}
			<Grid item xs={12} md={6}>
				<Card className="h-full bg-info/5 border border-info/20">
					<CardHeader title="✨ Features" />
					<CardContent>
						<ul className="space-y-2">
							{[
								'Chat with AI assistant (/ai)',
								'Translate text (/translate)',
								'Context-aware replies',
								'Smart moderation',
							].map((item, i) => (
								<li key={i} className="flex items-center gap-2">
									<i className="tabler-check text-success" />{' '}
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12} md={6}>
				<Card className="h-full bg-warning/5 border border-warning/20">
					<CardHeader title="📋 Guidelines" />
					<CardContent>
						<ul className="space-y-2">
							<li className="flex items-center gap-2">
								<i className="tabler-info-circle text-info" /> Rate limit
								applies to prevent spam
							</li>
							<li className="flex items-center gap-2">
								<i className="tabler-brain text-primary" /> AI learns from
								conversation context
							</li>
							<li className="flex items-center gap-2">
								<i className="tabler-alert-triangle text-warning" /> Responses
								may not always be accurate
							</li>
						</ul>
					</CardContent>
				</Card>
			</Grid>

			{/* === FOOTER ACTION === */}
			<Grid item xs={12} className="flex justify-end sticky bottom-4 z-50">
				<Card className="shadow-xl border border-primary/50">
					<CardContent className="py-3 px-6 flex gap-4 items-center">
						<Typography
							variant="body2"
							className="text-textSecondary hidden sm:block"
						>
							Unsaved changes will be lost.
						</Typography>
						<Button
							variant="contained"
							size="large"
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
					</CardContent>
				</Card>
			</Grid>

			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={() => setToast((p) => ({ ...p, open: false }))}
			>
				<Alert severity={toast.severity} variant="filled">
					{toast.message}
				</Alert>
			</Snackbar>
		</Grid>
	);
};

export default AiForm;
