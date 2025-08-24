
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const contact = await prisma.contact.findFirst()
    return NextResponse.json(contact)
  } catch {
    // Remove unused 'err' variable
    return NextResponse.json(
      { error: "Failed to fetch contact data" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone } = body

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email and phone are required" },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.upsert({
      where: { id: 1 },
      update: { email, phone },
      create: { id: 1, email, phone }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Contact update error:", error)
    return NextResponse.json(
      { error: "Failed to update contact data" },
      { status: 500 }
    )
  }
}
