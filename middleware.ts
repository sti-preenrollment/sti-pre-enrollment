import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(request) {
  const token = await getToken({ req: request });
  const role = token?.role;
  const pathname = request.nextUrl.pathname;

  // User redirect to respective route
  if (pathname.startsWith("/admission") && token?.role != "admission") {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }
  if (pathname.startsWith("/assessor") && token?.role != "assessor") {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }
  if (pathname.startsWith("/student") && token?.role != "student") {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }
});

export const config = {
  matcher: [
    "/admission/:path*",
    "/student/:path*",
    "/assessor/:path*",
    "/redirect",
  ],
};
