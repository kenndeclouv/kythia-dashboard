'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type Props = {
	guildId: string;
	initialSettings: any;
};

// List fitur sesuai migrasi DB kamu
const featuresList = [
	{ key: 'antiInviteOn', label: 'Anti Invite' },
	{ key: 'antiLinkOn', label: 'Anti Link' },
	{ key: 'antiSpamOn', label: 'Anti Spam' },
	{ key: 'antiBadwordOn', label: 'Anti Badword' },
	{ key: 'antiMentionOn', label: 'Anti Mention' },
	{ key: 'antiAllCapsOn', label: 'Anti All Caps' },
	{ key: 'serverStatsOn', label: 'Server Stats' },
	{ key: 'levelingOn', label: 'Leveling System' },
	{ key: 'welcomeInOn', label: 'Welcome Message' },
	{ key: 'welcomeOutOn', label: 'Goodbye Message' },
	{ key: 'streakOn', label: 'Daily Streak' },
	{ key: 'minecraftStatsOn', label: 'Minecraft Status' },
];

const FeaturesForm = ({ guildId, initialSettings }: Props) => {
	const [formData, setFormData] = useState(initialSettings);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const router = useRouter();

	const handleToggle = (key: string) => {
		setFormData((prev: any) => ({ ...prev, [key]: !prev[key] }));
	};

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
				message: 'Features updated!',
				severity: 'success',
			});
			router.refresh();
		} catch (error) {
			setToast({ open: true, message: 'Failed to update', severity: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Card>
				<CardHeader
					title="Enable / Disable Features"
					subheader="Toggle the modules you want to use"
				/>
				<CardContent>
					<Grid container spacing={2}>
						{featuresList.map((feature) => (
							<Grid item xs={12} sm={6} md={4} key={feature.key}>
								<div className="border rounded p-3 flex justify-between items-center hover:bg-gray-50/5 transition-colors">
									<span>{feature.label}</span>
									<Switch
										checked={formData[feature.key] || false}
										onChange={() => handleToggle(feature.key)}
									/>
								</div>
							</Grid>
						))}

						<Grid item xs={12} className="mt-4">
							<Button
								variant="contained"
								onClick={handleSave}
								disabled={loading}
								startIcon={
									loading ? (
										<CircularProgress size={20} />
									) : (
										<i className="tabler-device-floppy" />
									)
								}
							>
								{loading ? 'Saving...' : 'Save Changes'}
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

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

export default FeaturesForm;
