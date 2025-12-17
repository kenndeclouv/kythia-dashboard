import type { VerticalMenuDataType } from '@/types/menuTypes';

const verticalMenuData = (
	guilds: any[],
	guildId: string | null,
	userId: string | null,
): VerticalMenuDataType[] => {
	const isOwner = userId === process.env.NEXT_PUBLIC_OWNER_ID;

	const menu: VerticalMenuDataType[] = [
		{
			label: 'Home',
			href: `/dash`,
			icon: 'tabler-home',
		},
	];

	// 🔒 HANYA MUNCUL KALAU OWNER
	if (isOwner) {
		menu.push({
			label: 'License Manager',
			href: `/dash/admin/license`,
			icon: 'tabler-key',
		});
	}

	if (guildId) {
		menu.push({
			isSection: true,
			label: 'Menus',
			children: [],
		});

		menu.push({
			label: 'Dashboard',
			icon: 'tabler-chart-line',
			href: `/dash/${guildId}`,
		});

		menu.push({
			label: 'Settings',
			icon: 'tabler-settings',
			children: [
				{
					label: 'Overview',
					href: `/dash/${guildId}/settings`,
				},
				{
					label: 'Automod',
					href: `/dash/${guildId}/settings/automod`,
				},
				{
					label: 'Server Stats',
					href: `/dash/${guildId}/settings/stats`,
				},
				{
					label: 'Welcome System',
					href: `/dash/${guildId}/settings/welcome`,
				},
				{
					label: 'Leveling System',
					href: `/dash/${guildId}/settings/leveling`,
				},
				{
					label: 'AI Features',
					href: `/dash/${guildId}/settings/ai`,
				},
				{
					label: 'Streak System',
					href: `/dash/${guildId}/settings/streak`,
				},
				{
					label: 'Booster',
					href: `/dash/${guildId}/settings/booster`,
				},
			],
		});

		// menu.push({
		//   isSection: true,
		//   label: 'Premium',
		//   children: [
		//     {
		//       label: 'Branding',
		//       icon: 'tabler-paint',
		//       href: `/dash/${guildId}/settings/branding`
		//     }
		//   ]
		// })
	}

	menu.push({
		label: 'Links',
		isSection: true,
		children: [
			{
				label: 'Invite',
				href: 'https://dsc.gg/kythiainvite',
				target: '_blank',
				icon: 'tabler-plus',
			},
			{
				label: 'Support',
				href: 'https://dsc.gg/kythia',
				target: '_blank',
				icon: 'tabler-brand-discord',
			},
			{
				label: 'Github',
				href: 'https://github.com/kythia',
				target: '_blank',
				icon: 'tabler-brand-github',
			},
		],
	});

	return menu;
};

export default verticalMenuData;
