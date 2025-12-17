// src/components/layout/front-pages/Header.tsx
'use client';

// React Imports
import { useState } from 'react';

// Next Imports
import Link from 'next/link';

// MUI Imports
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme } from '@mui/material/styles';

// Third-party Imports
import classnames from 'classnames';
import { useSession } from 'next-auth/react'; // <--- IMPORT INI

// Type Imports
import type { Mode } from '@core/types';

// Component Imports
import Logo from '@components/layout/shared/Logo';
import ModeDropdown from '@components/layout/shared/ModeDropdown';
import FrontMenu from './FrontMenu';
import CustomIconButton from '@core/components/mui/IconButton';
import UserDropdown from '@components/layout/shared/UserDropdown';

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses';

// Styles Imports
import styles from './styles.module.css';

const Header = ({ mode }: { mode: Mode }) => {
	// States
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	// Hooks
	const isBelowLgScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down('lg'),
	);
	const { data: session } = useSession(); // <--- CEK SESSION DISINI

	return (
		<header className={classnames(frontLayoutClasses.header, styles.header)}>
			<div
				className={classnames(
					frontLayoutClasses.navbar,
					styles.navbar,
					{ [styles.headerScrolled]: true },
					'glass border border-white/10',
				)}
			>
				<div
					className={classnames(
						frontLayoutClasses.navbarContent,
						styles.navbarContent,
					)}
				>
					{/* --- LOGO & MENU --- */}
					{isBelowLgScreen ? (
						<div className="flex items-center gap-2 sm:gap-4">
							<IconButton
								onClick={() => setIsDrawerOpen(true)}
								className="-mis-2"
							>
								<i className="tabler-menu-2 text-textPrimary" />
							</IconButton>
							<Link href="/">
								<Logo />
							</Link>
							<FrontMenu
								mode={mode}
								isDrawerOpen={isDrawerOpen}
								setIsDrawerOpen={setIsDrawerOpen}
							/>
						</div>
					) : (
						<div className="flex items-center gap-10">
							<Link href="/">
								<Logo />
							</Link>
							<FrontMenu
								mode={mode}
								isDrawerOpen={isDrawerOpen}
								setIsDrawerOpen={setIsDrawerOpen}
							/>
						</div>
					)}

					{/* --- RIGHT SIDE (Actions) --- */}
					<div className="flex items-center gap-2 sm:gap-4">
						<ModeDropdown />

						{/* LOGIC: Kalau login -> UserDropdown, Kalau belum -> Tombol Login */}
						{session ? (
							<UserDropdown />
						) : // Tombol Login (Responsive)
						isBelowLgScreen ? (
							<CustomIconButton
								component={Link}
								variant="contained"
								href="/login"
								color="primary"
							>
								<i className="tabler-login text-xl" />
							</CustomIconButton>
						) : (
							<Button
								component={Link}
								variant="contained"
								href="/login"
								startIcon={<i className="tabler-login text-xl" />}
								className="whitespace-nowrap"
							>
								Login
							</Button>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
