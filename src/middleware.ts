import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="EMFI UAT"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export function middleware(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // Auth is active only when both credentials are configured (e.g. on Vercel UAT).
  if (!user || !password) {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const colon = decoded.indexOf(":");
    const givenUser = colon === -1 ? decoded : decoded.slice(0, colon);
    const givenPassword = colon === -1 ? "" : decoded.slice(colon + 1);

    if (givenUser === user && givenPassword === password) {
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }
  }

  return unauthorized();
}

export const config = {
  matcher: [
    /*
     * Protect every page and asset except Next internals / common static icons.
     * Static brand assets stay behind auth so the UAT site is not openly crawlable.
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
