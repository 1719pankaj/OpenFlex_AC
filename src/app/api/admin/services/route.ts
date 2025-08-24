import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const services = await prisma.service.findMany()
    return NextResponse.json(services)
  } catch (error) {
    console.error("Services fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, features, imageUrl } = body

    const service = await prisma.service.create({
      data: { title, description, features, imageUrl }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("Service create error:", error)
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    await prisma.service.deleteMany()
    return NextResponse.json({ message: "All services deleted" })
  } catch (error) {
    console.error("Services delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete services" },
      { status: 500 }
    )
  }
}