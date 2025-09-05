// middleware.ts

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const xfProto = request.headers.get("x-forwarded-proto") ?? "";
  const proto = xfProto || request.nextUrl.protocol; // "http" or "http:"
  const isLocalhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production";

  // Force HTTPS only in production and not on localhost
  if (isProd && !isLocalhost && (proto === "http" || proto === "http:")) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";

    return NextResponse.redirect(httpsUrl, {
      status: 308, // method-preserving permanent redirect
      headers: {
        // Only send HSTS in prod (never on localhost)
        "Strict-Transport-Security":
          "max-age=31536000; includeSubDomains; preload",
      },
    });
  }

  // Continue with auth/session handling
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
