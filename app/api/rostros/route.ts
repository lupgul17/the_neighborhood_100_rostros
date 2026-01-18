import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary.server";

export async function GET() {
  try {
    const basePath = "neighborhood/rostros";

    const result = await cloudinary.api.sub_folders(basePath);

    // Devuelve [{ name, path }]
    const people = (result.folders ?? []).map((f: any) => ({
      id: f.name,      // "001"
      path: f.path,    // "neighborhood/people/001"
    }));

    return NextResponse.json({ basePath, people });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to list people folders", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}