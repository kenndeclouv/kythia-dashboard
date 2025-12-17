'use client';

// React Imports
import { useRef, useState } from 'react';

// Next Imports
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// MUI Imports
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import type { Breakpoint } from '@mui/material/styles';

// Third-party Imports
import classnames from 'classnames';
import { useDebounce, useMedia } from 'react-use';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import PerfectScrollbar from 'react-perfect-scrollbar';

// Type Imports
import type { Settings } from '@core/contexts/settingsContext';
import type { Direction } from '@core/types';
import type { PrimaryColorConfig } from '@configs/primaryColorConfig';

// Icon Imports
import SkinDefault from '@core/svg/SkinDefault';
import SkinBordered from '@core/svg/SkinBordered';
import ContentCompact from '@core/svg/ContentCompact';
import ContentWide from '@core/svg/ContentWide';
import DirectionLtr from '@core/svg/DirectionLtr';
import DirectionRtl from '@core/svg/DirectionRtl';

// Config Imports
import primaryColorConfig from '@configs/primaryColorConfig';

// Hook Imports
import { useSettings } from '@core/hooks/useSettings';

// Style Imports
import styles from './styles.module.css';

type CustomizerProps = {
	breakpoint?:
		| Breakpoint
		| 'xxl'
		| `${number}px`
		| `${number}rem`
		| `${number}em`;
	dir?: Direction;
	disableDirection?: boolean;
};

const getLocalePath = (pathName: string, locale: string) => {
	if (!pathName) return '/';
	const segments = pathName.split('/');

	segments[1] = locale;

	return segments.join('/');
};

type DebouncedColorPickerProps = {
	settings: Settings;
	isColorFromPrimaryConfig: PrimaryColorConfig | undefined;
	handleChange: (
		field: keyof Settings | 'primaryColor',
		value: Settings[keyof Settings] | string,
	) => void;
};

