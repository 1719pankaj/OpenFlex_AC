import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const hero = await prisma.hero.findFirst()
    return NextResponse.json(hero)
  } catch {
    // Remove unused 'err' variable
    return NextResponse.json(
      { error: "Failed to fetch hero data" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, imageUrl } = body

    let hero = await prisma.hero.findFirst()
    
    if (hero) {
      // Update existing
      hero = await prisma.hero.update({
        where: { id: hero.id },
        data: { title, subtitle, imageUrl }
      })
    } else {
      // Create new
      hero = await prisma.hero.create({
        data: { title, subtitle, imageUrl }
      })
    }

    return NextResponse.json(hero)
  } catch (error) {
    console.error("Hero update error:", error)
    return NextResponse.json(
      { error: "Failed to update hero data" },
      { status: 500 }
    )
  }
}