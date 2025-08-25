import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, logoUrl, order } = body

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: { name, logoUrl, order }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error("Client update error:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.client.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json({ message: "Client deleted" })
  } catch (error) {
    console.error("Client delete error:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}