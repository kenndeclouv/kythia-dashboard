import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

const BOT_API_URL =
	process.env.KYTHIA_BOT_API_URL || 'http://localhost:3000/api';

type FetchOptions = RequestInit & {
	revalidate?: number | false;
};

export async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
	try {
		const session = await getServerSession(authOptions);

		const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
		const fullUrl = `${BOT_API_URL}${path}`;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(options.headers as any),
		};

		if (process.env.API_SECRET) {
			headers['Authorization'] = `Bearer ${process.env.API_SECRET}`;
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		let nextConfig = {};
		let cacheMode: RequestCache | undefined = 'no-store';

		if (typeof options.revalidate === 'number') {
			cacheMode = undefined;
			nextConfig = { revalidate: options.revalidate };
		}

		const res = await fetch(fullUrl, {
			...options,
			headers,
			cache: cacheMode,
			next: nextConfig,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		const contentType = res.headers.get('content-type');

		if (!contentType || !contentType.includes('application/json')) return null;

		if (!res.ok) return null;

		return await res.json();
	} catch (error) {
		console.error(`❌ Bot API Error: ${(error as Error).message}`);

		return null;
	}
}
