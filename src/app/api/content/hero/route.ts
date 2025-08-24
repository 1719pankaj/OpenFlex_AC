import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const hero = await prisma.hero.findFirst()
    
    if (!hero) {
      return NextResponse.json(
        { error: "Hero content not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(hero)
  } catch (error) {
    console.error("Hero API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 }
    )
  }
}
