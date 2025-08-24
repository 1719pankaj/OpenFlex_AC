import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const about = await prisma.about.findFirst()
    return NextResponse.json(about)
  } catch {
    // Remove unused 'err' variable
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl } = body

    let about = await prisma.about.findFirst()
    
    if (about) {
      // Update existing
      about = await prisma.about.update({
        where: { id: about.id },
        data: { title, description, imageUrl }
      })
    } else {
      // Create new
      about = await prisma.about.create({
        data: { title, description, imageUrl }
      })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error("About update error:", error)
    return NextResponse.json(
      { error: "Failed to update about data" },
      { status: 500 }
    )
  }
}