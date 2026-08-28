import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Allow auth pages through (login, register)
    if (pathname.startsWith("/auth")) {
        return NextResponse.next();
    }

    // Protect all other pages — redirect to login if no token
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * - _next (static files, HMR)
         * - api routes
         * - favicon, images, etc.
         */
        "/((?!_next|api|favicon.ico|.*\\.).*)",
    ],
};
