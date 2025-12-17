import { NextResponse } from 'next/server';

import { prisma } from '@/libs/prisma';
import { checkRateLimit } from '@/utils/rate-limit';

export async function POST(req: Request) {
	try {
		const ip = req.headers.get('x-forwarded-for') || 'unknown';

		if (!checkRateLimit(ip, { limit: 5, window: 60 })) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		const body = await req.json();
		const { key, hwid, config, clientId } = body;

		if (!key)
			return NextResponse.json(
				{ valid: false, error: 'No key' },
				{ status: 400 },
			);

		const license = await prisma.license.findUnique({ where: { key } });

		if (!license)
			return NextResponse.json(
				{ valid: false, error: 'Invalid key' },
				{ status: 401 },
			);
		if (!license.isActive)
			return NextResponse.json(
				{ valid: false, error: 'Suspended' },
				{ status: 403 },
			);

		if (!license.boundClientId && clientId) {
			await prisma.license.update({
				where: { id: license.id },
				data: { boundClientId: clientId },
			});
		}

		// Skenario 2: License sudah terikat, kita cek kecocokannya
		else if (license.boundClientId && clientId) {
			if (license.boundClientId !== clientId) {
				console.warn(
					`[THEFT_ALERT] Key ${key} dipake Bot ID ${clientId}, padahal milik ID ${license.boundClientId}`,
				);

				return NextResponse.json(
					{
						valid: false,
						error:
							'License is bound to another Bot Application ID. Contact support to reset.',
					},
					{ status: 403 },
				);
			}
		}

		// ============================================================

		// Update data rutin
		await prisma.license.update({
			where: { id: license.id },
			data: {
				hwid: JSON.stringify(hwid),
				config: JSON.stringify(config),
				ipAddress: ip,
				lastUsed: new Date(),
			},
		});

		return NextResponse.json({
			valid: true,
			owner: license.ownerId,
			message: 'Verified',
		});
	} catch (error) {
		console.error('[VERIFY_ERROR]', error);

		return NextResponse.json(
			{ valid: false, error: 'Server Error' },
			{ status: 500 },
		);
	}
}
