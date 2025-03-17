import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const universityName = searchParams.get("name");

  if (!universityName) {
    return NextResponse.json({ error: "University name is required" }, { status: 400 });
  }

  try {
    const routes = await prisma.route.findMany({
      where: { university: { name: universityName } },
      select: { geojson: true },
    });

    if (!routes.length) {
      return NextResponse.json({ error: "No routes found for this university" }, { status: 404 });
    }

    return NextResponse.json(routes);
  } catch (error) {
    console.error("Error fetching university routes:", error);
    return NextResponse.json({ error: "Failed to fetch university routes" }, { status: 500 });
  }
}
