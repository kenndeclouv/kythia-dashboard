// Next Imports
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Third-party Imports
import classnames from 'classnames';

// Type Imports
import type { Locale } from '@configs/i18n';

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n';

// Type Imports
import type { Section } from './index';

const DefaultSuggestions = ({
	setOpen,
	suggestions,
}: {
	setOpen: (value: boolean) => void;
	suggestions: Section[];
}) => {
	// Hooks
	const { lang: locale } = useParams();

	return (
		<div className="flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full">
			{suggestions.map((section, index) => (
				<div
					key={index}
					className="flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]"
				>
					<p className="text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]">
						{section.title}
					</p>
					<ul className="flex flex-col gap-4">
						{section.items.map((item, i) => (
							<li key={i} className="flex">
								<Link
									href={getLocalizedUrl(item.url, locale as Locale)}
									className="flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0"
									onClick={() => setOpen(false)}
								>
									{item.icon && (
										<i className={classnames(item.icon, 'flex text-xl')} />
									)}
									<p className="text-[15px] leading-[1.4667] truncate">
										{item.name}
									</p>
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default DefaultSuggestions;
