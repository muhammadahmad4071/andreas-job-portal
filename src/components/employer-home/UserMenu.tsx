"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
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
      // 🔥 Automatically sends Authorization: Bearer <token> (if present)
      await apiFetch("/logout", {
        method: "POST",
      })
    } catch (err) {
      console.error("Logout error:", err)
      // Continue anyway – we still want to clear tokens client-side
    } finally {
      if (typeof window !== "undefined") {
        // ❌ Remove token from localStorage
        try {
          localStorage.removeItem("token")
        } catch {
          // ignore
        }

        // ❌ Remove token cookie used by middleware & apiFetch
        // Overwrite with empty value and Max-Age=0
        document.cookie = "token=; Max-Age=0; Path=/"
      }

      // 🔁 Redirect user to login page
      router.push("/employer/login")

      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-primary text-white font-semibold flex items-center justify-center hover:bg-primary-dark">
          {/* You can put initials here later if you want */}
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

        <DropdownMenuItem onClick={() => router.push("/employer/settings")}>
          <Link href="/employer/settings">
            Settings
          </Link>
        </DropdownMenuItem>

        {/* LOGOUT BUTTON */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive cursor-pointer"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
