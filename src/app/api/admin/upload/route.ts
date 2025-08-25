// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { put } from '@vercel/blob'
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      console.log("No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", file.name, file.size, file.type)
    
    // Use Vercel Blob in production, local filesystem in development
    if (process.env.NODE_ENV === 'production') {
      // Production: Upload to Vercel Blob
      const blob = await put(file.name, file, {
        access: 'public',
        token: process.env.READ_WRITE_TOKEN, // Use the correct env var name
      })
      console.log("Upload successful to Blob, URL:", blob.url)
      return NextResponse.json({ url: blob.url })
    } else {
      // Development: Local file storage
      const uploadsDir = join(process.cwd(), "public", "uploads")
      await mkdir(uploadsDir, { recursive: true })

      const timestamp = Date.now()
      const filename = `${timestamp}-${file.name}`
      const filepath = join(uploadsDir, filename)

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      const url = `/uploads/${filename}`
      console.log("Upload successful locally, URL:", url)
      return NextResponse.json({ url })
    }
    
  } catch (error) {
    console.error("Upload error details:", error)
    return NextResponse.json({ 
      error: "Failed to upload file",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}