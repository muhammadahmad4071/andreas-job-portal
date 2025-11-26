// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  if (pathname.startsWith("/employer")) {
    const publicEmployerPaths = [
      "/employer/login",
      "/employer/register",
      "/employer/forgot-password",
    ]

    const isPublic = publicEmployerPaths.some((publicPath) =>
      pathname.startsWith(publicPath),
    )

    if (isPublic) {
      // Optional: prevent logged-in users from seeing login/register again
      if (token && pathname.startsWith("/employer/login")) {
        return NextResponse.redirect(new URL("/employer/home", request.url))
      }
      return NextResponse.next()
    }

    if (!token) {
      const loginUrl = new URL("/employer/login", request.url)
      loginUrl.searchParams.set("redirectTo", pathname + request.nextUrl.search)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/employer/:path*"],
}
