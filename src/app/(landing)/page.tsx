// src/app/[lang]/(marketing)/page.tsx

// React Imports
// import { Suspense } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { kythiaConfig } from '@config';

// Next Auth
import { getServerSession } from 'next-auth';

// MUI Imports
import Button from '@mui/material/Button';

// import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// import Divider from '@mui/material/Divider'
import classnames from 'classnames';

import { authOptions } from '@/libs/auth';

import frontCommonStyles from '@views/front-pages/styles.module.css';

// Libs
import { fetchAPI } from '@/libs/api';
import { trackVisitor } from '@/app/actions/visitor';

// Component Buat Partikel (Client Side)
// import ParticleBackground from '@/components/layout/front-pages/ParticleBackground'

// Helper Icon (Biar rapi)
const Icon = ({ name, className }: { name: string; className?: string }) => (
	<i className={`tabler-${name} ${className}`} />
);

const logo: string = kythiaConfig.assets.homePageHeroImage;

// Client Component for Marquee
import TrustedByMarquee from '@/components/landing/TrustedByMarquee';
import DraggableFeatureGrid from '@/components/landing/DraggableFeatureGrid';

export default async function LandingPage() {
	// 1. Fetch Data Realtime
	const session = await getServerSession(authOptions);
	const stats = (await fetchAPI('/meta/stats', { revalidate: 3600 })) || {
		totalServers: 0,
		totalMembers: 0,
	};

	const visitorStats = await trackVisitor();
	const guilds = ((await fetchAPI('/guilds', { revalidate: 3600 })) || [])
		.sort((a: any, b: any) => b.memberCount - a.memberCount)
		.slice(0, 10);

	return (
		<section>
			{/* ================= HERO SECTION ================= */}
			<section
				id="hero"
				className={classnames(
					'relative min-h-[90vh] flex items-center',
					frontCommonStyles.layoutSpacing,
				)}
			>
				<div className="container mx-auto  relative z-10">
					<Grid container spacing={6} alignItems="center">
						{/* Text Side */}
						<Grid item xs={12} lg={7}>
							<h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
								Your <span className="hero-title">Cutest</span> <br />
								Discord Companion.
							</h1>

							<p className="text-xl  mb-8 max-w-2xl leading-relaxed">
								AI, Auto Moderation, Music, Economy, Welcome Messages. Kythia is
								ready to make your server more lively and secure.
							</p>

							<div className="flex flex-wrap gap-4">
								<Button
									href={`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}`}
									target="_blank"
									variant="contained"
									size="large"
									className="rounded-xl py-3 px-8 text-lg font-bold shadow-lg shadow-primary/25"
									startIcon={<Icon name="plus" />}
								>
									Add Bot
								</Button>

								{session ? (
									<Link href="/dash">
										<Button
											variant="outlined"
											size="large"
											className="rounded-xl py-3 px-8 text-lg font-bold border-gray-700  hover:bg-white/5"
											startIcon={<Icon name="settings" />}
										>
											Manage Server
										</Button>
									</Link>
								) : (
									<Link href="/login">
										<Button
											variant="outlined"
											size="large"
											className="rounded-xl py-3 px-8 text-lg font-bold border-gray-700  hover:bg-white/5"
											startIcon={<Icon name="login" />}
										>
											Manage Server
										</Button>
									</Link>
								)}
							</div>
						</Grid>

						{/* Image Side (Hero) */}
						<Grid item xs={12} lg={5} className="hidden lg:block relative">
							<div className="relative w-full h-[500px] animate-float">
								<Image
									src={logo}
									alt="Hero"
									fill
									className="object-contain "
									priority
									unoptimized
								/>
							</div>
						</Grid>
					</Grid>
				</div>
			</section>

			{/* ================= STATS BADGE ================= */}
			<section className={classnames('py-8', frontCommonStyles.layoutSpacing)}>
				<div className="container mx-auto flex flex-col items-center gap-6">
					<div className="flex flex-wrap justify-center gap-6">
						{/* Server Stats */}
						<div className="glass px-8 py-4 rounded-full flex items-center gap-6 border bg-white/[0.02]">
							<Icon name="shield-check" className="text-3xl text-primary" />
							<div>
								<Typography
									variant="h6"
									className="font-bold flex gap-2 items-center "
								>
									Trusted by
									<span className="text-primary text-2xl">
										{stats.totalServers.toLocaleString()}
									</span>{' '}
									servers &
									<span className="text-primary text-2xl">
										{stats.totalMembers.toLocaleString()}
									</span>{' '}
									members
								</Typography>
							</div>
						</div>

						{/* Visitor Stats */}
						<div className="glass px-8 py-4 rounded-full flex items-center gap-6 border bg-white/[0.02]">
							<Icon name="world" className="text-3xl text-info" />
							<div>
								<Typography
									variant="h6"
									className="font-bold flex gap-2 items-center "
								>
									<span className="text-info text-2xl">
										{visitorStats.totalVisitors.toLocaleString()}
									</span>{' '}
									Unique Visitors
									<span className="text-info text-2xl">
										{visitorStats.todayVisitors.toLocaleString()}
									</span>{' '}
									Visit Today
								</Typography>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ================= TRUSTED BY (Guilds) ================= */}
			{guilds.length > 0 && (
				<section className="py-16 overflow-hidden">
					<div className="mx-auto mb-10 text-center">
						<h2 className="text-3xl font-bold mb-2">Trusted by Communities</h2>
						<p className="text-gray-400">
							Kythia is powering these amazing servers
						</p>
					</div>

					<TrustedByMarquee guilds={guilds} />
				</section>
			)}

			{/* ================= HIGHLIGHTS (Zig-Zag Layout) ================= */}
			<section
				className={classnames(
					'py-20 space-y-24 container mx-auto ',
					frontCommonStyles.layoutSpacing,
				)}
			>
				<Grid container spacing={8} alignItems="center">
					<Grid item xs={12} lg={6} className="order-2 lg:order-1 text-right">
						<h2 className="text-4xl font-bold mb-4">
							AI Chat — In Server & DM
						</h2>
						<p className="text-lg  mb-6">
							Chat with Kythia&apos;s advanced AI anywhere! Get instant answers,
							creative ideas, or just have fun conversations.
						</p>
						<ul className="space-y-3 mb-8 flex flex-col items-end">
							<li className="flex items-center gap-3">
								<span className="">Natural, context-aware conversations</span>{' '}
								<Icon name="robot" className="text-primary text-xl" />
							</li>
							<li className="flex items-center gap-3">
								<span className="">DM Kythia for private AI chat</span>{' '}
								<Icon name="message" className="text-success text-xl" />
							</li>
							<li className="flex items-center gap-3">
								<span className="">Customizable AI personality</span>{' '}
								<Icon name="wand" className="text-info text-xl" />
							</li>
						</ul>
						<Button
							variant="contained"
							href="/commands"
							startIcon={<Icon name="robot" />}
						>
							Try AI Chat
						</Button>
					</Grid>
					<Grid item xs={12} lg={6} className="order-1 lg:order-2">
						<Card className="glass border border-white/10 overflow-hidden">
							<CardContent className="p-0 m-0">
								<Image
									src={kythiaConfig.assets.homePageFeatureAi}
									alt="AI"
									width={800}
									height={500}
									objectFit="cover"
									className="w-full h-full object-cover"
									unoptimized
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Highlight 2: Music */}
				<Grid container spacing={8} alignItems="center">
					<Grid item xs={12} lg={6}>
						<Card className="glass border border-white/10 overflow-hidden">
							<CardContent className="p-0">
								<Image
									src={kythiaConfig.assets.homePageFeatureMusic}
									alt="Music"
									width={800}
									height={500}
									objectFit="cover"
									className="w-full h-full object-cover"
									unoptimized
								/>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} lg={6}>
						<h2 className="text-4xl font-bold mb-4">Fancy Music Experience</h2>
						<p className="text-lg  mb-6">
							Enjoy music with a modern, interactive player UI. Queue, skip,
							loop, and control everything with stylish buttons.
						</p>
						<ul className="space-y-3 mb-8">
							<li className="flex items-center gap-3">
								<Icon name="music" className="text-primary text-xl" />{' '}
								<span className="">Play from YouTube, Spotify, and more</span>
							</li>
							<li className="flex items-center gap-3">
								<Icon name="list" className="text-success text-xl" />{' '}
								<span className="">Visual queue & progress bar</span>
							</li>
							<li className="flex items-center gap-3">
								<Icon name="player-play" className="text-warning text-xl" />{' '}
								<span className="">Interactive controls in chat</span>
							</li>
						</ul>
						<Button
							variant="outlined"
							color="info"
							href="/commands"
							startIcon={<Icon name="music" />}
						>
							See Music Features
						</Button>
					</Grid>
				</Grid>

				{/* Highlight 3: Dashboard */}
				<Grid container spacing={8} alignItems="center">
					<Grid item xs={12} lg={6} className="order-2 lg:order-1 text-right">
						<h2 className="text-4xl font-bold mb-4">All-in-One Dashboard</h2>
						<p className="text-lg  mb-6">
							Take full control of your server with Kythia&apos;s intuitive
							dashboard. Configure everything in one place, no coding needed!
						</p>
						<Button
							variant="contained"
							href="/en/dash"
							startIcon={<Icon name="dashboard" />}
						>
							Open Dashboard
						</Button>
					</Grid>
					<Grid item xs={12} lg={6} className="order-1 lg:order-2">
						<Card className="glass border border-white/10 overflow-hidden">
							<CardContent className="p-0">
								<Image
									src={kythiaConfig.assets.homePageFeatureDashboard}
									alt="Dashboard"
									width={800}
									height={500}
									objectFit="cover"
									className="w-full h-full object-cover"
									unoptimized
								/>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Highlight 4: Global Chat */}
				<Grid container spacing={8} alignItems="center">
					<Grid item xs={12} lg={6}>
						<Card className="glass border border-white/10 overflow-hidden">
							<CardContent className="p-0">
								<Image
									src={kythiaConfig.assets.homePageFeatureGlobalChat}
									alt="Global Chat"
									width={800}
									height={500}
									objectFit="cover"
									className="w-full h-full object-cover"
									unoptimized
								/>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} lg={6}>
						<h2 className="text-4xl font-bold mb-4">Global Chat</h2>
						<p className="text-lg  mb-6">
							Connect and chat with users from different servers in real time!
							Safe & moderated environment.
						</p>
						<Button
							variant="outlined"
							color="warning"
							href="https://global.discord.my.id"
							target="_blank"
							startIcon={<Icon name="world" />}
						>
							Learn More
						</Button>
					</Grid>
				</Grid>
			</section>

			{/* ================= FEATURES GRID ================= */}
			<section
				className={classnames('py-24', frontCommonStyles.layoutSpacing)}
				id="features"
			>
				<div className="container mx-auto ">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">One Bot for All Needs</h2>
						<p className="">
							Kythia comes equipped with various modules you can configure.
						</p>
					</div>

					<DraggableFeatureGrid initialFeatures={features} />
				</div>
			</section>

			{/* ================= CTA ================= */}
			<section className={classnames('py-20', frontCommonStyles.layoutSpacing)}>
				<div className="container mx-auto ">
					<div className="glass bg-white/[0.02] rounded-3xl p-12 text-center relative overflow-hidden">
						<div className="relative z-10">
							<h2 className="text-4xl md:text-5xl font-bold mb-6">
								Ready to Start Your Adventure?
							</h2>
							<p className="text-xl  mb-8">
								Add Kythia to your server now and feel the difference.
							</p>
							<Button
								href={`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&scope=bot+applications.commands&permissions=8`}
								target="_blank"
								variant="contained"
								size="large"
								className="rounded-xl py-3 px-10 text-lg font-bold"
							>
								Add Kythia Now
							</Button>
						</div>
						{/* Glow BG */}
						<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl -z-0"></div>
					</div>
				</div>
			</section>
		</section>
	);
}

