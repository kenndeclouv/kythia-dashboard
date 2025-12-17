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
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// import Divider from '@mui/material/Divider'

type StreakReward = {
	streak: number;
	role: string; // Role ID
};

type Props = {
	guildId: string;
	initialSettings: any;
	roles: { id: string; name: string; color: string }[];
};

const StreakForm = ({ guildId, initialSettings, roles }: Props) => {
	// Ensure array exists
	const initialRewards = Array.isArray(initialSettings.streakRoleRewards)
		? initialSettings.streakRoleRewards
		: [];

	const [formData, setFormData] = useState({
		...initialSettings,
		streakRoleRewards: initialRewards,
	});

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

	// --- REWARDS LOGIC ---
	const addReward = () => {
		setFormData((prev: any) => ({
			...prev,
			streakRoleRewards: [...prev.streakRoleRewards, { streak: 7, role: '' }],
		}));
	};

	const removeReward = (index: number) => {
		const newRewards = [...formData.streakRoleRewards];

		newRewards.splice(index, 1);
		updateState('streakRoleRewards', newRewards);
	};

	const updateReward = (
		index: number,
		field: keyof StreakReward,
		value: any,
	) => {
		const newRewards = [...formData.streakRoleRewards];

		newRewards[index] = { ...newRewards[index], [field]: value };
		updateState('streakRoleRewards', newRewards);
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
				message: 'Streak settings saved!',
				severity: 'success',
			});
			router.refresh();
		} catch (error) {
			setToast({ open: true, message: 'Failed to save', severity: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Grid container spacing={6}>
			{/* === COLUMN 1: CONFIGURATION === */}
			<Grid item xs={12} md={6}>
				<div className="flex flex-col gap-6">
					{/* Main Toggle */}
					<Card>
						<CardHeader title="🔧 Feature Settings" />
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<Typography variant="subtitle1" className="font-medium">
										Enable Streak System
									</Typography>
									<Typography variant="caption">
										Allow members to track daily streaks
									</Typography>
								</div>
								<Switch
									checked={formData.streakOn || false}
									onChange={(e) => updateState('streakOn', e.target.checked)}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Basic Config */}
					<Card>
						<CardHeader title="⚙️ Configuration" />
						<CardContent className="flex flex-col gap-4">
							<div className="flex gap-4">
								<TextField
									label="Streak Emoji"
									fullWidth
									value={formData.streakEmoji || '🔥'}
									onChange={(e) => updateState('streakEmoji', e.target.value)}
									placeholder="🔥"
								/>
								<TextField
									label="Min Streak"
									type="number"
									fullWidth
									value={formData.streakMinimum || 3}
									onChange={(e) =>
										updateState('streakMinimum', parseInt(e.target.value))
									}
									helperText="Days to consider active"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Info Card (How it works) */}
					<Card className="bg-info/5 border border-info/20">
						<CardHeader title="ℹ️ How Streaks Work" />
						<CardContent>
							<ul className="space-y-2 text-sm">
								<li className="flex gap-2">
									<i className="tabler-check text-success" />{' '}
									<span>Chat daily or use commands to maintain streak.</span>
								</li>
								<li className="flex gap-2">
									<i className="tabler-check text-success" />{' '}
									<span>Missing a day resets streak to 0.</span>
								</li>
								<li className="flex gap-2">
									<i className="tabler-check text-success" />{' '}
									<span>Rewards are given automatically.</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</Grid>

			{/* === COLUMN 2: REWARDS & STATS === */}
			<Grid item xs={12} md={6}>
				<div className="flex flex-col gap-6">
					{/* Role Rewards */}
					<Card className="h-full">
						<CardHeader
							title="🎁 Role Rewards"
							subheader="Rewards for streak milestones"
							action={
								<Button variant="outlined" size="small" onClick={addReward}>
									+ Add Reward
								</Button>
							}
						/>
						<CardContent>
							{formData.streakRoleRewards.length === 0 ? (
								<div className="text-center py-8 text-textDisabled">
									<i className="tabler-flame text-4xl mb-2 opacity-50" />
									<Typography>No rewards set.</Typography>
								</div>
							) : (
								<div className="flex flex-col gap-3">
									{formData.streakRoleRewards.map(
										(reward: StreakReward, index: number) => (
											<div
												key={index}
												className="flex gap-2 items-center p-3 border rounded-lg hover:border-primary/50 transition-colors"
											>
												<TextField
													label="Days"
													type="number"
													size="small"
													className="w-24"
													value={reward.streak}
													onChange={(e) =>
														updateReward(
															index,
															'streak',
															parseInt(e.target.value),
														)
													}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">d</InputAdornment>
														),
													}}
												/>
												<FormControl fullWidth size="small">
													<InputLabel>Reward Role</InputLabel>
													<Select
														label="Reward Role"
														value={reward.role || ''}
														onChange={(e) =>
															updateReward(index, 'role', e.target.value)
														}
													>
														{roles.map((r) => (
															<MenuItem
																key={r.id}
																value={r.id}
																style={{
																	color:
																		r.color !== '#000000' ? r.color : 'inherit',
																}}
															>
																{r.name}
															</MenuItem>
														))}
													</Select>
												</FormControl>
												<IconButton
													color="error"
													onClick={() => removeReward(index)}
												>
													<i className="tabler-trash" />
												</IconButton>
											</div>
										),
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Examples (Visual) */}
					<Card className="bg-primary/5 border border-primary/20">
						<CardHeader title="💡 Examples" />
						<CardContent>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<Typography variant="subtitle2" className="font-bold mb-1">
										Basic Flow
									</Typography>
									<div className="space-y-1 text-textSecondary">
										<div>🔥 1 day streak</div>
										<div>🔥 2 day streak</div>
										<div>❌ Missed (Reset)</div>
									</div>
								</div>
								<div>
									<Typography variant="subtitle2" className="font-bold mb-1">
										Milestones
									</Typography>
									<div className="space-y-1 text-textSecondary">
										<div>7 Days: Bronze Role</div>
										<div>30 Days: Silver Role</div>
										<div>100 Days: Gold Role</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
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

export default StreakForm;
