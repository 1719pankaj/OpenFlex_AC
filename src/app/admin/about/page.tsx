"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Save, Loader2 } from "lucide-react"

interface AboutData {
  id?: number
  title: string
  description: string
  imageUrl: string
}

export default function AboutManagement() {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: "",
    description: "",
    imageUrl: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/admin/about')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setAboutData(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof AboutData, value: string) => {
    setAboutData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (imageUrl: string) => {
    setAboutData(prev => ({ ...prev, imageUrl }))
  }

  const saveAboutData = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'About section updated successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update about section' })
      }
    } catch (error) {
      console.error('Failed to save about data:', error)
      setMessage({ type: 'error', text: 'Failed to save about data' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About Section Management</h1>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About Content</CardTitle>
          <CardDescription>Update the about section content and image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={aboutData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="About section title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={aboutData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="About section description"
              rows={4}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Background Image</label>
            <ImageUpload
              currentImage={aboutData.imageUrl}
              onImageChange={handleImageChange}
              label="Upload Background Image"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveAboutData} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}