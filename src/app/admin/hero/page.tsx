"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Save, Loader2 } from "lucide-react"

interface HeroData {
  id?: number
  title: string
  subtitle: string
  imageUrl: string
}

export default function HeroManagement() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: "",
    subtitle: "",
    imageUrl: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  useEffect(() => {
    fetchHeroData()
  }, [])

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/hero')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setHeroData(data)
        }
      }
    } catch (err) { // Changed from 'error' to 'err'
      console.error('Failed to fetch hero data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveHeroData = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Hero section updated successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update hero section' })
      }
    } catch (err) { // Changed from 'error' to 'err'
      console.error('Failed to save hero data:', err)
      setMessage({ type: 'error', text: 'Failed to save hero data' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageChange = (imageUrl: string) => {
    setHeroData(prev => ({ ...prev, imageUrl }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hero Section Management</h1>
        <p className="text-gray-600">Update the main landing content of your website</p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
          <CardDescription>
            Edit the title, subtitle, and background image for your hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Hero Title
            </label>
            <Input
              id="title"
              value={heroData.title}
              onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Expert Financial & Legal Guidance for Everyone"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subtitle" className="text-sm font-medium">
              Hero Subtitle
            </label>
            <Textarea
              id="subtitle"
              value={heroData.subtitle}
              onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Enter the subtitle text that appears below the main title"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Background Image
            </label>
            <ImageUpload
              currentImage={heroData.imageUrl}
              onImageChange={handleImageChange}
            />
          </div>

          <Button
            onClick={saveHeroData}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}