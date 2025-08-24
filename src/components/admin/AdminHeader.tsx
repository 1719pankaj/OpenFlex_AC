"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

export default function AdminHeader() {
  const handleSignOut = () => {
    // Simple redirect to main page
    window.location.href = "/"
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OpenFlex Admin</h1>
          <p className="text-sm text-gray-600">Content Management System</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">Administrator</p>
              <p className="text-gray-500">Admin User</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Exit Admin
          </Button>
        </div>
      </div>
    </header>
  )
}


