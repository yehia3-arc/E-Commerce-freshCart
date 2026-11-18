import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "ecommerce.routemisr.com";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const remoteUrl = `https://${ALLOWED_HOST}/${path.join("/")}`;

  const upstream = await fetch(remoteUrl, { cache: "force-cache" });
  if (!upstream.ok) return new NextResponse(null, { status: 404 });

  const buffer = Buffer.from(await upstream.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
