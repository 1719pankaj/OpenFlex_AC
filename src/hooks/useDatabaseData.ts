"use client"

import { useState, useEffect } from "react"

interface HeroData {
  id: number
  title: string
  subtitle: string
  imageUrl: string
}

interface AboutData {
  id: number
  title: string
  description: string
  imageUrl: string
}

interface ServiceData {
  id: number
  title: string
  description: string
  features: string
  imageUrl: string
}

interface ClientData {
  id: number
  name: string
  logoUrl: string
  order: number
}

interface FAQData {
  id: number
  question: string
  answer: string
}

interface ContactData {
  id: number
  email: string
  phone: string
}

interface DatabaseData {
  hero: HeroData | null
  about: AboutData | null
  services: ServiceData[]
  clients: ClientData[]
  faqs: FAQData[]
  contacts: ContactData | null
  isLoading: boolean
  error: string | null
}

export function useDatabaseData(): DatabaseData {
  const [data, setData] = useState<DatabaseData>({
    hero: null,
    about: null,
    services: [],
    clients: [],
    faqs: [],
    contacts: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, servicesRes, clientsRes, faqsRes, contactsRes] = await Promise.all([
          fetch('/api/content/hero'),
          fetch('/api/content/about'),
          fetch('/api/content/services'),
          fetch('/api/content/clients'),
          fetch('/api/content/faq'),
          fetch('/api/content/contacts')
        ])

        const [hero, about, services, clients, faqs, contacts] = await Promise.all([
          heroRes.json(),
          aboutRes.json(),
          servicesRes.json(),
          clientsRes.json(),
          faqsRes.json(),
          contactsRes.json()
        ])

        setData({
          hero: hero.error ? null : hero,
          about: about.error ? null : about,
          services: services.error ? [] : services,
          clients: clients.error ? [] : clients,
          faqs: faqs.error ? [] : faqs,
          contacts: contacts.error ? null : contacts,
          isLoading: false,
          error: null
        })
      } catch {
        setData({
          hero: null,
          about: null,
          services: [],
          clients: [],
          faqs: [],
          contacts: null,
          isLoading: false,
          error: "Failed to fetch data from database"
        })
      }
    }

    fetchData()
  }, [])

  return data
}
