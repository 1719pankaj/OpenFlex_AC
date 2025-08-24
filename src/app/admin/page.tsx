import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  FileText, 
  Users, 
  HelpCircle, 
  Phone, 
  Image, 
  Settings 
} from "lucide-react"

export default async function AdminDashboard() {
  // Fetch counts for dashboard
  const [heroCount, aboutCount, servicesCount, clientsCount, faqsCount, contactCount] = await Promise.all([
    prisma.hero.count(),
    prisma.about.count(),
    prisma.service.count(),
    prisma.client.count(),
    prisma.faq.count(),
    prisma.contact.count(),
  ])

  const sections = [
    {
      title: "Hero Section",
      description: "Main landing content",
      count: heroCount,
      icon: Image,
      href: "/admin/hero",
      color: "bg-blue-500"
    },
    {
      title: "About Section",
      description: "Company information",
      count: aboutCount,
      icon: FileText,
      href: "/admin/about",
      color: "bg-green-500"
    },
    {
      title: "Services",
      description: "Service offerings",
      count: servicesCount,
      icon: Settings,
      href: "/admin/services",
      color: "bg-purple-500"
    },
    {
      title: "Clients",
      description: "Client logos",
      count: clientsCount,
      icon: Users,
      href: "/admin/clients",
      color: "bg-orange-500"
    },
    {
      title: "FAQ",
      description: "Frequently asked questions",
      count: faqsCount,
      icon: HelpCircle,
      href: "/admin/faq",
      color: "bg-red-500"
    },
    {
      title: "Contact",
      description: "Contact information",
      count: contactCount,
      icon: Phone,
      href: "/admin/contacts",
      color: "bg-indigo-500"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your website content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">{section.count}</span>
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={section.href}>
                    Manage {section.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}