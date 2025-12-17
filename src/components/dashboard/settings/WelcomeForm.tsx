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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

// import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

type Props = {
	guildId: string;
	initialSettings: any;
	channels: { id: string; name: string }[];
	roles: { id: string; name: string; color: string }[];
};

const WelcomeForm = ({ guildId, initialSettings, channels, roles }: Props) => {
	const [formData, setFormData] = useState(initialSettings);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
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
				message: 'Welcome settings saved!',
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

	// --- SUB-COMPONENT: Advanced Canvas Settings (Biar gak duplikat kode In/Out) ---
	const renderAdvancedSettings = (type: 'In' | 'Out') => {
		const prefix = `welcome${type}`; // welcomeIn atau welcomeOut

		return (
			<Accordion>
				<AccordionSummary expandIcon={<i className="tabler-chevron-down" />}>
					<Typography
						variant="h6"
						className="font-bold flex items-center gap-2"
					>
						<i className="tabler-palette" /> Advanced {type} Canvas Settings
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container spacing={4}>
						{/* Banner Size */}
						<Grid item xs={12} md={6}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Banner Dimension
							</Typography>
							<div className="flex gap-4">
								<TextField
									label="Width"
									type="number"
									size="small"
									fullWidth
									value={formData[`${prefix}BannerWidth`] || 800}
									onChange={(e) =>
										updateState(
											`${prefix}BannerWidth`,
											parseInt(e.target.value),
										)
									}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">px</InputAdornment>
										),
									}}
								/>
								<TextField
									label="Height"
									type="number"
									size="small"
									fullWidth
									value={formData[`${prefix}BannerHeight`] || 300}
									onChange={(e) =>
										updateState(
											`${prefix}BannerHeight`,
											parseInt(e.target.value),
										)
									}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">px</InputAdornment>
										),
									}}
								/>
							</div>
						</Grid>

						{/* Avatar Settings */}
						<Grid item xs={12} md={6}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Avatar
							</Typography>
							<div className="flex gap-4">
								<TextField
									label="Size"
									type="number"
									size="small"
									fullWidth
									value={formData[`${prefix}AvatarSize`] || 128}
									onChange={(e) =>
										updateState(`${prefix}AvatarSize`, parseInt(e.target.value))
									}
								/>
								<FormControl fullWidth size="small">
									<InputLabel>Shape</InputLabel>
									<Select
										label="Shape"
										value={formData[`${prefix}AvatarShape`] || 'circle'}
										onChange={(e) =>
											updateState(`${prefix}AvatarShape`, e.target.value)
										}
									>
										<MenuItem value="circle">Circle</MenuItem>
										<MenuItem value="square">Square</MenuItem>
									</Select>
								</FormControl>
							</div>
						</Grid>

						{/* Main Text Content */}
						<Grid item xs={12} md={6}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Main Text
							</Typography>
							<TextField
								label="Content"
								size="small"
								fullWidth
								className="mb-3"
								value={formData[`${prefix}MainTextContent`] || ''}
								onChange={(e) =>
									updateState(`${prefix}MainTextContent`, e.target.value)
								}
								placeholder={
									type === 'In'
										? 'WELCOME, {username}!'
										: 'Goodbye, {username}!'
								}
							/>
							<div className="flex gap-4">
								<TextField
									label="Y Offset"
									type="number"
									size="small"
									fullWidth
									value={formData[`${prefix}MainTextYOffset`] || -80}
									onChange={(e) =>
										updateState(
											`${prefix}MainTextYOffset`,
											parseInt(e.target.value),
										)
									}
								/>
								<TextField
									label="Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}MainTextColor`] || '#FFFFFF'}
									onChange={(e) =>
										updateState(`${prefix}MainTextColor`, e.target.value)
									}
									className="p-0"
								/>
							</div>
						</Grid>

						{/* Sub Text Content */}
						<Grid item xs={12} md={6}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Sub Text
							</Typography>
							<TextField
								label="Content"
								size="small"
								fullWidth
								className="mb-3"
								value={formData[`${prefix}SubTextContent`] || ''}
								onChange={(e) =>
									updateState(`${prefix}SubTextContent`, e.target.value)
								}
							/>
							<div className="flex gap-4">
								<TextField
									label="Y Offset"
									type="number"
									size="small"
									fullWidth
									value={formData[`${prefix}SubTextYOffset`] || 100}
									onChange={(e) =>
										updateState(
											`${prefix}SubTextYOffset`,
											parseInt(e.target.value),
										)
									}
								/>
								<TextField
									label="Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}SubTextColor`] || '#FFFFFF'}
									onChange={(e) =>
										updateState(`${prefix}SubTextColor`, e.target.value)
									}
									className="p-0"
								/>
							</div>
						</Grid>

						{/* Borders & Shadows (Simplified for UI) */}
						<Grid item xs={12}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Effects
							</Typography>
							<div className="flex gap-4">
								<TextField
									label="Border Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}BorderColor`] || '#FFFFFF'}
									onChange={(e) =>
										updateState(`${prefix}BorderColor`, e.target.value)
									}
								/>
								<TextField
									label="Border Width"
									type="number"
									size="small"
									fullWidth
									value={formData[`${prefix}BorderWidth`] || 4}
									onChange={(e) =>
										updateState(
											`${prefix}BorderWidth`,
											parseInt(e.target.value),
										)
									}
								/>
								<TextField
									label="Shadow Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}ShadowColor`] || 'rgba(0,0,0,0.5)'}
									onChange={(e) =>
										updateState(`${prefix}ShadowColor`, e.target.value)
									}
								/>
							</div>
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>
		);
	};

	return (
		<Grid container spacing={6}>
			{/* --- HEADER BUTTON --- */}
			<Grid item xs={12} className="flex justify-end">
				<Button
					variant="outlined"
					color="info"
					startIcon={<i className="tabler-info-circle" />}
					onClick={() => setModalOpen(true)}
				>
					View Placeholders
				</Button>
			</Grid>

			{/* --- COL 1: TOGGLES & CHANNELS --- */}
			<Grid item xs={12} lg={6}>
				<div className="flex flex-col gap-6">
					{/* Feature Toggles */}
					<Card>
						<CardHeader title="🔧 Feature Settings" />
						<CardContent className="flex flex-col gap-4">
							<div className="flex items-center justify-between border-b border-divider pb-2">
								<div>
									<Typography variant="subtitle1" className="font-medium">
										Welcome In Message
									</Typography>
									<Typography variant="caption">
										Send message when member joins
									</Typography>
								</div>
								<Switch
									checked={formData.welcomeInOn || false}
									onChange={(e) => updateState('welcomeInOn', e.target.checked)}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<Typography variant="subtitle1" className="font-medium">
										Goodbye Message
									</Typography>
									<Typography variant="caption">
										Send message when member leaves
									</Typography>
								</div>
								<Switch
									checked={formData.welcomeOutOn || false}
									onChange={(e) =>
										updateState('welcomeOutOn', e.target.checked)
									}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Channel Settings */}
					<Card>
						<CardHeader title="📢 Channels & Roles" />
						<CardContent className="flex flex-col gap-4">
							<FormControl fullWidth>
								<InputLabel>Welcome In Channel</InputLabel>
								<Select
									label="Welcome In Channel"
									value={formData.welcomeInChannelId || ''}
									onChange={(e) =>
										updateState('welcomeInChannelId', e.target.value)
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

							<FormControl fullWidth>
								<InputLabel>Welcome Out Channel</InputLabel>
								<Select
									label="Welcome Out Channel"
									value={formData.welcomeOutChannelId || ''}
									onChange={(e) =>
										updateState('welcomeOutChannelId', e.target.value)
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

							<FormControl fullWidth>
								<InputLabel>Welcome Role (Auto-Role)</InputLabel>
								<Select
									label="Welcome Role (Auto-Role)"
									value={formData.welcomeRoleId || ''}
									onChange={(e) => updateState('welcomeRoleId', e.target.value)}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{roles.map((r) => (
										<MenuItem
											key={r.id}
											value={r.id}
											style={{
												color: r.color !== '#000000' ? r.color : 'inherit',
											}}
										>
											@ {r.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</CardContent>
					</Card>
				</div>
			</Grid>

			{/* --- COL 2: MESSAGE CONTENT --- */}
			<Grid item xs={12} lg={6}>
				<div className="flex flex-col gap-6">
					{/* Welcome In */}
					<Card>
						<CardHeader title="👋 Welcome In Content" />
						<CardContent className="flex flex-col gap-4">
							<TextField
								label="Message Text"
								multiline
								rows={3}
								fullWidth
								placeholder="Welcome {username}! You are the #{members} member."
								value={formData.welcomeInText || ''}
								onChange={(e) => updateState('welcomeInText', e.target.value)}
							/>
							<TextField
								label="Background Image URL"
								fullWidth
								size="small"
								placeholder="https://example.com/bg.jpg"
								value={formData.welcomeInBackgroundUrl || ''}
								onChange={(e) =>
									updateState('welcomeInBackgroundUrl', e.target.value)
								}
							/>
						</CardContent>
					</Card>

					{/* Welcome Out */}
					<Card>
						<CardHeader title="🚪 Goodbye Content" />
						<CardContent className="flex flex-col gap-4">
							<TextField
								label="Message Text"
								multiline
								rows={3}
								fullWidth
								placeholder="Goodbye {username}! We'll miss you."
								value={formData.welcomeOutText || ''}
								onChange={(e) => updateState('welcomeOutText', e.target.value)}
							/>
							<TextField
								label="Background Image URL"
								fullWidth
								size="small"
								placeholder="https://example.com/bg.jpg"
								value={formData.welcomeOutBackgroundUrl || ''}
								onChange={(e) =>
									updateState('welcomeOutBackgroundUrl', e.target.value)
								}
							/>
						</CardContent>
					</Card>
				</div>
			</Grid>

			{/* --- FULL WIDTH: ADVANCED SETTINGS --- */}
			<Grid item xs={12}>
				{renderAdvancedSettings('In')}
			</Grid>
			<Grid item xs={12}>
				{renderAdvancedSettings('Out')}
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

			{/* --- PLACEHOLDERS MODAL --- */}
			<Dialog
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				maxWidth="md"
				scroll="paper"
			>
				<DialogTitle className="flex items-center gap-2">
					<i className="tabler-code" /> Available Placeholders
				</DialogTitle>
				<DialogContent dividers>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						{[
							{ code: '{userId}', desc: "Member's ID" },
							{ code: '{username}', desc: "Member's Username" },
							{ code: '{mention}', desc: 'Tag Member (@User)' },
							{ code: '{guildName}', desc: 'Server Name' },
							{ code: '{members}', desc: 'Total Member Count' },
							{ code: '{memberJoin}', desc: 'Join Date' },
							{ code: '{createdAt}', desc: 'Server Created Date' },
							{ code: '{ownerName}', desc: 'Server Owner' },
						].map((p, i) => (
							<div
								key={i}
								className="flex flex-col border-b border-divider pb-2"
							>
								<code className="text-primary font-bold">{p.code}</code>
								<span className="text-textSecondary">{p.desc}</span>
							</div>
						))}
						{/* Tambahin sisa placeholder dari list kamu */}
					</div>
					<Alert severity="info" className="mt-4">
						You can use these placeholders in both Welcome and Goodbye messages!
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setModalOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>

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

export default WelcomeForm;
