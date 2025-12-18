import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth'; // 👈 Wajib ada

import { authOptions } from '@/libs/auth'; // 👈 Sesuaikan path ke file config NextAuth kamu

import { prisma } from '@/libs/prisma';
import { checkRateLimit } from '@/utils/rate-limit';

export async function GET(req: Request) {
	// 1. 🛡️ CEK SESSION (Login gak?)
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json(
			{ error: 'Unauthorized. Please login.' },
			{ status: 401 },
		);
	}

	// 2. 🛡️ CEK OWNER (Ini kamu bukan?)
	const ownerId = '1158654757183959091';

	// Note: Pastikan session.user.id ada (tergantung config nextauth kamu, kadang sub/id)
	const userId = (session.user as any).id || (session.user as any).sub;

	if (userId !== ownerId) {
		console.warn(`[SECURITY] User ${userId} tried to fetch license list!`);

		return NextResponse.json(
			{ error: 'Forbidden. You are not the owner.' },
			{ status: 403 },
		);
	}

	// 3. 🛡️ RATE LIMIT (Tetep dipake buat anti-spam)
	const ip = req.headers.get('x-forwarded-for') || 'unknown';

	if (!checkRateLimit(ip, { limit: 20, window: 60 })) {
		// Limit agak gedean dikit gpp buat admin
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
	}

	try {
		// 4. ✅ AMAN, BARU FETCH DATA
		const licenses = await prisma.license.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(licenses);
	} catch (error) {
		console.error('[LICENSE_LIST_ERROR]', error);

		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
