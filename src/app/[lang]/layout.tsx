// Next Imports
import { headers } from 'next/headers';

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css';

// Type Imports
import type { ChildrenType } from '@core/types';
import type { Locale } from '@configs/i18n';

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper';

// Config Imports
import { i18n } from '@configs/i18n';

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers';

// Style Imports
import '@/app/globals.css';

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css';
import { kythiaConfig } from '@config';

export const metadata = {
	title: `${kythiaConfig.general.appName} | ${kythiaConfig.general.appDescription}`,
	description: kythiaConfig.general.appDescription,
	keywords: kythiaConfig.general.keywords,
	openGraph: {
		title: kythiaConfig.general.appName,
		description: kythiaConfig.general.appDescription,
		type: 'website',
		locale: 'en_US',
		siteName: kythiaConfig.general.appName,
		url: kythiaConfig.general.appUrl,
		images: [
			{
				url: kythiaConfig.assets.ogImage,
				width: 1200,
				height: 630,
				alt: kythiaConfig.general.appName,
			},
		],
	},
	icons: {
		icon: kythiaConfig.assets.favicon,
		shortcut: kythiaConfig.assets.favicon,
		apple: kythiaConfig.assets.logo,
	},
};
const RootLayout = async (props: ChildrenType & { params: Promise<any> }) => {
	const params = await props.params;

	const { children } = props;

	// Vars
	const headersList = await headers();
	const systemMode = await getSystemMode();
	const direction = i18n.langDirection[params.lang as Locale];

	return (
		<TranslationWrapper headersList={headersList} lang={params.lang}>
			<html
				id="__next"
				lang={params.lang}
				dir={direction}
				suppressHydrationWarning
			>
				<body
					className="flex is-full min-bs-full flex-auto flex-col"
					suppressHydrationWarning
				>
					<InitColorSchemeScript attribute="data" defaultMode={systemMode} />
					{children}
				</body>
			</html>
		</TranslationWrapper>
	);
};

export default RootLayout;
