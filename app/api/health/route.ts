import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const speciesCount = await prisma.species.count();
    const ringCount = await prisma.ring.count();
    const birdCount = await prisma.bird.count();
    return NextResponse.json({
      status: "ok",
      database: "connected",
      counts: { species: speciesCount, rings: ringCount, birds: birdCount },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
