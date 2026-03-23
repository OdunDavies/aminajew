import { getStore } from "@netlify/blobs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  try {
    const store = getStore({ name: "uploads", consistency: "strong" });
    const blob = await store.get(key, { type: "arrayBuffer" });
    if (!blob) return new Response("Not found", { status: 404 });

    const meta = await store.getMetadata(key);
    const contentType = (meta?.metadata?.contentType as string) ?? "image/jpeg";

    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
