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
      include: { trails: true },
    });

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    return NextResponse.json(university.trails);
  } catch (error) {
    console.error("Error fetching trails:", error);
    return NextResponse.json({ error: "Failed to fetch trails" }, { status: 500 });
  }
}
