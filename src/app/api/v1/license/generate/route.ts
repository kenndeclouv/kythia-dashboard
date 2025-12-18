import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

import { prisma } from '@/libs/prisma';
import { checkRateLimit } from '@/utils/rate-limit';

function generateLicenseKey() {
	// Format: KYTHIA-XXXX-XXXX-XXXX-XXXX
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const segments = 4;
	const segmentLength = 4;

	const parts = [];

	for (let i = 0; i < segments; i++) {
		let segment = '';

		for (let j = 0; j < segmentLength; j++) {
			segment += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		parts.push(segment);
	}

	return `KYTHIA-${parts.join('-')}`;
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const ownerId = '1158654757183959091';
	const userId = (session.user as any).id || (session.user as any).sub;

	if (userId !== ownerId) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}

	const ip = req.headers.get('x-forwarded-for') || 'unknown';

	if (!checkRateLimit(ip, { limit: 5, window: 60 })) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
	}

	try {
		const body = await req.json();
		const { ownerId } = body;

		if (!ownerId) {
			return NextResponse.json(
				{ error: 'Owner ID is required' },
				{ status: 400 },
			);
		}

		// Generate unique key
		let key = generateLicenseKey();
		let isUnique = false;

		// Ensure uniqueness (though collision is unlikely)
		while (!isUnique) {
			const existing = await prisma.license.findUnique({ where: { key } });

			if (!existing) {
				isUnique = true;
			} else {
				key = generateLicenseKey();
			}
		}

		const license = await prisma.license.create({
			data: {
				key,
				ownerId,
				isActive: true,
			},
		});

		return NextResponse.json({
			success: true,
			license,
		});
	} catch (error) {
		console.error('[LICENSE_GENERATE_ERROR]', error);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
