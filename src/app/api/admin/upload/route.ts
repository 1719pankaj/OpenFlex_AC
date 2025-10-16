// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const uniqueFilename = `${timestamp}_${randomSuffix}.${fileExtension}`

    console.log("Uploading file:", file.name, "Size:", file.size, "Unique name:", uniqueFilename)

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
    })

    console.log("Upload successful, blob URL:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}