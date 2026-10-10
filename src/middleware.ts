import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const telegramId = request.cookies.get('finassist_telegram_id')?.value;
  const { pathname } = request.nextUrl;

  // Protect main dashboard root and any view paths
  if (pathname === '/') {
    if (!telegramId || !telegramId.trim()) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and trying to open login page, redirect to dashboard
  if (pathname === '/login') {
    if (telegramId && telegramId.trim()) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
