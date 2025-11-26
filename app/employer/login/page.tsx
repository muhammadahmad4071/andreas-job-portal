"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff, LogIn, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  login: z.string().min(1, "Please enter your e-mail address or username."),
  password: z.string().min(1, "Please enter your password."),
})

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
      setError("Something went wrong while validating your data. Please try again.")
      return
    }

    // ✅ Only hit API if validation passed
    setIsSubmitting(true)

    try {
      // apiFetch should return parsed JSON or throw on non-2xx
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      // Save JWT token (if backend returns it)
      if (res?.token) {
        // Optional: keep using localStorage if the rest of your app expects it
        try {
          localStorage.setItem("token", res.token)
        } catch {
          // ignore localStorage errors (SSR / disabled)
        }

        // 🔐 IMPORTANT: also set a cookie so middleware.ts can see it
        // 2 hours = 7200 seconds
        const maxAgeSeconds = 60 * 60 * 2
        document.cookie = `token=${encodeURIComponent(
          res.token,
        )}; Max-Age=${maxAgeSeconds}; Path=/`
      }

      setSuccess("Login successful! Redirecting...")
      setError(null)

      // Respect ?redirectTo=... from middleware, fallback to /employer/home
      const target = redirectTo || "/employer/home"
      router.push(target)
    } catch (err: any) {
      console.error("Login failed:", err)

      let message = "Something went wrong. Please try again."

      // 1) If apiFetch attached a parsed body
      if (err?.body?.message && typeof err.body.message === "string") {
        message = err.body.message
      }
      // 2) If status is available
      else if (err?.status === 401) {
        message = "Invalid credentials. Please try again."
      } else if (err?.status === 403) {
        message = "Your account is inactive. Please contact support."
      }
      // 3) Try to parse Error.message as JSON: {"message":"Invalid credentials"}
      else if (typeof err?.message === "string") {
        try {
          const parsed = JSON.parse(err.message)
          if (parsed?.message && typeof parsed.message === "string") {
            message = parsed.message
          } else {
            message = err.message
          }
        } catch {
          // err.message is just a string, use it as-is
          message = err.message
        }
      }

      setError(message)
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
                Announce
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Login (email or username) */}
              <div>
                <input
                  type="text"
                  placeholder="E-mail address or Username"
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

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
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 space-y-4 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account yet?{" "}
                <Link
                  href="/employer/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Register now and create a free employer profile!
                </Link>
              </p>

              <p className="text-sm text-text-secondary">
                Forgot your password?{" "}
                <a href="#" className="text-primary font-semibold hover:underline">
                  Reset your password.
                </a>
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
