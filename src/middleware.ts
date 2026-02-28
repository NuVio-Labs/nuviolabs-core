import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/t")
    if (!isProtected) return NextResponse.next()

    const hasSession =
        req.cookies.has("authjs.session-token") ||
        req.cookies.has("__Secure-authjs.session-token") ||
        req.cookies.has("next-auth.session-token") ||
        req.cookies.has("__Secure-next-auth.session-token")

    if (hasSession) return NextResponse.next()

    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
}

export const config = {
    matcher: ["/admin/:path*", "/t/:path*"],
}
