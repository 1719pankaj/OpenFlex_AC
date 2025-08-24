"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Loader2 } from "lucide-react"

interface ContactData {
  id?: number
  email: string
  phone: string
}

export default function ContactsManagement() {
  const [contactData, setContactData] = useState<ContactData>({
    email: "",
    phone: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/contacts")
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setContactData(data)
        }
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!contactData.email || !contactData.phone) {
      setMessage({ type: "error", text: "Email and phone are required" })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData)
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Contact information updated successfully!" })
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.error || "Failed to update contact information" })
      }
    } catch (err) {
      console.error('Failed to save contacts:', err)
      setMessage({ type: "error", text: "An error occurred while saving" })
    } finally {
      setIsSaving(false)
    }
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
        <h1 className="text-3xl font-bold">Contact Information Management</h1>
        <p className="text-gray-600">Update your website&apos;s contact details</p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Update the email and phone number displayed on your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={contactData.email}
              onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="info@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={contactData.phone}
              onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <Button
            onClick={handleSave}
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
                Save Contact Information
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
