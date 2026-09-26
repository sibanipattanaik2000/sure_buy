import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only the homepage should be indexable.
  if (pathname === "/") {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Keep the page fully accessible, but prevent search indexing.
  response.headers.set(
    "X-Robots-Tag",
    "noindex, follow",
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on application pages, but skip:
     * - Next.js internal assets
     * - favicon
     * - common static files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|txt|xml)$).*)",
  ],
};