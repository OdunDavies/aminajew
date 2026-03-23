import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verify-admin";
import { getStore } from "@netlify/blobs";
import fs from "fs";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function detectImageType(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "gif";
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return "webp";
  return null;
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum size is 5 MB." }, { status: 400 });
  }

  const ext = detectImageType(buffer);
  if (!ext) {
    return NextResponse.json(
      { error: "Invalid file. Only JPEG, PNG, GIF, and WebP images are allowed." },
      { status: 400 }
    );
  }

  const key = `${crypto.randomUUID()}.${ext}`;
  const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;

  // Try Netlify Blobs (production)
  try {
    const store = getStore({ name: "uploads", consistency: "strong" });
    await store.set(key, buffer, { metadata: { contentType } });
    return NextResponse.json({ url: `/api/uploads/${key}` }, { status: 201 });
  } catch {
    // Local dev fallback — write to public/uploads/
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, key), buffer);
  return NextResponse.json({ url: `/uploads/${key}` }, { status: 201 });
}
