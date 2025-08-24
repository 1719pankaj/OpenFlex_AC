import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const contacts = await prisma.contact.findFirst()
    
    if (!contacts) {
      return NextResponse.json(
        { error: "Contact information not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Contacts API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact information" },
      { status: 500 }
    )
  }
}
