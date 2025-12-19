export interface IKythiaConfig {
	general: {
		appName: string;
		appDescription: string;
		appUrl: string;
		author: string;
		keywords: string[];
		primaryColor?: string;
	};
	assets: {
		logo: string;
		logoTransparent: string;
		homePageHeroImage: string;
		homePageFeatureAi: string;
		homePageFeatureMusic: string;
		homePageFeatureDashboard: string;
		homePageFeatureGlobalChat: string;
		banner: string;
		ogImage: string;
		defaultAvatar: string;
		favicon: string;
	};
	links: {
		discordInvite: string;
		discordSupport: string;
		github: string;
		docs: string;
		status: string;
	};
	gallery: string[];
}

export const kythiaConfig: IKythiaConfig = {
	// --- GENERAL ---
	general: {
		appName: 'Kythia',
		appDescription: 'The Ultimate Multipurpose Discord Bot.',
		appUrl: 'https://kythia.me',
		author: 'kenndeclouv',
		keywords: ['Discord Bot', 'Dashboard', 'AI'],
		primaryColor: '#F6B1CE',
	},

	// --- ASSETS ---
	assets: {
		logo: `https://placehold.co/128x128.png?text=kythia+logo`,
		logoTransparent: `https://placehold.co/128x128.png?text=kythia+logo`,
		homePageHeroImage: `https://placehold.co/500x500.png?text=kythia+heroimage`,
		homePageFeatureAi: `https://placehold.co/500x500.png?text=kythia+featureai`,
		homePageFeatureMusic: `https://placehold.co/500x500.png?text=kythia+featuremusic`,
		homePageFeatureDashboard: `https://placehold.co/500x500.png?text=kythia+featuredashboard`,
		homePageFeatureGlobalChat: `https://placehold.co/500x500.png?text=kythia+featureglobalchat`,
		banner: `https://placehold.co/800x400.png?text=kythia+banner`,
		ogImage: `https://placehold.co/1200x630.png?text=kythia+ogimage`,
		defaultAvatar: `https://placehold.co/128x128.png?text=kythia`,
		favicon: `https://placehold.co/128x128.png?text=kythia`,
	},

	// --- LINKS ---
	links: {
		discordInvite: 'https://dsc.gg/kythiainvite',
		discordSupport: 'https://dsc.gg/kythia',
		github: 'https://github.com/kythia',
		docs: 'https://docs.kythia.me',
		status: 'https://status.kythia.me',
	},

	// --- GALLERY ---
	gallery: [
		'https://placehold.co/500x500.png?text=kythia+image+1',
		'https://placehold.co/500x500.png?text=kythia+image+2',
		'https://placehold.co/500x500.png?text=kythia+image+3',
		'https://placehold.co/500x500.png?text=kythia+image+4',
		'https://placehold.co/500x500.png?text=kythia+image+5',
		'https://placehold.co/500x500.png?text=kythia+image+6',
	],
};