const Customizer = ({
	breakpoint = 'lg',
	dir = 'ltr',
	disableDirection = true,
}: CustomizerProps) => {
	// States
	const [isOpen, setIsOpen] = useState(false);
	const [direction, setDirection] = useState(dir);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Refs
	const anchorRef = useRef<HTMLDivElement | null>(null);

	// Hooks
	const theme = useTheme();
	const pathName = usePathname();
	const { settings, updateSettings, resetSettings, isSettingsChanged } =
		useSettings();
	const isSystemDark = useMedia('(prefers-color-scheme: dark)', false);

	// Vars
	let breakpointValue: CustomizerProps['breakpoint'];

	switch (breakpoint) {
		case 'xxl':
			breakpointValue = '1920px';
			break;
		case 'xl':
			breakpointValue = `${theme.breakpoints.values.xl}px`;
			break;
		case 'lg':
			breakpointValue = `${theme.breakpoints.values.lg}px`;
			break;
		case 'md':
			breakpointValue = `${theme.breakpoints.values.md}px`;
			break;
		case 'sm':
			breakpointValue = `${theme.breakpoints.values.sm}px`;
			break;
		case 'xs':
			breakpointValue = `${theme.breakpoints.values.xs}px`;
			break;
		default:
			breakpointValue = breakpoint;
	}

	const breakpointReached = useMedia(`(max-width: ${breakpointValue})`, false);
	const isMobileScreen = useMedia('(max-width: 600px)', false);
	const isBelowLgScreen = useMedia('(max-width: 1200px)', false);
	const isColorFromPrimaryConfig = primaryColorConfig.find(
		(item) => item.main === settings.primaryColor,
	);

	const ScrollWrapper = isBelowLgScreen ? 'div' : PerfectScrollbar;

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	// Update Settings
	const handleChange = (
		field: keyof Settings | 'direction',
		value: Settings[keyof Settings] | Direction,
	) => {
		// Update direction state
		if (field === 'direction') {
			setDirection(value as Direction);
		} else {
			// Update settings in cookie
			updateSettings({ [field]: value });
		}
	};

	const handleMenuClose = (event: MouseEvent | TouchEvent): void => {
		if (anchorRef.current?.contains(event.target as HTMLElement)) {
			return;
		}

		setIsMenuOpen(false);
	};

	return (
		!breakpointReached && (
			<div
				className={classnames('customizer', styles.customizer, {
					[styles.show]: isOpen,
					[styles.smallScreen]: isMobileScreen,
				})}
			>
				<div
					className={styles.toggler}
					onClick={handleToggle}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleToggle();
						}
					}}
				>
					<i className="tabler-settings text-[22px]" />
				</div>
				<div className={styles.header}>
					<div className="flex flex-col">
						<h4 className={styles.customizerTitle}>Theme Customizer</h4>
						<p className={styles.customizerSubtitle}>
							Customize Your Kythia Dashboard
						</p>
					</div>
					<div className="flex gap-4">
						<div
							onClick={resetSettings}
							className="relative flex cursor-pointer"
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									resetSettings();
								}
							}}
						>
							<i className="tabler-refresh text-textPrimary" />
							<div
								className={classnames(styles.dotStyles, {
									[styles.show]: isSettingsChanged,
								})}
							/>
						</div>
						<i
							className="tabler-x text-textPrimary cursor-pointer"
							onClick={handleToggle}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleToggle();
								}
							}}
						/>
					</div>
				</div>
				<ScrollWrapper
					{...(isBelowLgScreen
						? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
						: { options: { wheelPropagation: false, suppressScrollX: true } })}
				>
					<div className={styles.customizerBody}>
						<div className="flex flex-col gap-6">
							<Chip
								label="Theming"
								size="small"
								color="primary"
								variant="tonal"
								className="self-start rounded-sm"
							/>
							<div className="flex flex-col gap-2">
								<p className="font-medium">Mode</p>
								<div className="flex items-center justify-between">
									<div className="flex flex-col items-start gap-0.5">
										<div
											className={classnames(
												styles.itemWrapper,
												styles.modeWrapper,
												{
													[styles.active]: settings.mode === 'light',
												},
											)}
											onClick={() => handleChange('mode', 'light')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('mode', 'light');
												}
											}}
										>
											<i className="tabler-sun text-[30px]" />
										</div>
										<p
											className={styles.itemLabel}
											onClick={() => handleChange('mode', 'light')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('mode', 'light');
												}
											}}
										>
											Light
										</p>
									</div>
									<div className="flex flex-col items-start gap-0.5">
										<div
											className={classnames(
												styles.itemWrapper,
												styles.modeWrapper,
												{
													[styles.active]: settings.mode === 'dark',
												},
											)}
											onClick={() => handleChange('mode', 'dark')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('mode', 'dark');
												}
											}}
										>
											<i className="tabler-moon-stars text-[30px]" />
										</div>
										<p
											className={styles.itemLabel}
											onClick={() => handleChange('mode', 'dark')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('mode', 'dark');
												}
											}}
										>
											Dark
										</p>
									</div>
									<div className="flex flex-col items-start gap-0.5">
										<div
											className={classnames(
												styles.itemWrapper,
												styles.modeWrapper,
												{
													[styles.active]: settings.mode === 'system',
												},
											)}
											onClick={() => handleChange('mode', 'system')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('mode', 'system');
												}
											}}
										>
											<i className="tabler-device-laptop text-[30px]" />
										</div>
										<p
											className={styles.itemLabel}
											onClick={() => handleChange('mode', 'system')}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('mode', 'system');
												}
											}}
										>
											System
										</p>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<p className="font-medium">Skin</p>
								<div className="flex items-center gap-4">
									<div className="flex flex-col items-start gap-0.5">
										<div
											className={classnames(styles.itemWrapper, {
												[styles.active]: settings.skin === 'default',
											})}
											onClick={() => handleChange('skin', 'default')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('skin', 'default');
												}
											}}
										>
											<SkinDefault />
										</div>
										<p
											className={styles.itemLabel}
											onClick={() => handleChange('skin', 'default')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('skin', 'default');
												}
											}}
										>
											Default
										</p>
									</div>
									<div className="flex flex-col items-start gap-0.5">
										<div
											className={classnames(styles.itemWrapper, {
												[styles.active]: settings.skin === 'bordered',
											})}
											onClick={() => handleChange('skin', 'bordered')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('skin', 'bordered');
												}
											}}
										>
											<SkinBordered />
										</div>
										<p
											className={styles.itemLabel}
											onClick={() => handleChange('skin', 'bordered')}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleChange('skin', 'bordered');
												}
											}}
										>
											Bordered
										</p>
									</div>
								</div>
							</div>
						</div>
						<hr className={styles.hr} />
						<div className="flex flex-col gap-6">
							<Chip
								label="Layout"
								variant="tonal"
								size="small"
								color="primary"
								className="self-start rounded-sm"
							/>

							<div className="flex flex-col gap-2">
								<p className="font-medium">Content</p>
								<div className="flex items-center gap-4">
									<div className="flex flex-col items-start gap-0.5">
										<div
											className={classnames(styles.itemWrapper, {
												[styles.active]: settings.contentWidth === 'compact',
											})}
											onClick={() =>
												updateSettings({
													navbarContentWidth: 'compact',
													contentWidth: 'compact',
													footerContentWidth: 'compact',
												})
											}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													updateSettings({
														navbarContentWidth: 'compact',
														contentWidth: 'compact',
														footerContentWidth: 'compact',
													});
												}
											}}
										>
											<ContentCompact />
										</div>
										<p
											className={styles.itemLabel}
											onClick={() =>
												updateSettings({
													navbarContentWidth: 'compact',
													contentWidth: 'compact',
													footerContentWidth: 'compact',
												})
											}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													updateSettings({
														navbarContentWidth: 'compact',
														contentWidth: 'compact',
														footerContentWidth: 'compact',
													});
												}
											}}
										>
											Compact
										</p>
									</div>
									<div className="flex flex-col items-start gap-0.5">
										<div
											className={classnames(styles.itemWrapper, {
												[styles.active]: settings.contentWidth === 'wide',
											})}
											onClick={() =>
												updateSettings({
													navbarContentWidth: 'wide',
													contentWidth: 'wide',
													footerContentWidth: 'wide',
												})
											}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													updateSettings({
														navbarContentWidth: 'wide',
														contentWidth: 'wide',
														footerContentWidth: 'wide',
													});
												}
											}}
										>
											<ContentWide />
										</div>
										<p
											className={styles.itemLabel}
											onClick={() =>
												updateSettings({
													navbarContentWidth: 'wide',
													contentWidth: 'wide',
													footerContentWidth: 'wide',
												})
											}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													updateSettings({
														navbarContentWidth: 'wide',
														contentWidth: 'wide',
														footerContentWidth: 'wide',
													});
												}
											}}
										>
											Wide
										</p>
									</div>
								</div>
							</div>
							{!disableDirection && (
								<div className="flex flex-col gap-2">
									<p className="font-medium">Direction</p>
									<div className="flex items-center gap-4">
										<Link href={getLocalePath(pathName, 'en')}>
											<div className="flex flex-col items-start gap-0.5">
												<div
													className={classnames(styles.itemWrapper, {
														[styles.active]: direction === 'ltr',
													})}
												>
													<DirectionLtr />
												</div>
												<p className={styles.itemLabel}>
													Left to Right <br />
													(English)
												</p>
											</div>
										</Link>
										<Link href={getLocalePath(pathName, 'ar')}>
											<div className="flex flex-col items-start gap-0.5">
												<div
													className={classnames(styles.itemWrapper, {
														[styles.active]: direction === 'rtl',
													})}
												>
													<DirectionRtl />
												</div>
												<p className={styles.itemLabel}>
													Right to Left <br />
													(Arabic)
												</p>
											</div>
										</Link>
									</div>
								</div>
							)}
						</div>
					</div>
				</ScrollWrapper>
			</div>
		)
	);
};

export default Customizer;
