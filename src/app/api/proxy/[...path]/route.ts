import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

const BOT_API_URL =
	process.env.KYTHIA_BOT_API_URL || 'http://localhost:3000/api';
const API_SECRET = process.env.API_SECRET;

async function handler(
	req: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }, // Next.js 15: params is Promise
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ error: 'Unauthorized: Please login first' },
			{ status: 401 },
		);
	}

	const { path } = await params;
	const endpoint = path.join('/');
	const targetUrl = `${BOT_API_URL}/${endpoint}`;

	let body: any;

	if (req.method !== 'GET' && req.method !== 'HEAD') {
		try {
			body = await req.text();
		} catch (_e) {
			body = null;
		}
	}

	try {
		const backendRes = await fetch(targetUrl, {
			method: req.method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_SECRET}`,
				'X-User-ID': session.user.id,
			},
			body: body,
			cache: 'no-store',
		});

		const data = await backendRes.json();

		return NextResponse.json(data, { status: backendRes.status });
	} catch (error: any) {
		console.error('❌ Proxy Error:', error);

		return NextResponse.json(
			{ error: 'Failed to reach Bot API', details: error.message },
			{ status: 502 }, // Bad Gateway
		);
	}
}

export {
	handler as GET,
	handler as POST,
	handler as PATCH,
	handler as PUT,
	handler as DELETE,
};
