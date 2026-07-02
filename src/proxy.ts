import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];
const PROTECTED_ROUTES = ["/dashboard", "/account"];

function isAuthRoute(path: string) {
    return AUTH_ROUTES.some((r) => path === r || path.startsWith(r + "/"));
}

function isProtectedRoute(path: string) {
    return PROTECTED_ROUTES.some((r) => path === r || path.startsWith(r + "/"));
}

function roleRedirect(role: string): string {
    if (role === "ADMIN" || role === "EDITOR") return "/dashboard";
    return "/account";
}

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Optimistic check: read session cookie (no DB call — per Next.js proxy best practices)
    const sessionToken = req.cookies.get("better-auth.session_token")?.value;
    const isAuthenticated = !!sessionToken;

    // Role cookie set by the app after sign-in for optimistic redirects
    const role = req.cookies.get("np-role")?.value ?? "";

    // Protected route → not authenticated → redirect to login
    if (isProtectedRoute(path) && !isAuthenticated) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(url);
    }

    // Auth route → already authenticated → redirect to appropriate home
    if (isAuthRoute(path) && isAuthenticated) {
        const url = req.nextUrl.clone();
        url.pathname = roleRedirect(role);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|feed).*)",
    ],
};
