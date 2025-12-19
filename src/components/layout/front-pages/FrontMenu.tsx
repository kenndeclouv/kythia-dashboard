'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import classnames from 'classnames';

import type { Mode } from '@core/types';

import { kythiaConfig } from '@config';

type Props = {
	mode: Mode;
	isDrawerOpen: boolean;
	setIsDrawerOpen: (open: boolean) => void;
};

type WrapperProps = {
	children: React.ReactNode;
	isBelowLgScreen: boolean;
	className?: string;
	isDrawerOpen: boolean;
	setIsDrawerOpen: (open: boolean) => void;
};

const Wrapper = (props: WrapperProps) => {
	const {
		children,
		isBelowLgScreen,
		className,
		isDrawerOpen,
		setIsDrawerOpen,
	} = props;

	if (isBelowLgScreen) {
		return (
			<Drawer
				variant="temporary"
				anchor="left"
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{ '& .MuiDrawer-paper': { width: ['100%', 300] } }}
				className={classnames('p-5', className)}
			>
				<div className="p-4 flex flex-col gap-x-3">
					<IconButton
						onClick={() => setIsDrawerOpen(false)}
						className="absolute inline-end-4 block-start-2"
					>
						<i className="tabler-x" />
					</IconButton>
					{children}
				</div>
			</Drawer>
		);
	}

	return (
		<div
			className={classnames(
				'flex items-center flex-wrap gap-x-4 gap-y-3',
				className,
			)}
		>
			{children}
		</div>
	);
};

const FrontMenu = (props: Props) => {
	const { isDrawerOpen, setIsDrawerOpen } = props;

	const pathname = usePathname();
	const isBelowLgScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down('lg'),
	);

	useEffect(() => {
		if (!isBelowLgScreen && isDrawerOpen) {
			setIsDrawerOpen(false);
		}
	}, [isBelowLgScreen, setIsDrawerOpen, isDrawerOpen]);

	return (
		<Wrapper
			isBelowLgScreen={isBelowLgScreen}
			isDrawerOpen={isDrawerOpen}
			setIsDrawerOpen={setIsDrawerOpen}
		>
			<Typography
				color="text.primary"
				component={Link}
				href="/"
				className={classnames(
					'font-medium plb-3 pli-1.5 hover:text-primary transition-all',
					{
						'text-primary': pathname === '/',
					},
				)}
			>
				Home
			</Typography>
			<Typography
				color="text.primary"
				component={Link}
				href="/commands"
				className={classnames(
					'font-medium plb-3 pli-1.5 hover:text-primary transition-all',
					{
						'text-primary': pathname === '/commands',
					},
				)}
			>
				Commands
			</Typography>
			<Typography
				color="text.primary"
				component={Link}
				href="/about"
				className={classnames(
					'font-medium plb-3 pli-1.5 hover:text-primary transition-all',
					{
						'text-primary': pathname === '/about',
					},
				)}
			>
				About
			</Typography>
			<Typography
				color="text.primary"
				component={Link}
				target="_blank"
				href={kythiaConfig.links.status}
				className="font-medium plb-3 pli-1.5 hover:text-primary transition-all"
			>
				Status
			</Typography>
		</Wrapper>
	);
};

export default FrontMenu;
