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
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

type Props = {
	guildId: string;
	initialSettings: any;
	channels: { id: string; name: string }[]; // List Text Channels
};

const AutomodForm = ({ guildId, initialSettings, channels }: Props) => {
	const [formData, setFormData] = useState(initialSettings);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const router = useRouter();

	// Helper Update State
	const updateState = (key: string, value: any) => {
		setFormData((prev: any) => ({ ...prev, [key]: value }));
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
				message: 'Automod settings saved!',
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

	// Definisi Toggle biar kodingan bersih (DRY)
	const toggles = [
		{
			key: 'antiInviteOn',
			label: 'Anti-Invites',
			desc: 'Block Discord invite links',
		},
		{
			key: 'antiLinkOn',
			label: 'Anti-Links',
			desc: 'Block all external links',
		},
		{
			key: 'antiSpamOn',
			label: 'Anti-Spam',
			desc: 'Detect and prevent spam messages',
		},
		{
			key: 'antiBadwordOn',
			label: 'Anti-Badwords',
			desc: 'Filter inappropriate language',
		},
		{
			key: 'antiMentionOn',
			label: 'Anti-Mention',
			desc: 'Prevent excessive mentions',
		},
		{
			key: 'antiAllCapsOn',
			label: 'Anti-All Caps',
			desc: 'Block excessive capital letters',
		},
		{
			key: 'antiEmojiSpamOn',
			label: 'Anti-Emoji',
			desc: 'Prevent spammy use of emojis',
		},
		{
			key: 'antiZalgoOn',
			label: 'Anti-Zalgo',
			desc: 'Detect and block glitchy text',
		},
	];

	return (
		<Grid container spacing={6}>
			{/* === COL 1: TOGGLES & CHANNELS === */}
			<Grid item xs={12} lg={6}>
				<div className="flex flex-col gap-6">
					{/* Feature Toggles */}
					<Card>
						<CardHeader
							title="🔧 Feature Toggles"
							subheader="Enable or disable protections"
						/>
						<CardContent>
							<div className="flex flex-col gap-4">
								{toggles.map((t) => (
									<div
										key={t.key}
										className="flex items-center justify-between border-b border-divider pb-2 last:border-0 last:pb-0"
									>
										<div>
											<Typography variant="subtitle1" className="font-medium">
												{t.label}
											</Typography>
											<Typography
												variant="caption"
												className="text-textSecondary"
											>
												{t.desc}
											</Typography>
										</div>
										<Switch
											checked={formData[t.key] || false}
											onChange={(e) => updateState(t.key, e.target.checked)}
										/>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Channel Settings */}
					<Card>
						<CardHeader
							title="📢 Channel Settings"
							subheader="Where to log violations"
						/>
						<CardContent className="flex flex-col gap-4">
							<FormControl fullWidth>
								<InputLabel>Moderation Log Channel</InputLabel>
								<Select
									label="Moderation Log Channel"
									value={formData.modLogChannelId || ''}
									onChange={(e) =>
										updateState('modLogChannelId', e.target.value)
									}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{channels.map((ch) => (
										<MenuItem key={ch.id} value={ch.id}>
											#{ch.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel>Audit Log Channel</InputLabel>
								<Select
									label="Audit Log Channel"
									value={formData.auditLogChannelId || ''}
									onChange={(e) =>
										updateState('auditLogChannelId', e.target.value)
									}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{channels.map((ch) => (
										<MenuItem key={ch.id} value={ch.id}>
											#{ch.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</CardContent>
					</Card>
				</div>
			</Grid>

			{/* === COL 2: LIST MANAGEMENT === */}
			<Grid item xs={12} lg={6}>
				<div className="flex flex-col gap-6">
					{/* Bad Words */}
					<Card>
						<CardHeader
							title="🚫 Bad Words"
							subheader="Messages containing these words will be deleted"
						/>
						<CardContent>
							<Autocomplete
								multiple
								freeSolo
								options={[]}
								value={formData.badwords || []}
								onChange={(_, newValue) => updateState('badwords', newValue)}
								renderTags={(value: readonly string[], getTagProps) =>
									value.map((option: string, index: number) => (
										<Chip
											variant="outlined"
											label={option}
											color="error"
											size="small"
											{...getTagProps({ index })}
											key={index}
										/>
									))
								}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="Add Words"
										placeholder="Type & Enter"
									/>
								)}
							/>
						</CardContent>
					</Card>

					{/* Whitelist Users/Roles */}
					<Card>
						<CardHeader
							title="✅ Whitelist IDs"
							subheader="Users or Roles allowed to bypass automod"
						/>
						<CardContent>
							<Autocomplete
								multiple
								freeSolo
								options={[]}
								value={formData.whitelist || []}
								onChange={(_, newValue) => updateState('whitelist', newValue)}
								renderTags={(value: readonly string[], getTagProps) =>
									value.map((option: string, index: number) => (
										<Chip
											variant="outlined"
											label={option}
											color="success"
											size="small"
											{...getTagProps({ index })}
											key={index}
										/>
									))
								}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="User/Role IDs"
										placeholder="Paste ID & Enter"
									/>
								)}
							/>
						</CardContent>
					</Card>

					{/* Ignored Channels */}
					<Card>
						<CardHeader
							title="🙈 Ignored Channels"
							subheader="Automod will sleep in these channels"
						/>
						<CardContent>
							<Autocomplete
								multiple
								options={channels}
								getOptionLabel={(option) =>
									typeof option === 'string' ? option : `#${option.name}`
								}
								// Value harus dicocokin manual karena API nyimpen string ID
								value={channels.filter((ch) =>
									(formData.ignoredChannels || []).includes(ch.id),
								)}
								onChange={(_, newValue) => {
									// Convert balik object channel ke array string ID
									updateState(
										'ignoredChannels',
										newValue.map((v) => (typeof v === 'string' ? v : v.id)),
									);
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="Select Channels"
										placeholder="Select..."
									/>
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

			{/* Toast */}
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
		</Grid>
	);
};

export default AutomodForm;
