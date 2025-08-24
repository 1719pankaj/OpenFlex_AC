import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const about = await prisma.about.findFirst()
    
    if (!about) {
      return NextResponse.json(
        { error: "About content not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error("About API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch about content" },
      { status: 500 }
    )
  }
}
