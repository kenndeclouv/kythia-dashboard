'use server';

import { headers } from 'next/headers';
import { prisma } from '@/libs/prisma';

export async function trackVisitor() {
	const headersList = await headers();
	const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

	// Upsert visitor
	await prisma.visitor.upsert({
		where: { ip },
		update: {
			visits: { increment: 1 },
			lastVisit: new Date(),
		},
		create: {
			ip,
			visits: 1,
		},
	});

	// Get stats
	const totalVisitors = await prisma.visitor.count();

	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);

	const todayVisitors = await prisma.visitor.count({
		where: {
			lastVisit: {
				gte: startOfDay,
			},
		},
	});

	return {
		totalVisitors,
		todayVisitors,
	};
}
