import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: NextAuthOptions = {
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
			authorization: { params: { scope: 'identify guilds' } },
		}),
	],

	session: {
		strategy: 'jwt',
		maxAge: 7 * 24 * 60 * 60,
	},

	pages: {
		signIn: '/login',
	},

	callbacks: {
		jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = user.id;
			}

			return token;
		},

		session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;

				session.accessToken = token.accessToken as string;
			}

			return session;
		},
	},
};
