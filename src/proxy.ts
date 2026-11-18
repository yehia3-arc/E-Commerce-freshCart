import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// gate between client & server
export async function proxy(request: NextRequest) {
  const protectedRoutes = ["/wishlist", "/checkout", "/allorders", "/profile"];
  const authRoutes = ["/login", "/register"];
  // console.log("request..", request.nextUrl);

  // 1- get pathname in url
  const myPath = request.nextUrl.pathname;

  // get token
  const myToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  console.log("tttttttttttttt");

  const token = myToken?.routeToken;

  if (!token && protectedRoutes.some((path) => myPath.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (token && authRoutes.some((path) => myPath.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/cart/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/allorders/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
