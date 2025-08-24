"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Save, Loader2, Plus, Trash2 } from "lucide-react"

interface ServiceData {
  id?: number
  title: string
  description: string
  features: string
  imageUrl: string
}

export default function ServicesManagement() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.length > 0 ? data : [
          { title: '', description: '', features: '', imageUrl: '' },
          { title: '', description: '', features: '', imageUrl: '' },
          { title: '', description: '', features: '', imageUrl: '' }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleServiceChange = (index: number, field: keyof ServiceData, value: string) => {
    const newServices = [...services]
    newServices[index] = { ...newServices[index], [field]: value }
    setServices(newServices)
  }

  const handleImageChange = (index: number, imageUrl: string) => {
    const newServices = [...services]
    newServices[index] = { ...newServices[index], imageUrl }
    setServices(newServices)
  }

  const addService = () => {
    setServices([...services, { title: '', description: '', features: '', imageUrl: '' }])
  }

  const removeService = (index: number) => {
    if (services.length > 1) {
      const newServices = services.filter((_, i) => i !== index)
      setServices(newServices)
    }
  }

  const saveServices = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // Delete all existing services first
      await fetch('/api/admin/services', { method: 'DELETE' })
      
      // Create new services
      const promises = services.map(service => 
        fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(service)
        })
      )
      
      await Promise.all(promises)
      
      setMessage({ type: 'success', text: 'Services saved successfully!' })
      fetchServices() // Refresh the list
    } catch (error) {
      console.error('Failed to save services:', error)
      setMessage({ type: 'error', text: 'Failed to save services' })
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Button onClick={addService} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Service {index + 1}</CardTitle>
                {services.length > 1 && (
                  <Button
                    onClick={() => removeService(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={service.title}
                  onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                  placeholder="Service title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  placeholder="Service description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Features</label>
                <Textarea
                  value={service.features}
                  onChange={(e) => handleServiceChange(index, 'features', e.target.value)}
                  placeholder="Service features (comma separated)"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Image</label>
                <ImageUpload
                  currentImage={service.imageUrl}
                  onImageChange={(imageUrl) => handleImageChange(index, imageUrl)}
                  label="Service Image"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={saveServices} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Services
            </>
          )}
        </Button>
      </div>
    </div>
  )
}