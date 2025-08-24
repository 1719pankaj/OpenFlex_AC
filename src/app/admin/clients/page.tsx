"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Save, Loader2, Plus, Trash2 } from "lucide-react"

interface ClientData {
  id?: number
  name: string
  logoUrl: string
  order: number
}

export default function ClientsManagement() {
  const [clients, setClients] = useState<ClientData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [newClientName, setNewClientName] = useState("")
  const [newClientLogo, setNewClientLogo] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClientChange = (id: number, field: keyof ClientData, value: string | number) => {
    const newClients = clients.map(client =>
      client.id === id ? { ...client, [field]: value } : client
    )
    setClients(newClients)
  }

  const handleImageChange = (id: number, imageUrl: string) => {
    console.log(`Updating client ${id} image to:`, imageUrl) // Debug log
    const newClients = clients.map(client =>
      client.id === id ? { ...client, logoUrl: imageUrl } : client
    )
    setClients(newClients)
  }

  const addClient = async () => {
    if (!newClientName || !newClientLogo) return

    const newClient: ClientData = {
      name: newClientName,
      logoUrl: newClientLogo,
      order: clients.length
    }

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      })

      if (response.ok) {
        setNewClientName("")
        setNewClientLogo("")
        fetchClients() // Refresh the list
        setMessage({ type: 'success', text: 'Client added successfully!' })
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: `Failed to add client: ${errorData.error}` })
      }
    } catch (error) {
      console.error('Add client error:', error)
      setMessage({ type: 'error', text: 'Failed to add client' })
    }
  }

  const removeClient = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/clients/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchClients() // Refresh the list
        setMessage({ type: 'success', text: 'Client removed successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to remove client' })
      }
    } catch (error) {
      console.error('Remove client error:', error)
      setMessage({ type: 'error', text: 'Failed to remove client' })
    }
  }

  const saveClients = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // Save all existing clients
      const promises = clients.map(client =>
        fetch(`/api/admin/clients/${client.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(client)
        })
      )

      const results = await Promise.all(promises)
      const allSuccessful = results.every(response => response.ok)

      if (allSuccessful) {
        setMessage({ type: 'success', text: 'All clients saved successfully!' })
        fetchClients() // Refresh to get updated data
      } else {
        setMessage({ type: 'error', text: 'Some clients failed to save' })
      }
    } catch (error) {
      console.error('Save clients error:', error)
      setMessage({ type: 'error', text: 'Failed to save clients' })
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
      <h1 className="text-3xl font-bold">Clients Management</h1>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
          <CardDescription>Add a new client to the list</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Client Name</label>
            <Input
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Enter client name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Logo</label>
            <ImageUpload
              currentImage={newClientLogo}
              onImageChange={setNewClientLogo}
              label="Upload Client Logo"
            />
          </div>
          
          <Button onClick={addClient} disabled={!newClientName || !newClientLogo}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    value={client.name}
                    onChange={(e) => handleClientChange(client.id!, 'name', e.target.value)}
                    placeholder="Client name"
                  />
                </div>
                
                <div className="w-32">
                  <ImageUpload
                    currentImage={client.logoUrl}
                    onImageChange={(imageUrl) => handleImageChange(client.id!, imageUrl)}
                    label="Client Logo"
                  />
                </div>
                
                <Button
                  onClick={() => removeClient(client.id!)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={saveClients} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}