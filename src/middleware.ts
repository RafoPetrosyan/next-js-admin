import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req: NextRequest): Promise<NextResponse | null> {
    const token = await getToken({ req });
    const isAuth = Boolean(token);
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    console.log(token, 'token');

    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!isAuth && !isAuthPage) {
      const from = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(new URL(`/auth/sign-in?from=${encodeURIComponent(from)}`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized(): Promise<boolean> {
        // Always allow middleware to handle the request
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/:path*'],
};
