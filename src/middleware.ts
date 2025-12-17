import { NextResponse } from 'next/server';

import { withAuth } from 'next-auth/middleware';

export default withAuth(
	function middleware(req) {
		const path = req.nextUrl.pathname;

		const token = req.nextauth.token;
		const userId = token?.sub || (token as any)?.id;

		const ownerId = process.env.NEXT_PUBLIC_OWNER_ID;

		if (path.includes('/dash/admin')) {
			if (userId !== ownerId) {
				console.warn(
					`🚨 [BLOCKED] User ${userId} trying to access Admin Area!`,
				);

				const response = NextResponse.redirect(new URL('/', req.url));

				const cookieName = req.cookies.get('__Secure-next-auth.session-token')
					? '__Secure-next-auth.session-token'
					: 'next-auth.session-token';

				response.cookies.delete(cookieName);

				return response;
			}
		}
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	},
);

export const config = {
	matcher: ['/:path*/dash/:path*'],
};
