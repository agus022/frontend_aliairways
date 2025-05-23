// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      username?: string;
    } & DefaultSession['user'];
    accessToken?: string;
    };
  

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    token?: string;
    username?: string;
  }
}

  declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    username?: string;
    accessToken?: string;
  }
}
