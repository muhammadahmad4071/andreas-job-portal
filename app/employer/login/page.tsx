"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff, LogIn, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  login: z.string().min(1, "Bitte geben Sie Ihre E-Mail-Adresse oder Ihren Benutzernamen ein."),
  password: z.string().min(1, "Bitte geben Sie Ihr Passwort ein."),
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function EmployerLoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  const [fieldErrors, setFieldErrors] = useState<{
    login?: string
    password?: string
  }>({})

  // Read ?redirectTo=... from URL on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const value = params.get("redirectTo")
      if (value) setRedirectTo(value)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setFieldErrors({})

    const payload = {
      login: emailOrUsername,
      password,
    }

    // ✅ Frontend validation with zod
    try {
      loginSchema.parse(payload)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: { login?: string; password?: string } = {}

        err.errors.forEach((issue) => {
          const field = issue.path[0] as "login" | "password" | undefined
          if (field) {
            newErrors[field] = issue.message
          }
        })

        setFieldErrors(newErrors)
        return // do not hit API
      }

      console.error("Unexpected validation error:", err)
      setError("Beim Überprüfen Ihrer Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.")
      return
    }

    // ✅ Only hit API if validation passed
    setIsSubmitting(true)

    try {
      if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.")
      }

      // ⛔️ NOT using apiFetch here – use raw fetch so 401 doesn't auto-redirect
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      let data: any = null
      try {
        data = await res.json()
      } catch {
        // ignore parse errors
      }

      if (!res.ok) {
        const messageFromApi =
          (data && typeof data.message === "string" && data.message) ||
          (res.status === 401
            ? "Invalid credentials. Please try again."
            : "Something went wrong. Please try again.")

        throw new Error(messageFromApi)
      }

      // 🔎 Determine primary role from res.user.role_names[0]
      const roleNames: string[] = Array.isArray(data?.user?.role_names)
        ? data.user.role_names
        : []

      const primaryRole = roleNames[0] || "employer" // fallback

      // Save JWT token (if backend returns it)
      if (data?.token) {
        try {
          localStorage.setItem("token", data.token)
        } catch {
          // ignore localStorage errors (SSR / disabled)
        }

        // 🔐 IMPORTANT: set role-specific cookie so middleware can differentiate
        const maxAgeSeconds = 60 * 60 * 2
        const cookieName =
          primaryRole === "admin" ? "admin_token" : "employer_token"

        if (typeof document !== "undefined") {
          if (primaryRole === "admin") {
            document.cookie = "employer_token=; Max-Age=0; Path=/"
          } else {
            document.cookie = "admin_token=; Max-Age=0; Path=/"
          }

          document.cookie = `${cookieName}=${encodeURIComponent(
            data.token,
          )}; Max-Age=${maxAgeSeconds}; Path=/`
        }
      }

      // 🎯 Decide default home based on role
      let defaultHome = "/employer/home"
      if (primaryRole === "admin") {
        defaultHome = "/admin/home"
      }

      setSuccess("Anmeldung erfolgreich! Weiterleitung...")
      setError(null)

      // Respect ?redirectTo=... from middleware, fallback to role-based home
      const target = redirectTo || defaultHome
      router.push(target)
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err?.message || "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.")
      setSuccess(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Column */}
        <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Logo */}
            <div className="mb-12">
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="Oberland JOBS Logo"
                  className="h-12 cursor-pointer"
                />
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">
                Anmelden
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Login (email or username) */}
              <div>
                <input
                  type="text"
                  placeholder="E-Mail-Adresse oder Benutzername"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {fieldErrors.login && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.login}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>


              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-600 text-center">
                  {error}
                </p>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-text-primary font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                {isSubmitting ? "Anmeldung läuft..." : "Anmelden"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 space-y-4 text-center">
              <p className="text-sm text-text-secondary">
                Noch kein Konto?{" "}
                <Link
                  href="/employer/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Jetzt registrieren und ein kostenloses Arbeitgeberprofil erstellen!
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column Image */}
        <div
          className="hidden lg:block bg-cover bg-center relative"
          style={{ backgroundImage: "url(/login-image.jpg)" }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>
    </div>
  )
}
