"use client"

import { useState } from "react"
import { Eye, EyeOff, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { z } from "zod"

interface EmployerCredentialsFormProps {
  onSuccess?: (data: { username: string; email: string; password: string }) => void
}

// ✅ Zod schema for frontend validation
const credentialsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "The password field must be at least 6 characters."),
})

export function EmployerCredentialsForm({ onSuccess }: EmployerCredentialsFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreed, setAgreed] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // field-specific error messages from zod
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string
    email?: string
    password?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setFieldErrors({})

    // ✅ Terms & conditions check
    if (!agreed) {
      setError("Please check the box.")
      return
    }

    // ✅ Frontend validation with zod
    try {
      credentialsSchema.parse({ username, email, password })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: { username?: string; email?: string; password?: string } = {}

        err.errors.forEach((issue) => {
          const field = issue.path[0] as "username" | "email" | "password" | undefined
          if (field) {
            newErrors[field] = issue.message
          }
        })

        setFieldErrors(newErrors)
        return // ❌ Don't call API if basic validation fails
      }

      console.error("Unexpected validation error:", err)
      setError("Something went wrong while validating your data. Please try again.")
      return
    }

    // ✅ Only reach here if zod validation passed
    setIsSubmitting(true)

    try {
      await apiFetch("/validate/1", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      // 204 = success, move to next step
      if (onSuccess) {
        onSuccess({
          username,
          email,
          password,
        })
      }
    } catch (err: any) {
      console.error(err)

      // ✅ Clean error extraction from API
      let message =
        "Something went wrong while validating your data. Please try again."

      if (err?.body?.message && typeof err.body.message === "string") {
        message = err.body.message
      } else if (typeof err?.message === "string") {
        try {
          const parsed = JSON.parse(err.message)
          if (parsed?.message && typeof parsed.message === "string") {
            message = parsed.message
          } else {
            message = err.message
          }
        } catch {
          message = err.message
        }
      }

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Intro copy for step 1 */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
          JETZT KOSTENLOSES ARBEITGERSPROFIL ERSTELLEN
        </h1>
        <p className="text-text-secondary text-base">
          {/* Register your free account and get started right away! */}
          Registrieren Sie Ihr kostenloses Konto und legen Sie sofort los!
        </p>
        <p className="text-text-secondary text-base">
          Zur Vervollständigung der Registrierung erhalten Sie eine Bestätigungs-E-Mail.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* USERNAME */}
        <div>
          <input
            type="text"
            placeholder="Geben Sie Ihren Benutzernamen ein"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          {fieldErrors.username && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            placeholder="Geben Sie Ihre E-Mail-Adresse ein"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        {/* PASSWORD */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Geben Sie Ihr Passwort ein"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
          )}
        </div>


        {/* TERMS */}
        <div className="flex items-start gap-3 pt-2">
          <input
            id="terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 border border-input rounded-sm text-primary focus:ring-primary"
          />
          <label
            htmlFor="terms"
            className="text-sm text-text-primary leading-relaxed"
          >
           Indem Sie dieses Kästchen markieren, bestätigen Sie die Verantwortung für die Richtigkeit der im Namen der Organisation übermittelten Informationen.
            <span className="text-red-500">*</span>
          </label>
        </div>

        {/* GLOBAL ERROR (API / terms) */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-text-primary font-semibold py-3 rounded-md flex items-center justify-center gap-2"
        >
          <Building2 className="w-5 h-5" />
          {isSubmitting ? "Registrierung läuft..." : "Kostenlos registrieren"}
        </Button>

        {/* LOGIN LINK */}
        <div className="text-center pt-2">
          <span className="text-text-secondary">Haben Sie bereits ein Konto? </span>
          <Link
            href="/employer/login"
            className="text-primary font-semibold hover:underline"
          >
            Announce
          </Link>
        </div>
      </form>
    </>
  )
}
