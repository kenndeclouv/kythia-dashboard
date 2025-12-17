// src/configs/kythia.config.ts

// Bisa ambil base URL dari env kalau mau fleksibel (misal ganti CDN)
const ASSETS_BASE = process.env.NEXT_PUBLIC_ASSETS_URL || '';

const kythiaConfig = {
	// --- GENERAL ---
	general: {
		appName: 'Kythia',
		appDescription: 'The Ultimate Multipurpose Discord Bot for your community.',
		appUrl: 'https://kythia.me',
		author: 'Kythia Team',
		keywords: ['Discord Bot', 'Leveling', 'Dashboard', 'AI', 'Automod'],
	},

	// --- ASSETS (Images & Icons) ---
	assets: {
		logo: `${ASSETS_BASE}/images/logos/kythia-logo.png`, // Pastikan file ada
		logoTransparent: `${ASSETS_BASE}/images/logos/kythia-transparent.png`,
		banner: `${ASSETS_BASE}/images/front-pages/landing-page/hero-bg.png`,
		ogImage: `${ASSETS_BASE}/images/misc/og-banner.png`,
		defaultAvatar: `${ASSETS_BASE}/images/avatars/1.png`,
		favicon: `${ASSETS_BASE}/favicon.ico`,
	},

	// --- LINKS (External) ---
	links: {
		discordInvite: 'https://dsc.gg/kythiainvite',
		discordSupport: 'https://dsc.gg/kythia',
		github: 'https://github.com/kythia',
		docs: 'https://docs.kythia.me',
		status: 'https://status.kythia.me',
	},

	// --- GALLERY (Buat fitur drag-drop tadi) ---
	gallery: [
		`${ASSETS_BASE}/assets/img/gallery/1.png`,
		`${ASSETS_BASE}/assets/img/gallery/2.png`,
		`${ASSETS_BASE}/assets/img/gallery/3.png`,
		`${ASSETS_BASE}/assets/img/gallery/4.png`,
		`${ASSETS_BASE}/assets/img/gallery/5.png`,
		`${ASSETS_BASE}/assets/img/gallery/6.png`,
		`${ASSETS_BASE}/assets/img/gallery/7.png`,
		`${ASSETS_BASE}/assets/img/gallery/8.png`,
		`${ASSETS_BASE}/assets/img/gallery/9.png`,
		`${ASSETS_BASE}/assets/img/gallery/10.png`,
		`${ASSETS_BASE}/assets/img/gallery/11.png`,
	],
};

export default kythiaConfig;
