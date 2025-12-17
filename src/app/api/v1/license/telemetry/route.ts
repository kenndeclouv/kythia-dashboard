import { NextResponse } from 'next/server';

import { prisma } from '@/libs/prisma';
import { checkRateLimit } from '@/utils/rate-limit';

export async function POST(req: Request) {
	try {
		const ip = req.headers.get('x-forwarded-for') || 'unknown';

		if (!checkRateLimit(ip, { limit: 10, window: 60 })) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		const body = await req.json();
		const { key, logs } = body;

		if (!key) return NextResponse.json({ error: 'No key' }, { status: 400 });

		const license = await prisma.license.findUnique({
			where: { key },
			select: { id: true, isActive: true },
		});

		if (!license)
			return NextResponse.json({ error: 'Invalid' }, { status: 401 });

		if (!logs || !Array.isArray(logs) || logs.length === 0) {
			return NextResponse.json({ success: true, count: 0 });
		}

		const telemetryData = logs.map((log: any) => ({
			licenseId: license.id,
			level: log.level || 'info',
			message: log.message || '',
			metadata: log.metadata || null,
		}));

		const result = await prisma.telemetryLog.createMany({
			data: telemetryData,
		});

		return NextResponse.json({ success: true, count: result.count });
	} catch (error) {
		console.error('[TELEMETRY_ERROR]', error);

		return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
	}
}
