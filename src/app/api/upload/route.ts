import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { isRequestAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Check admin authentication
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let cloudinaryError: string | null = null;

    // 1. Upload to Cloudinary when credentials or an unsigned preset are configured.
    if (cloudName && ((apiKey && apiSecret) || uploadPreset)) {
      try {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const uploadFormData = new FormData();
        const blob = new Blob([buffer], { type: file.type });
        uploadFormData.append("file", blob, file.name);

        if (apiKey && apiSecret) {
          const timestamp = Math.round(Date.now() / 1000).toString();
          const folder = "iem_kids_fashion_week";

          // Generate SHA-1 signature for Cloudinary
          const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
          const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

          uploadFormData.append("api_key", apiKey);
          uploadFormData.append("timestamp", timestamp);
          uploadFormData.append("folder", folder);
          uploadFormData.append("signature", signature);
        } else if (uploadPreset) {
          uploadFormData.append("upload_preset", uploadPreset);
        }

        const cloudRes = await fetch(cloudinaryUrl, {
          method: "POST",
          body: uploadFormData,
        });

        const cloudData = await cloudRes.json();

        if (cloudRes.ok && cloudData.secure_url) {
          return NextResponse.json({
            success: true,
            url: cloudData.secure_url,
            publicId: cloudData.public_id,
            storage: "cloudinary",
          });
        } else {
          cloudinaryError =
            cloudData.error?.message || `Cloudinary upload failed (${cloudRes.status}).`;
          console.error("Cloudinary upload returned an error:", cloudinaryError);
        }
      } catch (err) {
        cloudinaryError = err instanceof Error ? err.message : "Cloudinary request failed.";
        console.error("Cloudinary upload failed:", err);
      }
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            cloudinaryError ||
            "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and either CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET or a valid unsigned CLOUDINARY_UPLOAD_PRESET.",
        },
        { status: cloudinaryError ? 502 : 503 }
      );
    }

    // 2. Use local storage only during development; serverless filesystems are ephemeral/read-only.
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `kid-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      storage: "local",
      message: "Saved locally. Add Cloudinary credentials in .env.local for automatic cloud hosting.",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image upload." }, { status: 500 });
  }
}
