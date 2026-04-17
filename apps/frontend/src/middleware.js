import { NextResponse } from 'next/server';
export function middleware(request) {
  const token = request.cookies.get('adminToken')?.value;
  if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
}
export const config = {
  matcher: ['/admin/home/:path*', '/admin/blogs/:path*', '/admin/drafts/:path*', '/admin/analytics/:path*'],
};
