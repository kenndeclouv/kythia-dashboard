// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';

import { authOptions } from '@/libs/auth'; // Import config yang udah kita buat tadi

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
