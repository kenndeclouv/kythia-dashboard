// src/components/layout/front-pages/Footer.tsx
'use client';

// MUI Imports
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Third-party Imports
import classnames from 'classnames';

// Type Imports
import type { Mode } from '@core/types';

// Component Imports
import Link from '@components/Link';
import Logo from '@components/layout/shared/Logo';

// Hooks Imports
// import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses';

// Styles Imports
// import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css';
import { kythiaConfig } from '@config';

const Footer = ({ mode }: { mode: Mode }) => {
	return (
		<footer className="w-full relative overflow-hidden bg-primaryLighter z-10 border">
			<div>
				<div className={classnames('plb-12', frontCommonStyles.layoutSpacing)}>
					<Grid container rowSpacing={10} columnSpacing={12}>
						{/* COLUMN 1: Logo & Desc */}
						<Grid size={{ xs: 12, lg: 5 }}>
							<div className="flex flex-col items-start gap-6">
								<Link href="/">
									<Logo />
								</Link>
								<Typography className="md:max-is-[390px] opacity-[0.78]">
									Kythia is your cutest Discord companion. Packed with AI,
									moderation, music, and economy features to liven up your
									community.
								</Typography>

								<Button
									variant="contained"
									color="primary"
									href="https://discord.com/oauth2/authorize?client_id=1399016455072387202"
									target="_blank"
									startIcon={<i className="tabler-plus" />}
								>
									Add to Discord
								</Button>
							</div>
						</Grid>

						{/* COLUMN 2: Pages */}
						<Grid size={{ xs: 12, sm: 4, lg: 2 }} className="ms-auto">
							<Typography className="font-medium mbe-6 opacity-[0.92]">
								Resources
							</Typography>
							<div className="flex flex-col gap-4">
								<Typography
									component={Link}
									href="/"
									className="opacity-[0.78] hover:text-primary transition-all"
								>
									Home
								</Typography>
								<Typography
									component={Link}
									href="/commands"
									className="opacity-[0.78] hover:text-primary transition-all"
								>
									Commands
								</Typography>
								<Typography
									component={Link}
									href="/changelog"
									className="opacity-[0.78] hover:text-primary transition-all"
								>
									Changelog
								</Typography>
								<Typography
									component={Link}
									href="/about"
									className="opacity-[0.78] hover:text-primary transition-all"
								>
									About Owner
								</Typography>
								<Typography
									component={Link}
									href="/status"
									className="opacity-[0.78] hover:text-primary transition-all"
								>
									Status
								</Typography>
							</div>
						</Grid>

						{/* COLUMN 3: Legal */}
						<Grid size={{ xs: 12, sm: 4, lg: 2 }}>
							<Typography className="font-medium mbe-6 opacity-[0.92]">
								Legal
							</Typography>
							<div className="flex flex-col gap-4">
								<Typography
									component={Link}
									href="/tos"
									className="opacity-[0.78] hover:text-primary transition-all"
								>
									Terms of Service
								</Typography>
								<Typography
									component={Link}
									href="/privacy"
									className="opacity-[0.78] hover:text-primary transition-all"
								>
									Privacy Policy
								</Typography>
							</div>
						</Grid>
					</Grid>
				</div>
				<Typography
					variant="h1"
					align="center"
					sx={{
						fontSize: 'clamp(4rem, 19vw, 28rem)',

						fontWeight: 800,
						lineHeight: 0.7,

						color: kythiaConfig.general.primaryColor,

						width: '100%',
						userSelect: 'none',
					}}
				>
					KYTHIA
				</Typography>
			</div>
		</footer>
	);
};

export default Footer;
