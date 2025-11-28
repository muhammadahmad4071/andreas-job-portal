"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
import { Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await apiFetch("/logout", { method: "POST" })
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("token")
        } catch {}

        document.cookie = "admin_token=; Max-Age=0; Path=/"
        document.cookie = "employer_token=; Max-Age=0; Path=/"
      }

      router.push("/employer/login")
      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Round yellow icon container */}
        <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-gray-300 shadow-sm hover:opacity-90">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 bg-white border border-border shadow-lg rounded-md"
      >
        <DropdownMenuLabel className="text-text-primary">
          My Account
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/admin/settings" className="w-full">
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive cursor-pointer"
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
