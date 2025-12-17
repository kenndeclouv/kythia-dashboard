import { fetchAPI } from '@/libs/api';
import LevelingForm from '@/components/dashboard/settings/LevelingForm';

type PageProps = { params: Promise<{ id: string }> };

export default async function LevelingPage({ params }: PageProps) {
	const { id } = await params;
	const data = await fetchAPI(`/guilds/${id}`);

	return (
		<LevelingForm
			guildId={id}
			initialSettings={data.settings}
			channels={data.channels.text}
			voiceChannels={data.channels.voice}
			roles={data.roles}
		/>
	);
}
