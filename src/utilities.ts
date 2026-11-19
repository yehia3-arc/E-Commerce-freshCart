import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getMyToken() {
  const store = await cookies();
  // ✅ prod (HTTPS) = __Secure- prefix ; dev / plain-http = no prefix
  const raw =
    store.get("__Secure-next-auth.session-token")?.value ??
    store.get("next-auth.session-token")?.value;
  if (!raw) return undefined;
  const decoded = await decode({
    token: raw,
    secret: process.env.NEXTAUTH_SECRET!,
  });
  return decoded?.routeToken;
}
