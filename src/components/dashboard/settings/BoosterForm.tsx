'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

type Props = {
	guildId: string;
	initialSettings: any;
	channels: { id: string; name: string }[];
};

const BoosterForm = ({ guildId, initialSettings, channels }: Props) => {
	const [formData, setFormData] = useState(initialSettings);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const router = useRouter();

	const updateState = (key: string, value: any) => {
		setFormData((prev: any) => ({ ...prev, [key]: value }));
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
				message: 'Booster settings saved!',
				severity: 'success',
			});
			router.refresh();
		} catch (error) {
			setToast({ open: true, message: 'Failed to save', severity: 'error' });
		} finally {
			setLoading(false);
		}
	};

	// --- LIVE PREVIEW LOGIC ---
	const getPreviewMessage = () => {
		const msg =
			formData.boostLogMessage ||
			'Thank you so much, **{displayName}**! Thanks to you, our server just got even cooler!';

		// Ganti placeholder dengan dummy data
		return msg
			.replace(/{username}/g, 'KythiaUser')
			.replace(/{displayName}/g, 'Kythia User')
			.replace(/{mention}/g, '@KythiaUser')
			.replace(/{tag}/g, 'KythiaUser#1234')
			.replace(/{servername}/g, 'My Awesome Server')
			.replace(/{membercount}/g, '1,337')
			.replace(/{boostcount}/g, '15')
			.replace(/{boostlevel}/g, '3');
	};

	return (
		<Grid container spacing={6}>
			{/* === LEFT COL: SETTINGS === */}
			<Grid item xs={12} md={6}>
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader title="🔧 Feature Settings" />
						<CardContent className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<div>
									<Typography variant="subtitle1" className="font-medium">
										Enable Boost Logs
									</Typography>
									<Typography variant="caption">
										Send notification when someone boosts
									</Typography>
								</div>
								<Switch
									checked={formData.boostLogOn || false}
									onChange={(e) => updateState('boostLogOn', e.target.checked)}
								/>
							</div>

							<FormControl fullWidth>
								<InputLabel>Log Channel</InputLabel>
								<Select
									label="Log Channel"
									value={formData.boostLogChannelId || ''}
									onChange={(e) =>
										updateState('boostLogChannelId', e.target.value)
									}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{channels.map((c) => (
										<MenuItem key={c.id} value={c.id}>
											#{c.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</CardContent>
					</Card>

					<Card>
						<CardHeader title="💬 Custom Message" />
						<CardContent>
							<TextField
								multiline
								rows={4}
								fullWidth
								label="Message Content"
								placeholder="Thank you {username} for boosting!"
								value={formData.boostLogMessage || ''}
								onChange={(e) => updateState('boostLogMessage', e.target.value)}
								helperText="Supports Markdown and Placeholders"
							/>

							<div className="mt-4 flex flex-wrap gap-2">
								{[
									'{username}',
									'{mention}',
									'{boostcount}',
									'{boostlevel}',
									'{servername}',
								].map((p) => (
									<Chip
										key={p}
										label={p}
										size="small"
										onClick={() => {
											updateState(
												'boostLogMessage',
												(formData.boostLogMessage || '') + ' ' + p,
											);
										}}
										className="cursor-pointer hover:bg-primary/20"
									/>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</Grid>

			{/* === RIGHT COL: PREVIEW === */}
			<Grid item xs={12} md={6}>
				<Card className="h-full bg-[#36393f] border border-[#202225]">
					<CardHeader
						title="👁️ Live Preview"
						className="text-white"
						subheaderTypographyProps={{ className: 'text-gray-400' }}
						subheader="How it looks in Discord"
					/>
					<CardContent>
						<div className="flex gap-3">
							<div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
								K
							</div>
							<div className="flex-1">
								<div className="flex items-baseline gap-2">
									<span className="font-bold text-white cursor-pointer hover:underline">
										Kythia
									</span>
									<span className="bg-[#5865F2] text-white text-[10px] px-1 rounded">
										BOT
									</span>
									<span className="text-xs text-gray-400">
										Today at 4:20 PM
									</span>
								</div>

								{/* MESSAGE CONTENT (Rendered) */}
								<div
									className="text-gray-100 mt-1 whitespace-pre-wrap"
									dangerouslySetInnerHTML={{
										__html: getPreviewMessage()
											.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Simple Bold Parser
											.replace(
												/@(\w+)/g,
												'<span class="bg-[#5865F2]/30 text-[#dee0fc] px-1 rounded cursor-pointer hover:bg-[#5865F2]">@$1</span>',
											), // Mention style
									}}
								/>
							</div>
						</div>
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

export default BoosterForm;
