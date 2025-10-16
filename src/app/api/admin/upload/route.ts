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

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      )
    }

    // Check if Vercel Blob token is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN environment variable not found")
      return NextResponse.json(
        { error: "Storage configuration error" },
        { status: 500 }
      )
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const uniqueFilename = `${timestamp}_${randomSuffix}.${fileExtension}`

    console.log("Uploading file:", {
      originalName: file.name,
      size: file.size,
      type: file.type,
      uniqueName: uniqueFilename
    })

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      handleUploadUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/admin/upload`,
    })

    console.log("Upload successful:", {
      url: blob.url,
      pathname: blob.pathname
    })

    return NextResponse.json({
      url: blob.url,
      success: true,
      filename: uniqueFilename
    })
  } catch (error) {
    console.error("Upload error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // Provide more specific error messages
    if (error.message?.includes('token')) {
      return NextResponse.json(
        { error: "Storage authentication failed" },
        { status: 500 }
      )
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return NextResponse.json(
        { error: "Network error during upload" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}