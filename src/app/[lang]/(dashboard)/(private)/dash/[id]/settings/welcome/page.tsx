import { fetchAPI } from '@/libs/api';
import WelcomeForm from '@/components/dashboard/settings/WelcomeForm';

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function WelcomePage({ params }: PageProps) {
	const { id } = await params;

	// Fetch Data Server
	const data = await fetchAPI(`/guilds/${id}`);

	if (!data || !data.guild) return <div>Server not found</div>;

	return (
		<WelcomeForm
			guildId={id}
			initialSettings={data.settings}
			channels={data.channels.text}
			roles={data.roles} // Kita butuh list role juga buat Auto-Role
		/>
	);
}
