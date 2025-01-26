import axios from 'axios';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

interface SignInResponse {
  status: string;
  user: User; // Ensure this matches the expected User type
}

const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          throw new Error('Credentials are missing');
        }

        const { username, password } = credentials;

        try {
          const { data }: { data: SignInResponse } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/sign-in`,
            { username, password },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (data.status === 'success' && data.user) {
            // Ensure `data.user` includes the required fields of the `User` type.
            return data.user;
          }
        } catch (e: any) {
          throw new Error(JSON.stringify(e.response?.data || 'Authorization failed'));
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};

export default authOptions;
