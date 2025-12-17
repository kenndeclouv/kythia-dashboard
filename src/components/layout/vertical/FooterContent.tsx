'use client';

// Next Imports
import Link from 'next/link';

// Third-party Imports
import classnames from 'classnames';

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav';

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses';

const FooterContent = () => {
	// Hooks
	const { isBreakpointReached } = useVerticalNav();

	return (
		<div
			className={classnames(
				verticalLayoutClasses.footerContent,
				'flex items-center justify-between flex-wrap gap-4',
			)}
		>
			<p>
				<Link href="https://kythia.me" target="_blank" className="text-primary">
					Kythia
				</Link>
				<span className="text-textSecondary">{` © ${new Date().getFullYear()} All rights reserved `}</span>
			</p>
			{!isBreakpointReached && (
				<div className="flex items-center gap-4">
					<Link href="/" target="_blank" className="hover:text-primary">
						Home
					</Link>
					<Link href="/privacy" target="_blank" className="hover:text-primary">
						Privacy
					</Link>
					<Link
						href="/terms-of-service"
						target="_blank"
						className="hover:text-primary"
					>
						ToS
					</Link>
					<Link
						href="https://dsc.gg/kythia"
						target="_blank"
						className="hover:text-primary"
					>
						Support
					</Link>
				</div>
			)}
		</div>
	);
};

export default FooterContent;
