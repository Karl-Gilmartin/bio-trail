import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trailId = searchParams.get("trailId");

  if (!trailId) {
    return NextResponse.json({ error: "Trail ID is required" }, { status: 400 });
  }

  try {
    const markers = await prisma.marker.findMany({
      where: { trailId: Number(trailId) },
    });

    if (!markers.length) {
      return NextResponse.json({ error: "No markers found for this trail" }, { status: 404 });
    }

    return NextResponse.json(markers);
  } catch (error) {
    console.error("Error fetching markers:", error);
    return NextResponse.json({ error: "Failed to fetch markers" }, { status: 500 });
  }
}
