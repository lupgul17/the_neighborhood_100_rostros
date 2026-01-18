const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function cld(publicId: string, w = 1200) {
  if (!cloudName) throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${w}/${publicId}`;
}