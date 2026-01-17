const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!cloudName) {
  throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local");
}

export function cldUrl(
  publicId: string,
  opts?: { w?: number; q?: string }
) {
  const w = opts?.w ?? 1200;
  const q = opts?.q ?? "auto";

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${q},w_${w}/${publicId}`;
}