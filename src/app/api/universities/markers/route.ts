import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/server/db"; // ✅ Use singleton Prisma instance

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const universityName = searchParams.get("name");

  if (!universityName) {
    return NextResponse.json({ error: "University name is required" }, { status: 400 });
  }

  try {
    // Find university ID
    const university = await prisma.university.findFirst({
      where: { name: universityName },
      select: { id: true },
    });

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    // Get markers related to university trails
    const markers = await prisma.marker.findMany({
      where: { trail: { universityId: university.id } },
      select: { id: true, name: true, description: true, latitude: true, longitude: true },
    });
    console.log("Got markers", markers)

    if (!markers.length) {
      return NextResponse.json({ error: "No markers found for this university" }, { status: 404 });
    }

    return NextResponse.json(markers);
  } catch (error) {
    console.error("Error fetching markers:", error);
    return NextResponse.json({ error: "Failed to fetch markers" }, { status: 500 });
  }
}
