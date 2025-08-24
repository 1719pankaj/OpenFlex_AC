import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error("Clients fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, logoUrl, order } = body

    console.log("Creating client with data:", body) // Debug log

    const client = await prisma.client.create({
      data: { 
        name, 
        logoUrl, 
        order: order || 0 
      }
    })

    console.log("Client created:", client) // Debug log
    return NextResponse.json(client)
  } catch (error) {
    console.error("Client create error:", error)
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    )
  }
}

