import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

import { prisma } from '@/libs/prisma';
import { checkRateLimit } from '@/utils/rate-limit';

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }, // Next.js 15 params harus Promise
) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const userId = (session.user as any).id || (session.user as any).sub;

	if (userId !== '1158654757183959091')
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

	const ip = req.headers.get('x-forwarded-for') || 'unknown';

	if (!checkRateLimit(ip, { limit: 10, window: 60 })) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
	}

	try {
		const { id } = await params; // Await dulu

		const license = await prisma.license.findUnique({
			where: { id },
			include: {
				logs: {
					orderBy: { createdAt: 'desc' },
					take: 50,
				},
			},
		});

		if (!license) {
			return NextResponse.json({ error: 'License not found' }, { status: 404 });
		}

		return NextResponse.json(license);
	} catch (error) {
		console.error('[LICENSE_GET_ERROR]', error);

		return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const userId = (session.user as any).id || (session.user as any).sub;

	if (userId !== '1158654757183959091')
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

	const ip = req.headers.get('x-forwarded-for') || 'unknown';

	if (!checkRateLimit(ip, { limit: 10, window: 60 })) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
	}

	try {
		const { id } = await params;
		const body = await req.json();

		// Extract all possible fields
		const { isActive, boundClientId, ipAddress, hwid, config } = body;

		// Build update data object dynamically
		const updateData: any = {};

		if (isActive !== undefined) updateData.isActive = isActive;
		if (boundClientId !== undefined) updateData.boundClientId = boundClientId;
		if (ipAddress !== undefined) updateData.ipAddress = ipAddress;
		if (hwid !== undefined) updateData.hwid = hwid;
		if (config !== undefined) updateData.config = config;

		const license = await prisma.license.update({
			where: { id },
			data: updateData,
		});

		return NextResponse.json(license);
	} catch (error) {
		console.error('[LICENSE_PATCH_ERROR]', error);

		return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const userId = (session.user as any).id || (session.user as any).sub;

	if (userId !== '1158654757183959091')
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

	const ip = req.headers.get('x-forwarded-for') || 'unknown';

	if (!checkRateLimit(ip, { limit: 10, window: 60 })) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
	}

	try {
		const { id } = await params;

		await prisma.license.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'License deleted' });
	} catch (error) {
		console.error('[LICENSE_DELETE_ERROR]', error);

		return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
	}
}
