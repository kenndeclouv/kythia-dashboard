import { fetchAPI } from '@/libs/api';
import ServerStatsForm from '@/components/dashboard/settings/ServerStatsForm';

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function StatsPage({ params }: PageProps) {
	const { id } = await params;
	const data = await fetchAPI(`/guilds/${id}`);

	if (!data || !data.guild) return <div>Server not found</div>;

	return (
		<ServerStatsForm
			guildId={id}
			initialSettings={data.settings}
			channels={{
				// Kita butuh Categories (buat folder) dan Voice (buat stats)
				categories: data.channels.categories || [],
				voice: data.channels.voice || [],
			}}
		/>
	);
}
