import { fetchAPI } from '@/libs/api';
import AiForm from '@/components/dashboard/settings/AiForm';

type PageProps = { params: Promise<{ id: string }> };

export default async function AiPage({ params }: PageProps) {
	const { id } = await params;
	const data = await fetchAPI(`/guilds/${id}`);

	return (
		<AiForm
			guildId={id}
			initialSettings={data.settings}
			channels={data.channels.text}
		/>
	);
}
