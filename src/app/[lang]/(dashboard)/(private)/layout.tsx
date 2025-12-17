// MUI Imports
import Button from '@mui/material/Button';

// Type Imports
import { getServerSession } from 'next-auth';

import type { ChildrenType } from '@core/types';
import type { Locale } from '@configs/i18n';

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper';
import VerticalLayout from '@layouts/VerticalLayout';

// Component Imports
import Providers from '@components/Providers';
import Navigation from '@components/layout/vertical/Navigation';
import Navbar from '@components/layout/vertical/Navbar';
import VerticalFooter from '@components/layout/vertical/Footer';
import Customizer from '@core/components/customizer';
import ScrollToTop from '@core/components/scroll-to-top';
import AuthGuard from '@/hocs/AuthGuard';

// Config Imports
import { i18n } from '@configs/i18n';

// Data Fetching Imports
import { authOptions } from '@/libs/auth';
import { fetchAPI } from '@/libs/api';

// Util Imports
import { getDictionary } from '@/utils/getDictionary';
import { getMode, getSystemMode } from '@core/utils/serverHelpers';

const Layout = async (props: ChildrenType & { params: Promise<any> }) => {
	const params = await props.params;

	const { children } = props;

	// Vars
	const direction = i18n.langDirection[params.lang as Locale];
	const dictionary = await getDictionary(params.lang as Locale);
	const mode = await getMode();
	const systemMode = await getSystemMode();

	// 2. Fetch Data Paralel (Biar Kenceng ⚡)
	// Kita butuh: List Server User (Discord) & List Server Bot (Hono)
	const session = await getServerSession(authOptions);

	let guilds: any[] = [];

	if (session) {
		try {
			const [userGuildsRes, botGuilds] = await Promise.all([
				fetch('https://discord.com/api/users/@me/guilds', {
					headers: { Authorization: `Bearer ${session.accessToken}` },
					next: { revalidate: 60 }, // Cache 60 detik
				}),
				fetchAPI('/guilds') as Promise<{ id: string; name: string }[]>, // Request ke API Hono
			]);

			if (userGuildsRes.ok) {
				const userGuilds = await userGuildsRes.json();
				const botGuildIds = new Set((botGuilds || []).map((g) => g.id));

				// Filter Server (Hanya yang user punya izin MANAGE_GUILD)
				// Permission Bitfield MANAGE_GUILD = 0x20
				guilds = userGuilds
					.filter((guild: any) => {
						const perms = BigInt(guild.permissions);

						return (perms & BigInt(0x20)) === BigInt(0x20);
					})
					.map((guild: any) => ({
						...guild,
						hasBot: botGuildIds.has(guild.id),
					}));
			}
		} catch (error) {
			console.error('Error fetching guilds in layout:', error);
		}
	}

	return (
		<Providers direction={direction}>
			<AuthGuard locale={params.lang as Locale}>
				<LayoutWrapper
					systemMode={systemMode}
					verticalLayout={
						<VerticalLayout
							navigation={
								<Navigation
									dictionary={dictionary}
									mode={mode}
									guilds={guilds}
									userId={session?.user?.id}
								/>
							}
							navbar={<Navbar guilds={guilds} userId={session?.user?.id} />}
							footer={<VerticalFooter />}
						>
							{children}
						</VerticalLayout>
					}
				/>
				<ScrollToTop className="mui-fixed">
					<Button
						variant="contained"
						className="is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center"
					>
						<i className="tabler-arrow-up" />
					</Button>
				</ScrollToTop>
				<Customizer dir={direction} />
			</AuthGuard>
		</Providers>
	);
};

export default Layout;
