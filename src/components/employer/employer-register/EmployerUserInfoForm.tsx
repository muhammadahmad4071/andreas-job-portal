"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { z } from "zod"

type Salutation = "Mr." | "Ms." | "Mrs."

interface EmployerUserInfoFormProps {
  onCancel?: () => void
  onSuccess?: (data: {
    salutation: Salutation | ""
    name: string
    phone_number: string
    position: string
  }) => void
}

// ✅ Zod schema mirroring backend rules
const userInfoSchema = z.object({
  salutation: z.enum(["Mr.", "Ms.", "Mrs."], {
    message: "Please select a salutation.",
  }),
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(255, "First name must be at most 255 characters."),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(255, "Last name must be at most 255 characters."),
  phone: z
    .string()
    .min(1, "Phone number is required.")
    .max(50, "Phone number must be at most 50 characters."),
  position: z
    .string()
    .min(1, "Position is required.")
    .max(255, "Position must be at most 255 characters."),
})

export function EmployerUserInfoForm({
  onCancel,
  onSuccess,
}: EmployerUserInfoFormProps) {
  const [salutation, setSalutation] = useState<Salutation | "">("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fieldErrors, setFieldErrors] = useState<{
    salutation?: string
    firstName?: string
    lastName?: string
    phone?: string
    position?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setFieldErrors({})

    // ✅ Frontend validation with zod
    try {
      userInfoSchema.parse({
        salutation,
        firstName,
        lastName,
        phone,
        position,
      })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: {
          salutation?: string
          firstName?: string
          lastName?: string
          phone?: string
          position?: string
        } = {}

        err.errors.forEach((issue) => {
          const field = issue.path[0] as
            | "salutation"
            | "firstName"
            | "lastName"
            | "phone"
            | "position"
            | undefined

          if (field) {
            newErrors[field] = issue.message
          }
        })

        setFieldErrors(newErrors)
        setIsSubmitting(false)
        return // ❌ Do not call API if basic validation fails
      }

      console.error("Unexpected validation error:", err)
      setError(
        "Something went wrong while validating your user information. Please try again."
      )
      setIsSubmitting(false)
      return
    }

    // ✅ Only reach here if zod validation passes
    const payload = {
      salutation,
      name: `${firstName} ${lastName}`.trim(),
      phone_number: phone,
      position,
    }

    try {
      await apiFetch("/validate/2", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (onSuccess) {
        onSuccess(payload)
      }
    } catch (err: any) {
      console.error("Step 2 validation failed:", err)

      // ✅ Clean error extraction from backend
      let message =
        "Something went wrong while validating your user information. Please try again."

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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-10">
        {/* Left side label / helper text */}
        <div className="text-sm text-text-secondary">
          <h2 className="text-xs font-bold tracking-wide text-text-primary mb-2">
           BENUTZERINFORMATIONEN
          </h2>
          <p>Bitte vervollständigen Sie Ihre Benutzerdaten.</p>
          <p>Diese Informationen sind öffentlich nicht sichtbar.</p>
        </div>

        {/* Right side form fields */}
        <div className="space-y-6">
          {/* Salutation */}
          <div>
            <h3 className="font-bold text-text-primary mb-3">Anrede
              <span className="text-red-500">*</span>
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input
                  type="radio"
                  name="salutation"
                  value="Mr."
                  checked={salutation === "Mr."}
                  onChange={() => setSalutation("Mr.")}
                  className="h-4 w-4 rounded-full border border-input text-primary focus:ring-primary"
                />
                Mr.
              </label>

              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input
                  type="radio"
                  name="salutation"
                  value="Ms."
                  checked={salutation === "Ms."}
                  onChange={() => setSalutation("Ms.")}
                  className="h-4 w-4 rounded-full border border-input text-primary focus:ring-primary"
                />
                Ms.
              </label>

              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input
                  type="radio"
                  name="salutation"
                  value="Mrs."
                  checked={salutation === "Mrs."}
                  onChange={() => setSalutation("Mrs.")}
                  className="h-4 w-4 rounded-full border border-input text-primary focus:ring-primary"
                />
                Mrs.
              </label>
            </div>

            <p className="mt-2 text-xs text-text-secondary">
              Wählen Sie Ihre Anrede
            </p>

            {fieldErrors.salutation && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.salutation}
              </p>
            )}
          </div>

          {/* First name */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Vorname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Bitte geben Sie Ihren Vornamen ein."
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-text-secondary">
              Geben Sie Ihren Vornamen ein.
            </p>
            {fieldErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          {/* Last name */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Nachname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Geben Sie Ihren Nachnamen ein."
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-text-secondary">
             Geben Sie Ihren Nachnamen ein.
            </p>
            {fieldErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          {/* Phone number */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Telefonnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Bitte geben Sie Ihre Telefonnummer an."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-text-secondary">
             Ihre Telefonnummer
            </p>
            {fieldErrors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Geben Sie Ihre Position innerhalb der Organisation ein"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-text-secondary">
              Ihre Position in der Organisation.
            </p>
            {fieldErrors.position && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.position}
              </p>
            )}
          </div>

          {/* API / global error */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 bg-background-darker text-white hover:bg-background-darker/90 border-none"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-primary text-text-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Speichern läuft..." : "Weiter"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
