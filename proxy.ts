import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET_KEY ?? "fallback-dev-secret-change-in-production"
);

function passthrough(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return passthrough(request, pathname);
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return passthrough(request, pathname);
}

export const config = {
  matcher: ["/admin/:path*"],
};
