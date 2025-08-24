"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2 } from "lucide-react"
import Image from "next/image"
import React from "react" // Added missing import

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (url: string) => void
  label?: string
}

export function ImageUpload({ currentImage, onImageChange, label = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImage || "")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload to Vercel Blob via our API
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const imageUrl = data.url // This should be a Vercel Blob URL
        
        console.log("Upload successful, got URL:", imageUrl) // Debug log
        
        setPreviewUrl(imageUrl)
        onImageChange(imageUrl)
      } else {
        const errorData = await response.json()
        console.error("Upload failed:", errorData)
        alert("Upload failed: " + (errorData.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed: " + error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl("")
    onImageChange("")
  }

  // Update preview when currentImage prop changes
  React.useEffect(() => {
    setPreviewUrl(currentImage || "")
  }, [currentImage])

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>
      
      {previewUrl && (
        <div className="relative">
          <Image
            src={previewUrl}
            alt="Preview"
            width={200}
            height={150}
            className="rounded-lg object-cover"
            onError={() => setPreviewUrl("")}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
      
      {isUploading && (
        <p className="text-sm text-gray-500">Uploading image...</p>
      )}
    </div>
  )
}