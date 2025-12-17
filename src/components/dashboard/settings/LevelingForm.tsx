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

// import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';

// import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography';

type Props = {
	guildId: string;
	initialSettings: any;
	channels: { id: string; name: string }[]; // Text Channels
	voiceChannels: { id: string; name: string }[]; // Voice Channels (buat restriction)
	roles: { id: string; name: string; color: string }[];
};

const LevelingForm = ({
	guildId,
	initialSettings,
	channels,
	voiceChannels,
	roles,
}: Props) => {
	const [formData, setFormData] = useState({
		...initialSettings,
		roleRewards: Array.isArray(initialSettings.roleRewards)
			? initialSettings.roleRewards
			: [],
		xpBoosters: Array.isArray(initialSettings.xpBoosters)
			? initialSettings.xpBoosters
			: [],
		noXpChannels: Array.isArray(initialSettings.noXpChannels)
			? initialSettings.noXpChannels
			: [],
		noXpRoles: Array.isArray(initialSettings.noXpRoles)
			? initialSettings.noXpRoles
			: [],
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

	// --- HELPER UNTUK ARRAY (Rewards/Boosters) ---
	const addItem = (key: string, item: any) => {
		setFormData((prev: any) => ({ ...prev, [key]: [...prev[key], item] }));
	};

	const removeItem = (key: string, index: number) => {
		const newArr = [...formData[key]];

		newArr.splice(index, 1);
		updateState(key, newArr);
	};

	const updateItem = (
		key: string,
		index: number,
		field: string,
		value: any,
	) => {
		const newArr = [...formData[key]];

		newArr[index] = { ...newArr[index], [field]: value };
		updateState(key, newArr);
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
				message: 'Leveling settings saved!',
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
			{/* ================= 1. XP OPTIONS (Formula) ================= */}
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="📈 XP Formula"
						subheader="Customize how much XP is needed for each level."
						action={<Chip label="New Features!" color="primary" size="small" />}
					/>
					<CardContent>
						<Grid container spacing={4}>
							<Grid item xs={12} md={4}>
								<FormControl fullWidth>
									<InputLabel>Curve Type</InputLabel>
									<Select
										label="Curve Type"
										value={formData.levelingCurve || 'linear'}
										onChange={(e) =>
											updateState('levelingCurve', e.target.value)
										}
									>
										<MenuItem value="linear">Linear (Easy)</MenuItem>
										<MenuItem value="exponential">
											Exponential (Harder)
										</MenuItem>
										<MenuItem value="constant">Constant (Flat)</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									label="Multiplier"
									type="number"
									fullWidth
									value={formData.levelingMultiplier || 1.0}
									onChange={(e) =>
										updateState(
											'levelingMultiplier',
											parseFloat(e.target.value),
										)
									}
									inputProps={{ step: 0.1 }}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									label="Max Level"
									type="number"
									fullWidth
									placeholder="Unlimited"
									value={formData.levelingMaxLevel || ''}
									onChange={(e) =>
										updateState(
											'levelingMaxLevel',
											e.target.value ? parseInt(e.target.value) : null,
										)
									}
								/>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>

			{/* ================= 2. MESSAGE XP ================= */}
			<Grid item xs={12} md={6}>
				<Card className="h-full">
					<CardHeader
						title="💬 Message XP"
						action={
							<Switch
								checked={formData.messageXpEnabled}
								onChange={(e) =>
									updateState('messageXpEnabled', e.target.checked)
								}
							/>
						}
					/>
					<CardContent className="flex flex-col gap-4">
						<FormControl fullWidth size="small">
							<InputLabel>Mode</InputLabel>
							<Select
								value={formData.messageXpMode || 'random'}
								onChange={(e) => updateState('messageXpMode', e.target.value)}
								label="Mode"
							>
								<MenuItem value="random">Random Range</MenuItem>
								<MenuItem value="fixed">Fixed Amount</MenuItem>
							</Select>
						</FormControl>
						<div className="flex gap-4">
							<TextField
								label="Min XP"
								type="number"
								size="small"
								fullWidth
								value={formData.messageXpMin || 15}
								onChange={(e) =>
									updateState('messageXpMin', parseInt(e.target.value))
								}
							/>
							<TextField
								label="Max XP"
								type="number"
								size="small"
								fullWidth
								value={formData.messageXpMax || 25}
								onChange={(e) =>
									updateState('messageXpMax', parseInt(e.target.value))
								}
							/>
						</div>
						<TextField
							label="Cooldown (Seconds)"
							type="number"
							size="small"
							fullWidth
							value={formData.messageXpCooldown || 60}
							onChange={(e) =>
								updateState('messageXpCooldown', parseInt(e.target.value))
							}
						/>
					</CardContent>
				</Card>
			</Grid>

			{/* ================= 3. VOICE XP ================= */}
			<Grid item xs={12} md={6}>
				<Card className="h-full">
					<CardHeader
						title="🎙️ Voice XP"
						action={
							<Switch
								checked={formData.voiceXpEnabled}
								onChange={(e) =>
									updateState('voiceXpEnabled', e.target.checked)
								}
							/>
						}
					/>
					<CardContent className="flex flex-col gap-4">
						<div className="flex gap-4">
							<TextField
								label="Min XP"
								type="number"
								size="small"
								fullWidth
								value={formData.voiceXpMin || 10}
								onChange={(e) =>
									updateState('voiceXpMin', parseInt(e.target.value))
								}
							/>
							<TextField
								label="Max XP"
								type="number"
								size="small"
								fullWidth
								value={formData.voiceXpMax || 20}
								onChange={(e) =>
									updateState('voiceXpMax', parseInt(e.target.value))
								}
							/>
						</div>
						<TextField
							label="Cooldown (Seconds)"
							type="number"
							size="small"
							fullWidth
							value={formData.voiceXpCooldown || 180}
							onChange={(e) =>
								updateState('voiceXpCooldown', parseInt(e.target.value))
							}
							helperText="XP awarded every X seconds in voice"
						/>
						<div className="flex justify-between items-center border p-2 rounded">
							<Typography variant="caption">
								Anti-AFK (Ignore Muted/Deaf)
							</Typography>
							<Switch
								size="small"
								checked={formData.voiceAntiAfk}
								onChange={(e) => updateState('voiceAntiAfk', e.target.checked)}
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>

			{/* ================= 4. ROLE REWARDS ================= */}
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="🎁 Role Rewards"
						subheader={`${formData.roleRewards.length} / 20 rewards used`}
						action={
							<Button
								size="small"
								variant="outlined"
								onClick={() => addItem('roleRewards', { level: 1, roleId: '' })}
							>
								+ Add Reward
							</Button>
						}
					/>
					<CardContent>
						<div className="flex items-center gap-2 mb-4">
							<Switch
								checked={formData.roleRewardStack}
								onChange={(e) =>
									updateState('roleRewardStack', e.target.checked)
								}
							/>
							<Typography>Stack Rewards (Keep previous roles)</Typography>
						</div>

						{formData.roleRewards.map((reward: any, index: number) => (
							<div key={index} className="flex gap-2 items-center mb-3">
								<TextField
									label="Level"
									type="number"
									size="small"
									className="w-24"
									value={reward.level}
									onChange={(e) =>
										updateItem(
											'roleRewards',
											index,
											'level',
											parseInt(e.target.value),
										)
									}
								/>
								<FormControl fullWidth size="small">
									<InputLabel>Role</InputLabel>
									<Select
										label="Role"
										value={reward.roleId || ''}
										onChange={(e) =>
											updateItem('roleRewards', index, 'roleId', e.target.value)
										}
									>
										{roles.map((r) => (
											<MenuItem
												key={r.id}
												value={r.id}
												style={{
													color: r.color !== '#000000' ? r.color : 'inherit',
												}}
											>
												{r.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton
									color="error"
									onClick={() => removeItem('roleRewards', index)}
								>
									<i className="tabler-trash" />
								</IconButton>
							</div>
						))}
					</CardContent>
				</Card>
			</Grid>

			{/* ================= 5. LEVEL UP MESSAGE ================= */}
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="🎉 Level Up Announcement"
						action={
							<Switch
								checked={formData.levelingImageEnabled}
								onChange={(e) =>
									updateState('levelingImageEnabled', e.target.checked)
								}
							/>
						}
					/>
					<CardContent className="flex flex-col gap-4">
						<FormControl fullWidth>
							<InputLabel>Announcement Channel</InputLabel>
							<Select
								label="Announcement Channel"
								value={formData.levelingChannelId || ''}
								onChange={(e) =>
									updateState('levelingChannelId', e.target.value)
								}
							>
								<MenuItem value="">
									<em>Current Channel (Where msg sent)</em>
								</MenuItem>
								{channels.map((c) => (
									<MenuItem key={c.id} value={c.id}>
										#{c.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							label="Level Up Message"
							multiline
							rows={2}
							fullWidth
							value={
								formData.levelingMessage ||
								'GG {user.mention}, you reached level **{user.level}**!'
							}
							onChange={(e) => updateState('levelingMessage', e.target.value)}
							helperText="Variables: {user.mention}, {user.name}, {user.level}, {user.xp}"
						/>
					</CardContent>
				</Card>
			</Grid>

			{/* ================= 6. RESTRICTIONS (No XP) ================= */}
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="🚫 XP Restrictions"
						subheader="Where or who should NOT earn XP"
					/>
					<CardContent>
						<Grid container spacing={4}>
							<Grid item xs={12} md={6}>
								<Typography className="mb-2 font-bold text-sm uppercase">
									No XP Channels
								</Typography>
								<Autocomplete
									multiple
									options={channels}
									getOptionLabel={(option) => `#${option.name}`}
									value={channels.filter((c) =>
										formData.noXpChannels.includes(c.id),
									)}
									onChange={(_, newValue) =>
										updateState(
											'noXpChannels',
											newValue.map((v) => v.id),
										)
									}
									renderInput={(params) => (
										<TextField {...params} placeholder="Select channels..." />
									)}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip
												label={`#${option.name}`}
												size="small"
												{...getTagProps({ index })}
												key={index}
											/>
										))
									}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography className="mb-2 font-bold text-sm uppercase">
									No XP Roles
								</Typography>
								<Autocomplete
									multiple
									options={roles}
									getOptionLabel={(option) => option.name}
									value={roles.filter((r) => formData.noXpRoles.includes(r.id))}
									onChange={(_, newValue) =>
										updateState(
											'noXpRoles',
											newValue.map((v) => v.id),
										)
									}
									renderInput={(params) => (
										<TextField {...params} placeholder="Select roles..." />
									)}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip
												label={`@${option.name}`}
												size="small"
												{...getTagProps({ index })}
												key={index}
											/>
										))
									}
								/>
							</Grid>
						</Grid>
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

export default LevelingForm;
