"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface FaqData {
  id: number
  question: string
  answer: string
  order: number
}

export default function FaqManagement() {
  const [faqs, setFaqs] = useState<FaqData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/admin/faq')
      if (response.ok) {
        const data = await response.json()
        setFaqs(data)
      }
    } catch {
      console.error('Failed to fetch FAQs')
    } finally {
      setIsLoading(false)
    }
  }

  const addFAQ = async () => {
    if (!newQuestion || !newAnswer) return

    const newFAQ = { question: newQuestion, answer: newAnswer }

    try {
      const response = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFAQ)
      })

      if (response.ok) {
        setNewQuestion("")
        setNewAnswer("")
        fetchFAQs()
        setMessage({ type: 'success', text: 'FAQ added successfully!' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to add FAQ' })
    }
  }

  const removeFAQ = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/faq?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchFAQs()
        setMessage({ type: 'success', text: 'FAQ removed successfully!' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove FAQ' })
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
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <p className="text-gray-600">Add, edit, and remove frequently asked questions</p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Add New FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Add New FAQ</CardTitle>
          <CardDescription>Add a new frequently asked question</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question</label>
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter the question"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Answer</label>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter the answer"
              rows={3}
            />
          </div>

          <Button
            onClick={addFAQ}
            disabled={!newQuestion || !newAnswer}
            className="w-full"
          >
            {/* isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : ( */}
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </>
            {/* ) */}
          </Button>
        </CardContent>
      </Card>

      {/* Existing FAQs */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFAQ(faq.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-600">{faq.answer}</p>
                <p className="text-sm text-gray-500">Order: {faq.order}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
