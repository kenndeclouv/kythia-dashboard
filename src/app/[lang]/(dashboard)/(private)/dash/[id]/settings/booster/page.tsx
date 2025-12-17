import { fetchAPI } from '@/libs/api';
import BoosterForm from '@/components/dashboard/settings/BoosterForm';

type PageProps = { params: Promise<{ id: string }> };

export default async function BoosterPage({ params }: PageProps) {
	const { id } = await params;
	const data = await fetchAPI(`/guilds/${id}`);

	return (
		<BoosterForm
			guildId={id}
			initialSettings={data.settings}
			channels={data.channels.text}
		/>
	);
}
