import type { DefaultSession } from 'next-auth';

// import type NextAuth from "next-auth"
// import type { JWT } from "next-auth/jwt"

declare module 'next-auth' {
	/**
	 * Kita extend tipe Session bawaan biar dia tau ada 'accessToken' dan 'user.id'
	 */
	interface Session {
		accessToken?: string;
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

declare module 'next-auth/jwt' {
	/**
	 * Kita extend tipe JWT bawaan
	 */
	interface JWT {
		accessToken?: string;
		id?: string;
	}
}
