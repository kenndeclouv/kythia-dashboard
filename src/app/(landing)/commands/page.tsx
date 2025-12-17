import classnames from 'classnames';

import { fetchAPI } from '@/libs/api';

import CommandsView from '@/views/front-pages/landing-page/CommandsView';

import frontCommonStyles from '@views/front-pages/styles.module.css';

export default async function CommandsPage() {
	// Fetch Data dari Bot
	const data = (await fetchAPI('/meta/commands', { revalidate: 3600 })) || {
		commands: [],
		categories: [],
		totalCommands: 0,
	};

	return (
		<section id="contact-us" className="plb-[100px]">
			<div
				className={classnames(
					' flex flex-col gap-14',
					frontCommonStyles.layoutSpacing,
				)}
			>
				<div className="flex flex-col gap-y-4 items-center justify-center">
					<CommandsView
						commands={data.commands}
						categories={data.categories}
						totalCommands={data.totalCommands}
					/>
				</div>
			</div>
		</section>
	);
}
