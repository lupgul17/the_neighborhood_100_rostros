import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary.server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ personaId: string }> }
) {
  try {
    const { personaId } = await ctx.params;

    // Folder real en Cloudinary (según tu endpoint 1)
    const folder = `neighborhood/rostros/${personaId}`;

    // Search API: esto sí filtra por folder de contención
    const result = await cloudinary.search
      .expression(`resource_type:image AND folder="${folder}"`)
      .sort_by("public_id", "asc")
      .max_results(100)
      .execute();
    console.log("Cloudinary search result:", result);
    console.log()
    const photos = (result.resources ?? []).map((r: any) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
    }));
    console.log(`Found ${photos.length} photos for personaId=${personaId}`);
    console.log("photo:", photos);

    return NextResponse.json({
      personaId,
      folder,
      count: photos.length,
      photos,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to list photos by folder", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}