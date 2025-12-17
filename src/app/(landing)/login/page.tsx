'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { signIn, useSession } from 'next-auth/react';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import Logo from '@components/layout/shared/Logo';

const LoginPage = () => {
	const { status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	useEffect(() => {
		if (error) return;

		if (status === 'authenticated') {
			router.replace('/en/dash');
		} else if (status === 'unauthenticated') {
			signIn('discord', { callbackUrl: '/en/dash' });
		}
	}, [status, router, error]);

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Card className="flex flex-col sm:w-[450px] m-6 glass">
					<CardContent className="p-12 flex flex-col gap-8">
						<div className="flex justify-center items-center gap-3 mb-4">
							<Logo />
						</div>
						<Alert severity="error">
							Login failed or canceled. Please try again.
						</Alert>
						<Button
							fullWidth
							variant="contained"
							size="large"
							onClick={() => signIn('discord', { callbackUrl: '/en/dash' })}
						>
							Retry Login
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-6">
			<div className="relative">
				<CircularProgress size={240} thickness={2} />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<Logo />
				</div>
			</div>
			<Typography variant="h6" className="animate-pulse">
				Redirecting to Discord...
			</Typography>
		</div>
	);
};

export default LoginPage;
