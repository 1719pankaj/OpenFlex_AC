


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  Settings, 
  Users, 
  HelpCircle, 
  Phone,
  LogOut
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Hero", href: "/admin/hero", icon: Image },
  { name: "About", href: "/admin/about", icon: FileText },
  { name: "Services", href: "/admin/services", icon: Settings },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { name: "Contact", href: "/admin/contacts", icon: Phone },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleSignOut = () => {
    // Simple redirect to main page
    window.location.href = "/"
  }

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
      </div>
      
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-red-100 text-red-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-4" />
          Exit Admin
        </button>
      </div>
    </div>
  )
}