import { fetchAPI } from '@/libs/api';
import StreakForm from '@/components/dashboard/settings/StreakForm';

type PageProps = { params: Promise<{ id: string }> };

export default async function StreakPage({ params }: PageProps) {
	const { id } = await params;
	const data = await fetchAPI(`/guilds/${id}`);

	if (!data || !data.guild) return <div>Server not found</div>;

	return (
		<StreakForm
			guildId={id}
			initialSettings={data.settings}
			roles={data.roles}
		/>
	);
}
