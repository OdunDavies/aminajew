import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verify-admin";
import fs from "fs";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Magic byte signatures for allowed image types
const IMAGE_SIGNATURES: { ext: string; bytes: number[][]; offset?: number }[] = [
  { ext: "jpg", bytes: [[0xff, 0xd8, 0xff]] },
  { ext: "png", bytes: [[0x89, 0x50, 0x4e, 0x47]] },
  { ext: "gif", bytes: [[0x47, 0x49, 0x46, 0x38]] },
  { ext: "webp", bytes: [[0x52, 0x49, 0x46, 0x46]], offset: 0 }, // also need "WEBP" at offset 8
  { ext: "avif", bytes: [[0x00, 0x00, 0x00]] }, // AVIF/HEIF — ftyp box at offset 4
];

function detectImageType(buf: Buffer): string | null {
  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  // GIF
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "gif";
  // WebP (RIFF....WEBP)
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

  // Validate by magic bytes — do not trust client-provided MIME type
  const ext = detectImageType(buffer);
  if (!ext) {
    return NextResponse.json({ error: "Invalid file. Only JPEG, PNG, GIF, and WebP images are allowed." }, { status: 400 });
  }

  const filename = `${crypto.randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
