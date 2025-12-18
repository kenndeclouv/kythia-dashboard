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

// Component Buat Partikel (Client Side)
// import ParticleBackground from '@/components/layout/front-pages/ParticleBackground'

// Helper Icon (Biar rapi)
const Icon = ({ name, className }: { name: string; className?: string }) => (
	<i className={`tabler-${name} ${className}`} />
);

const logo: string = kythiaConfig.assets.homePageHeroImage;

export default async function LandingPage() {
	// 1. Fetch Data Realtime
	const session = await getServerSession(authOptions);
	const stats = (await fetchAPI('/meta/stats', { revalidate: 3600 })) || {
		totalServers: 0,
		totalMembers: 0,
	};

	return (
		<section>
			<div
				className={classnames('flex flex-col', frontCommonStyles.layoutSpacing)}
			>
				{/* ================= HERO SECTION ================= */}
				<section id="hero" className="relative min-h-[90vh] flex items-center ">
					<div className="container mx-auto  relative z-10">
						<Grid container spacing={6} alignItems="center">
							{/* Text Side */}
							<Grid item xs={12} lg={7}>
								<h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
									Your <span className="hero-title">Cutest</span> <br />
									Discord Companion.
								</h1>

								<p className="text-xl  mb-8 max-w-2xl leading-relaxed">
									AI, Auto Moderation, Music, Economy, Welcome Messages. Kythia
									is ready to make your server more lively and secure.
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
				<section className="py-8">
					<div className="container mx-auto flex justify-center">
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
					</div>
				</section>

				{/* ================= HIGHLIGHTS (Zig-Zag Layout) ================= */}
				<section className="py-20 space-y-24 container mx-auto ">
					{/* Highlight 1: AI Chat */}
					<Grid container spacing={8} alignItems="center">
						<Grid item xs={12} lg={6} className="order-2 lg:order-1 text-right">
							<h2 className="text-4xl font-bold mb-4">
								AI Chat — In Server & DM
							</h2>
							<p className="text-lg  mb-6">
								Chat with Kythia&apos;s advanced AI anywhere! Get instant
								answers, creative ideas, or just have fun conversations.
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
								<CardContent className="p-0">
									<Image
										src={kythiaConfig.assets.homePageFeatureAi}
										alt="AI"
										width={800}
										height={500}
										className="w-full object-cover"
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
										className="w-full object-cover"
										unoptimized
									/>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} lg={6}>
							<h2 className="text-4xl font-bold mb-4">
								Fancy Music Experience
							</h2>
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
										className="w-full object-cover"
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
										className="w-full object-cover"
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
				<section className="py-24" id="features">
					<div className="container mx-auto ">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold mb-4">One Bot for All Needs</h2>
							<p className="">
								Kythia comes equipped with various modules you can configure.
							</p>
						</div>

						<Grid container spacing={4}>
							{features.map((f, i) => (
								<Grid item xs={12} md={4} key={i}>
									<Card className="h-full group border bg-white/[0.02] glass">
										<CardContent className="p-6 text-center">
											<div
												className={`bg-primaryLight w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center text-2xl bg-${f.color}/10 text-${f.color}`}
											>
												<Icon name={f.icon} className="text-4xl" />
											</div>
											<h3 className="text-lg font-bold mb-2">{f.title}</h3>
											<p className="text-sm ">{f.desc}</p>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</div>
				</section>

				{/* ================= WHY CHOOSE US ================= */}
				{/* <section className="py-20 container mx-auto ">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Kythia?</h2>
          </div>
          <Grid container spacing={4}>
            {[
              { title: 'Fast & Stable', desc: 'Built with modern infrastructure for maximum performance.', icon: 'gauge' },
              { title: 'Easy to Customize', desc: 'Adjust settings to your server needs without hassle.', icon: 'puzzle' },
              { title: 'Trusted', desc: 'Used in hundreds of servers with thousands of active users.', icon: 'users' },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <div className="text-center p-6 border h-full border-white/5 rounded-2xl bg-white/[0.02]">
                  <Icon name={item.icon} className="text-4xl text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="">{item.desc}</p>
                </div>
              </Grid>
            ))}
          </Grid>
        </section> */}

				{/* ================= CTA ================= */}
				<section className="py-20">
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
			</div>
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
];
