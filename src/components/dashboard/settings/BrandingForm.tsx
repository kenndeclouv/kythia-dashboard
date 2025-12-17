'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type Props = {
	guildId: string;
	initialSettings: any;
	botUser: { username: string; avatar: string; discriminator: number }; // Data default bot
};

const BrandingForm = ({ guildId, initialSettings, botUser }: Props) => {
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
			// Nanti di API handler, cek apakah user Premium sebelum save!
			await fetch(`/api/proxy/guilds/settings/${guildId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			setToast({
				open: true,
				message: 'Branding updated successfully!',
				severity: 'success',
			});
			router.refresh();
		} catch (error) {
			setToast({
				open: true,
				message: 'Failed to update branding',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	// Fallback values
	const displayName = formData.botName || botUser.username;
	const avatar = formData.botAvatarUrl || botUser.avatar;
	const banner = formData.botBannerUrl; // Kalau null, warna solid
	const bio =
		formData.botBio || `Hi! I am ${botUser.username}, a cool multipurpose bot.`;

	return (
		<Grid container spacing={6}>
			{/* === COL 1: FORM INPUT === */}
			<Grid item xs={12} md={6}>
				<Card className="h-full">
					<CardHeader
						title="🎨 Bot Identity"
						subheader="Customize how the bot looks in this server (Premium)"
						action={
							<div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">
								PRO
							</div>
						}
					/>
					<CardContent className="flex flex-col gap-5">
						<TextField
							fullWidth
							label="Bot Nickname"
							placeholder={botUser.username}
							value={formData.botName || ''}
							onChange={(e) => updateState('botName', e.target.value)}
							helperText="Change the bot's display name"
						/>

						<TextField
							fullWidth
							label="Avatar URL"
							placeholder="https://imgur.com/..."
							value={formData.botAvatarUrl || ''}
							onChange={(e) => updateState('botAvatarUrl', e.target.value)}
							helperText="Direct link to image (PNG/GIF)"
						/>

						<TextField
							fullWidth
							label="Banner URL"
							placeholder="https://imgur.com/..."
							value={formData.botBannerUrl || ''}
							onChange={(e) => updateState('botBannerUrl', e.target.value)}
							helperText="Direct link to banner image (wide)"
						/>

						<TextField
							fullWidth
							multiline
							rows={4}
							label="About Me / Bio"
							placeholder="I am a bot..."
							value={formData.botBio || ''}
							onChange={(e) => updateState('botBio', e.target.value)}
						/>
					</CardContent>
				</Card>
			</Grid>

			{/* === COL 2: LIVE PREVIEW (Discord Style) === */}
			<Grid item xs={12} md={6}>
				<div className="sticky top-24">
					<Typography
						variant="h6"
						className="mb-4 text-center uppercase tracking-widest text-textDisabled font-bold"
					>
						Live Preview
					</Typography>

					{/* DISCORD PROFILE CARD MOCKUP */}
					<div className="w-[340px] mx-auto bg-[#111214] rounded-2xl overflow-hidden shadow-2xl border border-[#2e2f33] relative group">
						{/* Banner */}
						<div
							className="h-[120px] w-full bg-[#5865F2] bg-cover bg-center transition-all duration-500"
							style={{ backgroundImage: banner ? `url(${banner})` : undefined }}
						/>

						{/* Avatar */}
						<div className="absolute top-[76px] left-[22px]">
							<div className="rounded-full p-[6px] bg-[#111214]">
								<Avatar
									src={avatar}
									sx={{ width: 80, height: 80 }}
									className="border-2 border-transparent"
								/>
								{/* Status Indicator */}
								<div className="absolute bottom-1 right-1 w-6 h-6 bg-[#23a559] rounded-full border-[4px] border-[#111214]"></div>
							</div>
						</div>

						{/* Badge List (Hiasan) */}
						<div className="absolute top-[130px] right-4 flex gap-1 bg-[#111214]/80 p-1 rounded-lg">
							<div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold">
								✔
							</div>
						</div>

						{/* User Info */}
						<div className="mt-12 px-4 pb-4 bg-[#111214]">
							<div className="text-xl font-bold text-white flex items-center gap-2">
								{displayName}
								{/* Bot Tag */}
								<span className="bg-[#5865F2] text-white text-[10px] px-1.5 rounded flex items-center h-4 align-middle mt-1">
									<i className="tabler-check text-[8px] mr-0.5"></i>BOT
								</span>
							</div>
							<div className="text-sm text-gray-400 font-medium mb-4">
								{botUser.username}{' '}
								<span className="text-gray-500">#{botUser.discriminator}</span>
							</div>

							<Divider className="border-gray-700 mb-3" />

							<div className="uppercase text-xs font-bold text-gray-300 mb-2">
								About Me
							</div>
							<div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
								{bio}
							</div>

							<div className="mt-4">
								<div className="text-xs font-bold text-gray-300 uppercase mb-2">
									Member Since
								</div>
								<div className="flex items-center gap-2 text-gray-400 text-sm">
									<div className="w-2 h-2 rounded-full bg-gray-500"></div>
									Dec 11, 2025
								</div>
							</div>
						</div>
					</div>

					<Typography
						variant="caption"
						className="text-center block mt-4 text-textDisabled"
					>
						*Actual rendering may vary slightly based on Discord updates.
					</Typography>
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
			>
				<Alert severity={toast.severity} variant="filled">
					{toast.message}
				</Alert>
			</Snackbar>
		</Grid>
	);
};

export default BrandingForm;
