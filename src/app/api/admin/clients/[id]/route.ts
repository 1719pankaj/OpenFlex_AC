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

    console.log(`Updating client ${id} with:`, body) // Debug log

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: { name, logoUrl, order }
    })

    console.log("Client updated:", client) // Debug log
    return NextResponse.json(client)
  } catch (error) {
    console.error("Client update error:", error)
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`Deleting client ${id}`) // Debug log

    await prisma.client.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: "Client deleted" })
  } catch (error) {
    console.error("Client delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    )
  }
}
