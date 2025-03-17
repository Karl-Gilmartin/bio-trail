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
    const university = await prisma.university.findUnique({
      where: { name: universityName },
      select: { latitude: true, longitude: true },
    });

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json(university);
  } catch (error) {
    console.error("Error fetching university center:", error);
    return NextResponse.json({ error: "Failed to fetch university center" }, { status: 500 });
  }
}
