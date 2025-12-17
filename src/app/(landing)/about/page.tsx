import Link from 'next/link';
import Image from 'next/image';

// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

// Third-party
import classnames from 'classnames';

// Styles
import frontCommonStyles from '@views/front-pages/styles.module.css';
import PageHeader from '@/components/layout/front-pages/PageHeader';

export const metadata = {
	title: 'About Owner - Kythia',
	description: 'Meet kenndeclouv, the creator of Kythia Discord Bot.',
};

export default function AboutPage() {
	return (
		<section id="about-owner" className="plb-[100px]">
			<div
				className={classnames('flex flex-col', frontCommonStyles.layoutSpacing)}
			>
				{/* --- HEADER SECTION --- */}
				<PageHeader
					logo
					title={
						<span>
							<span className="hero-title">Kythia&#39;s</span> Owner
						</span>
					}
					subtitle={
						<span>
							Get to know the creator and maintainer of <b>Kythia</b> Discord
							bot!
						</span>
					}
				/>

				{/* --- MAIN CARD --- */}
				<div className="flex justify-center">
					<Card className="glass bg-white/[0.02] border border-white/10 w-full max-w-4xl">
						<CardContent className="p-8 md:p-12">
							{/* Profile Header */}
							<div className="flex flex-col md:flex-row items-center gap-8 mb-8">
								{/* Avatar (Placeholder dari Github) */}
								<div className="relative group">
									<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
									<Image
										src="https://github.com/kenndeclouv.png"
										alt="kenndeclouv"
										width={120}
										height={120}
										className="relative rounded-full"
									/>
								</div>

								<div className="text-center md:text-left">
									<Typography variant="h3" className="font-bold mb-2">
										Meet <span className="text-primary">kenndeclouv</span>
									</Typography>
									<Chip
										label="Owner & Developer of Kythia"
										color="primary"
										className="font-bold bg-primary/10"
									/>
								</div>
							</div>

							<Divider className="my-6 border-white/10" />

							{/* Bio Content */}
							<div className="space-y-4 text-lg text-textSecondary">
								<Typography>
									Heyy! I&#39;m <b className="text-primary">kenndeclouv</b>, the
									creator and developer of the <b>Kythia</b> Discord bot. I am
									passionate about building fun, helpful, and safe tools for the
									Discord community.
								</Typography>
								<Typography>
									I started Kythia as a personal project to learn more about
									Discord Bot, AI, automation, and community management. Over
									time, it has grown into a feature-rich bot used by many
									servers, and I am always working to improve it!
								</Typography>
								<Typography>
									Beside that, I also like to listen to music, play video games,
									and learn new things.
								</Typography>
							</div>

							{/* Info Grid */}
							<Grid container spacing={4} className="mt-8">
								{/* Left Column: About Me */}
								<Grid item xs={12} md={6}>
									<Typography
										variant="h5"
										className="font-bold mb-4 flex items-center gap-2"
									>
										<i className="tabler-user" /> About Me
									</Typography>
									<ul className="space-y-3 pl-2">
										<li className="flex gap-2">
											<strong className="min-w-[80px]">Name:</strong>{' '}
											kenndeclouv
										</li>
										<li className="flex gap-2">
											<strong className="min-w-[80px]">Location:</strong>{' '}
											Indonesia
										</li>
										<li className="flex gap-2">
											<strong className="min-w-[80px]">Interests:</strong>{' '}
											Coding, AI, Music, Gaming
										</li>
										<li className="flex gap-2 items-center">
											<strong className="min-w-[80px]">Discord:</strong>
											<Link
												href="https://discord.com/users/1158654757183959091"
												target="_blank"
											>
												<span className="text-primary">@kenndeclouv</span>
											</Link>
										</li>
									</ul>
								</Grid>

								{/* Right Column: Links & Philo */}
								<Grid item xs={12} md={6}>
									<Typography
										variant="h5"
										className="font-bold mb-4 flex items-center gap-2"
									>
										<i className="tabler-link" /> Links & Contact
									</Typography>
									<div className="flex flex-wrap gap-3 mb-6">
										<Button
											variant="outlined"
											color="secondary"
											startIcon={<i className="tabler-brand-github" />}
											href="https://github.com/kenndeclouv"
											target="_blank"
										>
											GitHub
										</Button>
										<Button
											variant="outlined"
											color="info"
											startIcon={<i className="tabler-world" />}
											href="https://kenndeclouv.me"
											target="_blank"
										>
											Portfolio
										</Button>
										<Button
											variant="outlined"
											color="warning"
											startIcon={<i className="tabler-mail" />}
											href="mailto:kenndeclouv@gmail.com"
										>
											Email
										</Button>
									</div>

									<div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
										<Typography
											variant="subtitle1"
											className="font-bold text-primary mb-1 flex items-center gap-2"
										>
											<i className="tabler-cookie" /> My Philosophy
										</Typography>
										<Typography variant="body2" className="italic opacity-80">
											&quot;Cookie is my fuel, without it I can&#39;t make
											awesome code.&quot;
										</Typography>
									</div>
								</Grid>
							</Grid>

							{/* Footer CTA */}
							<div className="text-center mt-12 pt-8 border-t border-white/10">
								<Typography className="mb-4 text-textSecondary">
									Have questions or suggestions? Just want to say hi?
								</Typography>
								<Button
									variant="contained"
									size="large"
									href="https://dsc.gg/kythia"
									target="_blank"
									startIcon={<i className="tabler-brand-discord-filled" />}
									className="shadow-lg shadow-primary/25 rounded-xl px-8 py-3"
								>
									Join Support Server
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
