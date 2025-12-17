import { redirect } from 'next/navigation';
import Link from 'next/link';

import { getServerSession } from 'next-auth';

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { Alert } from '@mui/material';

import { authOptions } from '@/libs/auth';
import { fetchAPI } from '@/libs/api';

interface DiscordGuild {
	id: string;
	name: string;
	icon: string | null;
	permissions: string;
}

interface BotGuild {
	id: string;
	name: string;
}

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/api/auth/signin');
	}

	const [userGuildsRes, botGuilds] = await Promise.all([
		fetch('https://discord.com/api/users/@me/guilds', {
			headers: { Authorization: `Bearer ${session.accessToken}` },
			next: { revalidate: 60 },
		}),
		fetchAPI('/guilds') as Promise<BotGuild[]>,
	]);

	if (!userGuildsRes.ok) {
		return (
			<Typography>
				Error fetching Discord servers. Try logging out and back in.
			</Typography>
		);
	}

	const userGuilds: DiscordGuild[] = await userGuildsRes.json();

	const botGuildIds = new Set((botGuilds || []).map((g) => g.id));

	const adminGuilds = userGuilds.filter((guild) => {
		const perms = BigInt(guild.permissions);

		return (perms & BigInt(0x20)) === BigInt(0x20);
	});

	return (
		<Grid container spacing={6}>
			<Grid size={{ xs: 12 }}>
				<Alert severity="info" icon={<i className="tabler-code" />}>
					This Dashboard is beta version, please report any bugs to{' '}
					<a
						href="https://dsc.gg/kythia"
						target="_blank"
						rel="noopener noreferrer"
					>
						Discord Server
					</a>
					.
				</Alert>
			</Grid>
			{/* --- HERO SECTION --- */}
			<Grid size={{ xs: 12 }}>
				<Card className="bg-gradient-to-r from-primary to-indigo-900 opacity-80 mb-10 rounded-t-lg text-white overflow-hidden relative">
					<CardContent className="p-12 flex flex-col items-start gap-4 z-10 relative">
						<div className="flex items-center gap-4">
							<Avatar
								src={session.user.image || ''}
								alt={session.user.name || ''}
								sx={{ width: 64, height: 64, border: '2px solid white' }}
							/>
							<div>
								<Typography variant="h4" className="text-white font-bold">
									Welcome back, {session.user.name}!
								</Typography>
								<Typography variant="body1" className="text-white/80">
									You have {adminGuilds.length} servers to manage today.
								</Typography>
							</div>
						</div>
					</CardContent>

					{/* Hiasan Background Abstrak (Opsional) */}
					<div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-12 blur-3xl" />
				</Card>
			</Grid>

			{/* --- SERVER LIST GRID --- */}
			<Grid size={12}>
				<Typography
					variant="h5"
					className="mb-4 font-semibold flex items-center gap-2"
				>
					<i className="tabler-server" /> Your Servers
				</Typography>
			</Grid>

			{adminGuilds.length === 0 ? (
				<Grid size={12}>
					<div className="text-center p-10 border border-dashed rounded-xl">
						<Typography>
							No servers found where you have Manage Server permissions.
						</Typography>
					</div>
				</Grid>
			) : (
				adminGuilds.map((guild) => {
					const isBotIn = botGuildIds.has(guild.id);

					const iconUrl = guild.icon
						? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
						: 'https://cdn.discordapp.com/embed/avatars/0.png';

					return (
						<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={guild.id}>
							<Card
								className={`group relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-primary ${isBotIn ? 'glass' : 'opacity-80 grayscale hover:grayscale-0'}`}
							>
								<CardContent className="flex flex-col items-center p-6 gap-4 text-center">
									{/* Icon Server */}
									<div className="relative">
										<Avatar
											src={iconUrl}
											alt={guild.name}
											sx={{ width: 80, height: 80 }}
											className="shadow-lg ring-2 ring-transparent group-hover:ring-primary transition-all"
										>
											{guild.name.substring(0, 2).toUpperCase()}
										</Avatar>
									</div>

									{/* Nama Server */}
									<div className="min-h-[3rem] flex items-center justify-center">
										<Typography
											variant="h6"
											className="line-clamp-2 font-bold leading-tight"
										>
											{guild.name}
										</Typography>
									</div>

									{/* Action Button */}
									{isBotIn ? (
										<Link href={`/en/dash/${guild.id}`} className="w-full">
											{' '}
											{/* Link ke Detail Server */}
											<Button
												variant="contained"
												color="primary"
												fullWidth
												startIcon={<i className="tabler-settings" />}
											>
												Configure
											</Button>
										</Link>
									) : (
										<Button
											variant="outlined"
											color="secondary"
											fullWidth
											startIcon={<i className="tabler-plus" />}
											href={`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`}
											target="_blank"
										>
											Invite Bot
										</Button>
									)}
								</CardContent>
							</Card>
						</Grid>
					);
				})
			)}
		</Grid>
	);
}
