import { fetchAPI } from '@/libs/api';
import BrandingForm from '@/components/dashboard/settings/BrandingForm';

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function WelcomePage({ params }: PageProps) {
	const { id } = await params;

	// Fetch Data Server
	const data = await fetchAPI(`/guilds/${id}`);

	if (!data || !data.guild) return <div>Server not found</div>;

	return (
		<BrandingForm
			guildId={id}
			initialSettings={data.settings}
			botUser={data.botUser}
		/>
	);
}
