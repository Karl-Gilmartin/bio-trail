import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      select: { id: true, name: true, latitude: true, longitude: true },
    });
    return NextResponse.json(universities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newUniversity = await prisma.university.create({
      data: {
        name: body.name,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });
    return NextResponse.json(newUniversity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create university" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedUniversity = await prisma.university.update({
      where: { id: body.id },
      data: { name: body.name, latitude: body.latitude, longitude: body.longitude },
    });
    return NextResponse.json(updatedUniversity);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update university" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing university ID" }, { status: 400 });

    await prisma.university.delete({ where: { id } });
    return NextResponse.json({ message: "University deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete university" }, { status: 500 });
  }
}
