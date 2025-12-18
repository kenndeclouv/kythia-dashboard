'use client';

import Image from 'next/image';

import Typography from '@mui/material/Typography';
import { kythiaConfig } from '@config';
import classnames from 'classnames';

type Props = {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	logo?: boolean;
	className?: string;
};

const LOGO_URL = kythiaConfig.assets.logo;

const PageHeader = ({ title, subtitle, logo = false, className }: Props) => {
	return (
		<div className={classnames('text-center mb-44', className)}>
			<Typography
				variant="h2"
				className="font-bold mb-4 flex items-center justify-center gap-3 flex-wrap"
			>
				{/* Render Logo kalo props logo=true */}
				{logo && (
					<Image
						src={LOGO_URL}
						alt="logo"
						width={50}
						height={50}
						className="object-contain"
					/>
				)}
				{/* Render Judul */}
				{title}
			</Typography>

			{/* Render Subtitle */}
			{subtitle && (
				<Typography
					variant="h5"
					className="text-textPrimary max-w-2xl mx-auto leading-relaxed opacity-90"
				>
					{subtitle}
				</Typography>
			)}
		</div>
	);
};

export default PageHeader;
