// src/app/[lang]/(dashboard)/(private)/dash/[id]/page.tsx

// Next Imports
import { notFound } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar';

// Libs
import { fetchAPI } from '@/libs/api';

// --- TYPES (Updated sesuai JSON kamu) ---
interface GuildData {
	id: string;
	name: string;
	icon: string | null;
	features: string[];
	memberCount: number;
	premiumSubscriptionCount: number; // Boosts
	premiumTier: number; // Boost Level
	ownerId: string;
	preferredLocale: string;
	createdTimestamp: number;
	joinedTimestamp: number; // Kapan bot join
	verificationLevel: number;
	explicitContentFilter: number;
	mfaLevel: number;
	description: string | null;
	bannerURL: string | null;
	iconURL: string | null;
	splashURL: string | null;
}

interface ChannelData {
	id: string;
	name: string;
}

interface RoleData {
	id: string;
	name: string;
	color: string;
	managed: boolean;
}

interface DashboardResponse {
	guild: GuildData;
	settings: any;
	channels: {
		text: ChannelData[];
		voice: ChannelData[];
		categories: ChannelData[];
	};
	roles: RoleData[];
}

// --- HELPERS ---
const formatDate = (timestamp: number) => {
	if (!timestamp) return '-';

	return new Date(timestamp).toLocaleDateString('id-ID', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

// Mapping Verification Level ke Text
const VERIFICATION_LEVELS = ['None', 'Low', 'Medium', 'High', 'Highest'];

// Mapping Filter Content
const CONTENT_FILTER = ['Disabled', 'Members without Roles', 'All Members'];

// --- PAGE COMPONENT ---
const ServerDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	// Fetch Data (Pastikan endpoint ini bener return JSON lengkap tadi)
	const data: DashboardResponse = await fetchAPI(`/guilds/${id}?data=all`);

	if (!data || !data.guild) {
		return notFound();
	}

	const { guild, channels, roles } = data;

	// Hitung Stats
	const totalChannels =
		(channels.text?.length || 0) +
		(channels.voice?.length || 0) +
		(channels.categories?.length || 0);
	const totalRoles = roles.length;
	const boostProgress = (guild.premiumSubscriptionCount / 14) * 100; // Asumsi level 3 butuh 14 boost

	return (
		<Grid container spacing={6}>
			{/* ================= HERO SECTION ================= */}
			<Grid item xs={12}>
				<Card className="relative overflow-hidden border-0 shadow-lg">
					{/* Banner Image / Gradient */}
					<div
						className="h-40 w-full bg-cover bg-center mb-10"
						style={{
							backgroundImage: guild.bannerURL
								? `url(${guild.bannerURL})`
								: 'linear-gradient(135deg, #7367F0 10%, #CE9FFC 100%)',
						}}
					/>

					{/* Overlay Gradient biar text kebaca (kalo ada banner) */}
					<div className="absolute top-0 left-0 w-full h-40 pb-10 bg-gradient-to-t from-black/60 to-transparent"></div>

					<CardContent className="relative pt-0 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 pb-6 px-8">
						{/* Server Icon */}
						<div className="relative">
							<CustomAvatar
								src={guild.iconURL || ''}
								alt={guild.name}
								variant="rounded"
								size={140}
								className="border-[6px] border-background-paper shadow-2xl bg-background-paper text-4xl font-bold"
							>
								{guild.name.substring(0, 2).toUpperCase()}
							</CustomAvatar>
							{/* Online Indicator (Hiasan) */}
							{/* <span className="absolute bottom-2 right-2 w-6 h-6 bg-success border-4 border-background-paper rounded-full"></span> */}
						</div>

						{/* Info Server */}
						<div className="flex-1 text-center sm:text-left mb-2 mt-4 sm:mt-0">
							<Typography
								variant="h3"
								className="font-extrabold text-textPrimary flex items-center justify-center sm:justify-start gap-3 flex-wrap"
							>
								{guild.name}
								{/* Badges */}
								{guild.features.includes('PARTNERED') && (
									<Chip
										label="Partner"
										color="primary"
										size="small"
										icon={<i className="tabler-certificate" />}
										className="font-bold"
									/>
								)}
								{guild.features.includes('VERIFIED') && (
									<Chip
										label="Verified"
										color="success"
										size="small"
										icon={<i className="tabler-check" />}
										className="font-bold"
									/>
								)}
							</Typography>

							<div className="flex items-center justify-center sm:justify-start gap-2 text-textSecondary mt-1">
								<i className="tabler-id" />
								<Typography variant="body2" className="font-mono">
									{guild.id}
								</Typography>
							</div>

							{/* Quick Info Chips */}
							<div className="flex gap-3 justify-center sm:justify-start mt-4 flex-wrap">
								<Chip
									icon={<i className="tabler-calendar" />}
									label={`Created: ${formatDate(guild.createdTimestamp)}`}
									size="small"
									variant="tonal"
									color="secondary"
								/>
								<Chip
									icon={<i className="tabler-robot" />}
									label={`Bot Joined: ${formatDate(guild.joinedTimestamp)}`}
									size="small"
									variant="tonal"
									color="primary"
								/>
								<Chip
									icon={<i className="tabler-world" />}
									label={guild.preferredLocale}
									size="small"
									variant="tonal"
								/>
							</div>
						</div>

						{/* Action Button (Optional) */}
						{/* <div className='mb-4 sm:mb-2'>
                <Button variant='contained' startIcon={<i className='tabler-settings' />}>Edit Config</Button>
            </div> */}
					</CardContent>
				</Card>
			</Grid>

			{/* ================= STATS CARDS ================= */}
			{[
				{
					title: 'Total Members',
					value: guild.memberCount,
					icon: 'tabler-users',
					color: 'primary',
					bg: 'bg-primary/10',
				},
				{
					title: 'Total Roles',
					value: totalRoles,
					icon: 'tabler-shield-lock',
					color: 'success',
					bg: 'bg-success/10',
				},
				{
					title: 'Total Channels',
					value: totalChannels,
					icon: 'tabler-hash',
					color: 'warning',
					bg: 'bg-warning/10',
				},
				{
					title: 'Boost Count',
					value: guild.premiumSubscriptionCount,
					icon: 'tabler-rocket',
					color: 'error',
					bg: 'bg-error/10',
				},
			].map((stat, index) => (
				<Grid item xs={12} sm={6} md={3} key={index}>
					<Card className="hover:-translate-y-1 transition-transform duration-300">
						<CardContent className="flex items-center gap-4">
							<div className={`p-3 rounded-lg ${stat.bg}`}>
								<i className={`${stat.icon} text-3xl text-${stat.color}`} />
							</div>
							<div className="flex flex-col">
								<Typography variant="h4" className="font-bold">
									{stat.value.toLocaleString()}
								</Typography>
								<Typography
									variant="body2"
									color="textSecondary"
									className="font-medium uppercase tracking-wider text-xs"
								>
									{stat.title}
								</Typography>
							</div>
						</CardContent>
					</Card>
				</Grid>
			))}

			{/* ================= DETAILS GRID ================= */}
			<Grid item xs={12} md={4}>
				<Grid container spacing={6}>
					{/* Server Details Card */}
					<Grid item xs={12}>
						<Card>
							<CardHeader title="ℹ️ Server Information" />
							<CardContent>
								<List dense className="pt-0">
									<ListItem className="px-0">
										<ListItemIcon>
											<i className="tabler-crown text-xl" />
										</ListItemIcon>
										<ListItemText
											primary="Owner ID"
											secondary={guild.ownerId}
										/>
									</ListItem>
									<Divider component="li" />
									<ListItem className="px-0">
										<ListItemIcon>
											<i className="tabler-shield-check text-xl" />
										</ListItemIcon>
										<ListItemText
											primary="Verification Level"
											secondary={
												<Chip
													label={VERIFICATION_LEVELS[guild.verificationLevel]}
													size="small"
													color={
														guild.verificationLevel > 2 ? 'success' : 'default'
													}
													className="mt-1"
												/>
											}
										/>
									</ListItem>
									<Divider component="li" />
									<ListItem className="px-0">
										<ListItemIcon>
											<i className="tabler-eye-off text-xl" />
										</ListItemIcon>
										<ListItemText
											primary="Explicit Content Filter"
											secondary={CONTENT_FILTER[guild.explicitContentFilter]}
										/>
									</ListItem>
									<Divider component="li" />
									<ListItem className="px-0">
										<ListItemIcon>
											<i className="tabler-lock text-xl" />
										</ListItemIcon>
										<ListItemText
											primary="2FA Requirement"
											secondary={
												guild.mfaLevel === 1
													? 'Enabled (2FA Required)'
													: 'Disabled'
											}
										/>
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>

					{/* Boost Status */}
					<Grid item xs={12}>
						<Card>
							<CardHeader title="🚀 Boost Status" />
							<CardContent>
								<div className="flex justify-between mb-2">
									<Typography variant="body2" className="font-bold">
										Level {guild.premiumTier}
									</Typography>
									<Typography variant="body2">
										{guild.premiumSubscriptionCount} Boosts
									</Typography>
								</div>
								<LinearProgress
									variant="determinate"
									value={Math.min(boostProgress, 100)}
									color="secondary"
									className="h-3 rounded-full mb-4"
								/>
								<Typography variant="caption" color="textSecondary">
									Server needs more boosts to reach next level perks.
								</Typography>
							</CardContent>
						</Card>
					</Grid>

					{/* Features List */}
					<Grid item xs={12}>
						<Card>
							<CardHeader title="✨ Enabled Features" />
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{guild.features.map((feat, i) => (
										<Chip
											key={i}
											label={feat.replace(/_/g, ' ')}
											size="small"
											variant="outlined"
											className="bg-actionHover text-xs"
										/>
									))}
									{guild.features.length === 0 && (
										<Typography variant="body2">
											No special features.
										</Typography>
									)}
								</div>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>

			{/* ================= CONTENT GRID (Channels & Roles) ================= */}
			<Grid item xs={12} md={8}>
				<Grid container spacing={6}>
					{/* Channels Card */}
					<Grid item xs={12}>
						<Card>
							<CardHeader
								title="📺 Channels Structure"
								subheader={`${channels.categories.length} Categories • ${channels.text.length} Text • ${channels.voice.length} Voice`}
								action={<Chip label="View Only" size="small" />}
							/>
							<CardContent className="max-h-[400px] overflow-auto custom-scrollbar">
								{/* List Categories & Channels secara manual biar rapi */}
								{channels.categories.length > 0
									? channels.categories.map((cat) => (
											<div key={cat.id} className="mb-4">
												<div className="flex items-center gap-2 text-textSecondary uppercase text-xs font-bold mb-2 sticky top-0 bg-backgroundPaper py-1 z-10">
													<i className="tabler-folder" /> {cat.name}
												</div>

												{/* NOTE: Di API structure kamu sekarang, channel gak punya parentId.
                                      Jadi kita list text/voice terpisah di bawah aja ya.
                                      Nanti kalau API udah support grouping, bisa di-nest disini.
                                    */}
											</div>
										))
									: null}

								{/* Flat List (Fallback karena API belum grouping by parent) */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
									<div>
										<Typography
											variant="caption"
											className="block mb-2 font-bold text-primary"
										>
											TEXT CHANNELS
										</Typography>
										{channels.text.map((ch) => (
											<div
												key={ch.id}
												className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-actionHover transition-colors"
											>
												<i className="tabler-hash text-textDisabled" />
												<span className="truncate">{ch.name}</span>
											</div>
										))}
									</div>
									<div>
										<Typography
											variant="caption"
											className="block mb-2 font-bold text-success"
										>
											VOICE CHANNELS
										</Typography>
										{channels.voice.map((ch) => (
											<div
												key={ch.id}
												className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-actionHover transition-colors"
											>
												<i className="tabler-volume text-textDisabled" />
												<span className="truncate">{ch.name}</span>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					</Grid>

					{/* Roles Card */}
					<Grid item xs={12}>
						<Card>
							<CardHeader
								title="🛡️ Server Roles"
								subheader={`${roles.length} roles found`}
							/>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{roles.map((role) => (
										<Chip
											key={role.id}
											label={role.name}
											size="small"
											style={{
												borderColor:
													role.color !== '#000000' ? role.color : undefined,
												backgroundColor:
													role.color !== '#000000'
														? `${role.color}15`
														: undefined, // 15% opacity
												color:
													role.color !== '#000000' ? role.color : 'inherit',
												fontWeight: 600,
											}}
											variant={role.color !== '#000000' ? 'filled' : 'outlined'}
											className="border"
										/>
									))}
								</div>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default ServerDetailPage;
