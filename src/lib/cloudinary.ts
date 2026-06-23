import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

/* Xoá file trên Cloudinary từ URL */
export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    // Lấy public_id từ URL: https://res.cloudinary.com/cloud/image/upload/v123/folder/file.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!match) return;
    const publicId = match[1];
    // Thử xoá với resource_type image trước, nếu không được thì raw (PDF/DOC)
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch {
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
}
