import { getServerSession } from 'next-auth/next';

import authOptions from '@/lib/auth';

export async function getCurrentUser(): Promise<any> {
  const session = await getServerSession(authOptions);

  return session?.user || null;
}
