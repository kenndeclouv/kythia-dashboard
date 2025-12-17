import Image from 'next/image';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// Component Imports
import PageHeader from '@/components/layout/front-pages/PageHeader';

const partners = [
	{
		name: 'Millo DJ',
		logo: '/assets/img/partner/millodjlogo.gif',
		desc: 'Bring your friends, blast your favorite tracks, and let MILLO DJ keep your server alive 24/7! 💥 No premium needed – totally free! 💿✨',
		link: 'https://discord.gg/VtBhpf9qkA',
		tags: ['Music', '24/7', 'Free'],
		color: 'primary',
	},

	// Tambah partner lain disini...
];

export const metadata = {
	title: 'Partners - Kythia',
	description: 'Grow together with Kythia! Check out our amazing partners.',
};

export default function PartnersPage() {
	return (
		<div className="container mx-auto px-6 pt-32 pb-20">
			{/* --- HEADER --- */}
			<PageHeader
				logo
				title={
					<span>
						<span className="hero-title">Kythia</span> Partners
					</span>
				}
				subtitle="Grow together with Kythia! We are open for partnerships with communities and projects that share our vision."
			/>

			{/* --- BENEFITS GRID --- */}
			<div className="mb-24">
				<Typography variant="h4" className="text-center font-bold mb-12">
					Why Partner With Us?
				</Typography>
				<Grid container spacing={4}>
					{[
						{
							title: 'Expand Your Reach',
							desc: 'Get your project in front of thousands of active Discord users.',
							icon: 'tabler-users',
						},
						{
							title: 'Mutual Promotion',
							desc: 'We believe in win-win! We promote you, you promote us.',
							icon: 'tabler-heart-handshake',
						},
						{
							title: 'Exclusive Perks',
							desc: 'Access to special features, early updates, and direct support.',
							icon: 'tabler-star',
						},
					].map((item, i) => (
						<Grid item xs={12} md={4} key={i}>
							<Card className="h-full glass border border-white/10 hover:-translate-y-2 transition-transform duration-300">
								<CardContent className="p-8 text-center">
									<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center text-3xl text-primary">
										<i className={item.icon} />
									</div>
									<Typography variant="h5" className="font-bold mb-3">
										{item.title}
									</Typography>
									<Typography className="text-textSecondary">
										{item.desc}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</div>

			{/* --- PARTNERS LIST (The Main Show) --- */}
			<div className="mb-24">
				<Typography
					variant="h3"
					className="text-center font-bold mb-12 flex items-center justify-center gap-3"
				>
					<i className="tabler-certificate text-warning" /> Our Partners
				</Typography>

				<Grid container spacing={4} justifyContent="center">
					{partners.map((partner, index) => (
						<Grid item xs={12} md={6} lg={4} key={index}>
							<Card className="h-full glass border border-white/10 overflow-hidden group">
								<CardContent className="p-8 flex flex-col items-center text-center h-full relative z-10">
									{/* Logo Wrapper with Glow */}
									<div className="relative mb-6">
										<div
											className={`absolute inset-0 bg-${partner.color}/40 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
										/>
										<Image
											src={partner.logo}
											alt={partner.name}
											width={100}
											height={100}
											className="relative rounded-full border-4 border-backgroundPaper shadow-lg object-cover"
											unoptimized // Penting buat GIF
										/>
									</div>

									<Typography variant="h4" className="font-bold mb-2">
										{partner.name}
									</Typography>

									{/* Tags */}
									<div className="flex gap-2 mb-4 justify-center flex-wrap">
										{partner.tags.map((tag) => (
											<Chip
												key={tag}
												label={tag}
												size="small"
												className={`bg-${partner.color}/10 text-${partner.color} border border-${partner.color}/20`}
											/>
										))}
									</div>

									<Typography className="text-textSecondary mb-6 line-clamp-3">
										{partner.desc}
									</Typography>

									<div className="mt-auto w-full">
										<Button
											variant="outlined"
											fullWidth
											href={partner.link}
											target="_blank"
											color={partner.color as any}
											startIcon={<i className="tabler-brand-discord" />}
											className="rounded-xl border-white/20 hover:border-white/50 text-white hover:bg-white/5"
										>
											Join Server
										</Button>
									</div>
								</CardContent>

								{/* Background Decoration */}
								<div
									className={`absolute top-0 left-0 w-full h-2 bg-${partner.color}`}
								/>
							</Card>
						</Grid>
					))}
				</Grid>
			</div>

			{/* --- FAQ --- */}
			<div className="max-w-3xl mx-auto mb-24">
				<Typography variant="h4" className="text-center font-bold mb-8">
					Partnership FAQ
				</Typography>
				<div className="flex flex-col gap-4">
					{[
						{
							q: 'Who can partner with Kythia?',
							a: 'We welcome Discord servers, communities, brands, and projects that are safe for work and share our values.',
						},
						{
							q: 'What are the requirements?',
							a: 'Generally we look for active communities with a positive environment and willingness to promote Kythia.',
						},
						{
							q: 'What do partners get?',
							a: 'Partners receive promotion, special roles, early access to features, and direct support.',
						},
					].map((faq, i) => (
						<Accordion
							key={i}
							className="glass !bg-white/[0.02] border border-white/10 shadow-none"
						>
							<AccordionSummary
								expandIcon={<i className="tabler-chevron-down" />}
							>
								<Typography className="font-semibold">{faq.q}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography className="text-textSecondary">{faq.a}</Typography>
							</AccordionDetails>
						</Accordion>
					))}
				</div>
			</div>

			{/* --- CTA --- */}
			<div className="text-center">
				<div className="glass rounded-3xl p-12 relative overflow-hidden max-w-4xl mx-auto">
					<div className="relative z-10">
						<Typography variant="h3" className="font-bold mb-4">
							Ready to Partner?
						</Typography>
						<Typography variant="h6" className="text-textSecondary mb-8">
							Let&#39;s grow together! Reach out to us and become part of the
							Kythia family.
						</Typography>
						<Button
							variant="contained"
							size="large"
							href="https://dsc.gg/kythia"
							target="_blank"
							className="rounded-xl px-10 py-3 text-lg font-bold shadow-lg shadow-primary/25"
						>
							Contact Us Now
						</Button>
					</div>
					{/* BG Effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
				</div>
			</div>
		</div>
	);
}
