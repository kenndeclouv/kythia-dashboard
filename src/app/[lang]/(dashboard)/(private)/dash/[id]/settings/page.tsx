// Next Imports
import { notFound } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert';

// Libs
import { fetchAPI } from '@/libs/api';

// import ServerSettingsForm from '@/components/dashboard/ServerSettingsForm'
import ServerConfigTabs from '@/components/dashboard/settings/ServerConfigTabs';

type GuildDetail = {
	guild: {
		id: string;
		name: string;
		icon: string | null;
	};
	settings: any; // Nanti kita perjelas typenya
	channels: {
		text: { id: string; name: string }[];
		voice: { id: string; name: string }[];
	};
	roles: { id: string; name: string; color: string }[];
};

const ServerDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	// 1. Fetch Data Detail dari Bot
	// Endpoint ini harus match sama route Hono: app.get('/:id', ...)
	const data: GuildDetail = await fetchAPI(`/guilds/${id}`);

	// Kalau bot gak ada di server itu (API return 404 null), lempar ke 404 page
	if (!data || !data.guild) {
		return notFound();
	}

	const { guild, settings } = data;

	return (
		<Grid container spacing={6}>
			<Grid item xs={12}>
				<Alert severity="info" icon={<i className="tabler-code" />}>
					This is the settings page for the server {guild.name} ({guild.id}).
				</Alert>
			</Grid>

			<Grid item xs={12}>
				<Card>
					<CardContent>
						<Typography variant="h5" className="mb-4">
							Kythia&apos;s Settings
						</Typography>
						<Grid item xs={12}>
							<ServerConfigTabs guildId={id} settings={settings} />
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default ServerDetailPage;
