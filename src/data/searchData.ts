import verticalMenuData from './navigation/verticalMenuData';
import type { VerticalMenuDataType } from '@/types/menuTypes';

type SearchData = {
	id: string;
	name: string;
	url: string;
	excludeLang?: boolean;
	icon: string;
	section: string;
	shortcut?: string;
};

const getSearchData = (
	guilds: any[],
	guildId: string | null,
	userId: string | null,
): SearchData[] => {
	const menuData = verticalMenuData(guilds, guildId, userId);
	const searchData: SearchData[] = [];
	let idCounter = 1;

	const processMenu = (menuItems: VerticalMenuDataType[], section: string) => {
		menuItems.forEach((item) => {
			if ('isSection' in item && item.isSection) {
				if (item.children) {
					processMenu(item.children, item.label as string);
				}
			} else if ('children' in item && item.children) {
				processMenu(item.children, section);
			} else if ('href' in item && item.href) {
				searchData.push({
					id: (idCounter++).toString(),
					name: item.label as string,
					url: item.href,
					icon: item.icon as string,
					section: section || 'General',
				});
			}
		});
	};

	processMenu(menuData, 'General');

	return searchData;
};

export default getSearchData;
