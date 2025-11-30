"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MeResponse = {
  name?: string
  organization?: {
    title?: string
    logo?: string
  }
}

export function UserMenu() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState<string>("ME")

  // 🔁 Load /me to get organization logo + initials
  useEffect(() => {
    let cancelled = false

    async function loadMe() {
      try {
        const data = (await apiFetch("/me")) as MeResponse

        if (cancelled) return

        const orgLogo = data?.organization?.logo
        const orgTitle = data?.organization?.title
        const name = orgTitle || data?.name || ""

        if (orgLogo) {
          setAvatarUrl(orgLogo)
        }

        if (name) {
          const parts = name.trim().split(/\s+/)
          const letters = parts
            .map((p) => p[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase()

          if (letters) {
            setInitials(letters)
          }
        }
      } catch (err) {
        // If /me fails (not logged in, etc.) just keep defaults
        console.error("Failed to load /me for user menu:", err)
      }
    }

    loadMe()
    return () => {
      cancelled = true
    }
  }, [])

  // const handleLogout = async () => {
  //   setIsLoggingOut(true)

  //   try {
  //     // 🔥 Automatically sends Authorization: Bearer <token>
  //     await apiFetch("/logout", {
  //       method: "POST",
  //     })
  //   } catch (err) {
  //     console.error("Logout error:", err)
  //     // Continue anyway
  //   } finally {
  //     // ❌ Remove token no matter what
  //     if (typeof window !== "undefined") {
  //       localStorage.removeItem("token")
  //     }

  //     router.push("/employer/login")
  //   }
  // }

const handleLogout = async () => {
  if (isLoggingOut) return
  setIsLoggingOut(true)

  // Helper to read employer_token from cookies
  const getEmployerTokenFromCookies = () => {
    if (typeof document === "undefined") return null
    const match = document.cookie.match(/(?:^|; )employer_token=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : null
  }

  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

    // Prefer cookie token, fall back to localStorage
    const cookieToken = getEmployerTokenFromCookies()
    const lsToken =
      typeof window !== "undefined"
        ? localStorage.getItem("employer_token") ||
          localStorage.getItem("token") // legacy fallback if you still have it
        : null

    const token = cookieToken || lsToken

    await fetch(`${base}/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include", // send cookies along just in case backend uses them
    })
  } catch (err) {
    console.error("Logout error:", err)
    // ignore, we still clear auth & redirect
  } finally {
    // Clear employer auth on client
    if (typeof document !== "undefined") {
      document.cookie = "employer_token=; Max-Age=0; Path=/"
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("employer_token")
      localStorage.removeItem("token") // if you used this before
    }

    router.replace("/employer/login")
  }
}



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Yellow circle with company logo from /me.organization.logo */}
        <button
          className="w-10 h-10 rounded-full bg-primary text-white font-semibold flex items-center justify-center hover:bg-primary/90 overflow-hidden border-2 border-white shadow-sm"
          aria-label="Open user menu"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Organization logo"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            initials
          )}
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

        <DropdownMenuItem asChild>
          <Link href="/employer/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive"
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
