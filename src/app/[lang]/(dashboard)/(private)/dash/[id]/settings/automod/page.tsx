import { fetchAPI } from '@/libs/api';
import AutomodForm from '@/components/dashboard/settings/AutomodForm';

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function AutomodPage({ params }: PageProps) {
	const { id } = await params;

	// Fetch Data Server (Settings & Channel List)
	const data = await fetchAPI(`/guilds/${id}`);

	if (!data || !data.guild) return <div>Server not found</div>;

	return (
		<AutomodForm
			guildId={id}
			initialSettings={data.settings}
			channels={data.channels.text} // Kita cuma butuh text channels buat dropdown
		/>
	);
}
