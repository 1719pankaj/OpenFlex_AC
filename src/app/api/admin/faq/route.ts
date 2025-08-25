import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { id: 'asc' }
    })
    return NextResponse.json(faqs)
  } catch (error) {
    console.error("FAQs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer } = body

    const faq = await prisma.faq.create({
      data: { question, answer }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error("FAQ create error:", error)
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 })

    const body = await request.json()
    const { question, answer } = body

    const faq = await prisma.faq.update({
      where: { id: parseInt(id) },
      data: { question, answer }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error("FAQ update error:", error)
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 })

    await prisma.faq.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: "FAQ deleted" })
  } catch (error) {
    console.error("FAQ delete error:", error)
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
  }
}