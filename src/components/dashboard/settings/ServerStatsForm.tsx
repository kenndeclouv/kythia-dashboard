'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// Icons
import { Icon } from '@iconify/react'; // Atau pake class i 'tabler-...'

type StatChannel = {
	channelId: string;
	format: string;
	enabled: boolean;
};

type Props = {
	guildId: string;
	initialSettings: any;
	channels: {
		categories: { id: string; name: string }[];
		voice: { id: string; name: string }[];
	};
};

const ServerStatsForm = ({ guildId, initialSettings, channels }: Props) => {
	// Ensure serverStats is an array
	const initialStats = Array.isArray(initialSettings.serverStats)
		? initialSettings.serverStats
		: [];

	const [formData, setFormData] = useState({
		...initialSettings,
		serverStats: initialStats as StatChannel[],
	});

	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const router = useRouter();

	// Helper Update Global State
	const updateState = (key: string, value: any) => {
		setFormData((prev: any) => ({ ...prev, [key]: value }));
	};

	// --- STATS ARRAY LOGIC ---

	const addStat = (templateFormat: string = '') => {
		const newStat: StatChannel = {
			channelId: '',
			format: templateFormat || '{memberstotal} Members',
			enabled: true,
		};

		setFormData((prev: any) => ({
			...prev,
			serverStats: [...prev.serverStats, newStat],
		}));
	};

	const removeStat = (index: number) => {
		const newStats = [...formData.serverStats];

		newStats.splice(index, 1);
		updateState('serverStats', newStats);
	};

	const updateStatItem = (
		index: number,
		field: keyof StatChannel,
		value: any,
	) => {
		const newStats = [...formData.serverStats];

		newStats[index] = { ...newStats[index], [field]: value };
		updateState('serverStats', newStats);
	};

	// Handle Save
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
				message: 'Server Stats saved successfully!',
				severity: 'success',
			});
			router.refresh();
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

	// Template Buttons
	const templates = [
		{
			label: 'Total Members',
			format: 'Members: {memberstotal}',
			icon: 'tabler-users',
		},
		{
			label: 'Online Members',
			format: 'Online: {online}',
			icon: 'tabler-circle-check',
		},
		{
			label: 'Total Channels',
			format: 'Channels: {channels}',
			icon: 'tabler-hash',
		},
		{
			label: 'Server Boosts',
			format: 'Boosts: {boosts}',
			icon: 'tabler-rocket',
		},
	];

	return (
		<Grid container spacing={6}>
			{/* --- HEADER --- */}
			<Grid item xs={12} className="flex justify-between items-center">
				<div>
					<Typography variant="h4" className="font-bold mb-1">
						📊 Server Stats
					</Typography>
					<Typography className="text-textSecondary">
						Create dynamic counters for your server
					</Typography>
				</div>
			</Grid>

			{/* --- GLOBAL SETTINGS --- */}
			<Grid item xs={12} md={6}>
				<Card className="h-full">
					<CardHeader title="🔧 Main Settings" />
					<CardContent className="flex flex-col gap-6">
						<div className="flex items-center justify-between border-b border-divider pb-4">
							<div>
								<Typography variant="subtitle1" className="font-medium">
									Enable Server Stats
								</Typography>
								<Typography variant="caption" className="text-textSecondary">
									Master switch for this module
								</Typography>
							</div>
							<Switch
								checked={formData.serverStatsOn || false}
								onChange={(e) => updateState('serverStatsOn', e.target.checked)}
							/>
						</div>

						<FormControl fullWidth>
							<InputLabel>Category Folder</InputLabel>
							<Select
								label="Category Folder"
								value={formData.serverStatsCategoryId || ''}
								onChange={(e) =>
									updateState('serverStatsCategoryId', e.target.value)
								}
							>
								<MenuItem value="">
									<em>None (Root)</em>
								</MenuItem>
								{channels.categories.map((c) => (
									<MenuItem key={c.id} value={c.id}>
										📂 {c.name}
									</MenuItem>
								))}
							</Select>
							<Typography variant="caption" className="mt-2 text-textSecondary">
								Where should the stat channels be created?
							</Typography>
						</FormControl>
					</CardContent>
				</Card>
			</Grid>

			{/* --- PLACEHOLDERS CHEATSHEET --- */}
			<Grid item xs={12} md={6}>
				<Card className="h-full bg-primary/5 border-primary/20 border">
					<CardHeader title="📝 Available Variables" />
					<CardContent>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<ul className="text-sm space-y-1 pl-4 list-disc text-textSecondary">
									<li>
										<code>{`{memberstotal}`}</code>
									</li>
									<li>
										<code>{`{online}`}</code> / <code>{`{offline}`}</code>
									</li>
									<li>
										<code>{`{bots}`}</code> / <code>{`{humans}`}</code>
									</li>
								</ul>
							</Grid>
							<Grid item xs={6}>
								<ul className="text-sm space-y-1 pl-4 list-disc text-textSecondary">
									<li>
										<code>{`{channels}`}</code>
									</li>
									<li>
										<code>{`{roles}`}</code> / <code>{`{emojis}`}</code>
									</li>
									<li>
										<code>{`{boosts}`}</code>
									</li>
								</ul>
							</Grid>
						</Grid>
						<div className="mt-4 pt-4 border-t border-primary/20">
							<Typography variant="caption" className="font-bold">
								⚡ Quick Setup:
							</Typography>
							<div className="flex flex-wrap gap-2 mt-2">
								{templates.map((t, i) => (
									<Chip
										key={i}
										label={t.label}
										icon={<i className={t.icon} />}
										onClick={() => addStat(t.format)}
										className="cursor-pointer hover:bg-primary/20"
										size="small"
										color="primary"
										variant="outlined"
									/>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</Grid>

			{/* --- STATS LIST --- */}
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="📈 Active Counters"
						action={
							<Button
								variant="outlined"
								size="small"
								startIcon={<i className="tabler-plus" />}
								onClick={() => addStat()}
							>
								Add Counter
							</Button>
						}
					/>
					<CardContent>
						{formData.serverStats.length === 0 ? (
							<div className="text-center py-12 text-textDisabled">
								<i className="tabler-chart-bar text-4xl mb-2 opacity-50" />
								<Typography>No counters configured yet.</Typography>
								<Button onClick={() => addStat()} className="mt-2">
									Create One
								</Button>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{formData.serverStats.map(
									(stat: StatChannel, index: number) => (
										<div
											key={index}
											className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-lg border border-divider bg-backgroundDefault hover:border-primary/50 transition-colors"
										>
											{/* Drag Handle (Visual Only) */}
											<div className="cursor-grab active:cursor-grabbing text-textDisabled hidden sm:block">
												<i className="tabler-grip-vertical" />
											</div>

											{/* Channel Selector */}
											<FormControl size="small" className="w-full sm:w-1/3">
												<InputLabel>Target Channel</InputLabel>
												<Select
													label="Target Channel"
													value={stat.channelId || ''}
													onChange={(e) =>
														updateStatItem(index, 'channelId', e.target.value)
													}
												>
													<MenuItem value="">
														<em>Create New Channel</em>
													</MenuItem>
													{channels.voice.map((c) => (
														<MenuItem key={c.id} value={c.id}>
															🔊 {c.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>

											{/* Format Input */}
											<TextField
												size="small"
												className="w-full sm:w-1/3"
												label="Name Format"
												value={stat.format}
												onChange={(e) =>
													updateStatItem(index, 'format', e.target.value)
												}
												placeholder="Members: {memberstotal}"
											/>

											{/* Toggle */}
											<div className="flex items-center gap-2">
												<Switch
													size="small"
													checked={stat.enabled}
													onChange={(e) =>
														updateStatItem(index, 'enabled', e.target.checked)
													}
												/>
												<Typography
													variant="caption"
													className="hidden sm:block"
												>
													{stat.enabled ? 'On' : 'Off'}
												</Typography>
											</div>

											{/* Delete */}
											<div className="ml-auto">
												<Tooltip title="Delete Counter">
													<IconButton
														color="error"
														size="small"
														onClick={() => removeStat(index)}
													>
														<i className="tabler-trash" />
													</IconButton>
												</Tooltip>
											</div>
										</div>
									),
								)}
							</div>
						)}
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

			{/* Toast */}
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

export default ServerStatsForm;