// --- DATA ---
const features = [
	{
		title: 'AI Chat',
		desc: 'Chat with Kythia AI anywhere.',
		icon: 'brain',
		color: 'primary',
	},
	{
		title: 'Music',
		desc: 'High quality music playback.',
		icon: 'music',
		color: 'success',
	},
		{
		title: 'Moderation',
		desc: 'Advanced mod tools.',
		icon: 'gavel',
		color: 'secondary',
	},
	{
		title: 'Auto Mod',
		desc: 'Keep your server safe 24/7.',
		icon: 'shield-check',
		color: 'error',
	},
	{
		title: 'Economy',
		desc: 'Global currency & trading.',
		icon: 'currency-dollar',
		color: 'warning',
	},
	{
		title: 'Leveling',
		desc: 'Reward active members.',
		icon: 'trophy',
		color: 'info',
	},
	{
		title: 'Fun',
		desc: 'Games and fun commands.',
		icon: 'dice',
		color: 'secondary',
	},
	{
		title: 'Utilities',
		desc: 'Polls, reminders, etc.',
		icon: 'tools',
		color: 'primary',
	},
	{
		title: 'Giveaway',
		desc: 'Run giveaways easily.',
		icon: 'gift',
		color: 'error',
	},
	{
		title: 'Ticket',
		desc: 'Support ticket system.',
		icon: 'ticket',
		color: 'success',
	},
	{ title: 'Pet', desc: 'Adopt virtual pets.', icon: 'paw', color: 'warning' },
	{
		title: 'Store',
		desc: 'Sell digital products.',
		icon: 'shopping-cart',
		color: 'info',
	},
	{
		title: 'Logs',
		desc: 'Record all activities.',
		icon: 'file-text',
		color: 'secondary',
	},
	{
		title: 'Welcome',
		desc: 'Custom welcome messages.',
		icon: 'door-enter',
		color: 'primary',
	},
	{
		title: 'Reaction Roles',
		desc: 'Self-assignable roles.',
		icon: 'fingerprint',
		color: 'error',
	},

];
