import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany()
    return NextResponse.json(faqs)
  } catch (error) {
    console.error("FAQ API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    )
  }
}
