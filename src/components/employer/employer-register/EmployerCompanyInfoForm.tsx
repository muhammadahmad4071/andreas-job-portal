"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { z } from "zod"

export interface CompanyInfo {
  title: string
  address: string
  postal_code: string
  area: string
  country: string
  size: string
}

interface EmployerCompanyInfoFormProps {
  initialData?: Partial<CompanyInfo>
  onBack?: () => void
  onSuccess?: (data: CompanyInfo) => void
}

// ✅ Zod schema aligned with backend rules
const companySchema = z.object({
  title: z.string().min(1, "Der Name der Organisation ist erforderlich."),
  address: z.string().min(1, "Die Adresse ist erforderlich."),
  postal_code: z.string().min(1, "Die Postleitzahl ist erforderlich."),
  area: z.string().min(1, "Der Bereich ist erforderlich."),
  country: z.string().min(1, "Das Land ist erforderlich."),
  size: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        ["1-10", "11-100", "101-1000", "1001-10000", "10000+"].includes(val),
      {
        message:
          "Ungültige Unternehmensgröße. Bitte wählen Sie eine der angegebenen Optionen.",
      }
    ),
})

export function EmployerCompanyInfoForm({
  initialData,
  onBack,
  onSuccess,
}: EmployerCompanyInfoFormProps) {
  const [organizationTitle, setOrganizationTitle] = useState(
    initialData?.title ?? ""
  )
  const [streetAndNumber, setStreetAndNumber] = useState(
    initialData?.address ?? ""
  )
  const [postalCode, setPostalCode] = useState(
    initialData?.postal_code ?? ""
  )
  const [location, setLocation] = useState(initialData?.area ?? "")
  const [country, setCountry] = useState(initialData?.country ?? "Deutschland")
  const [companySize, setCompanySize] = useState(initialData?.size ?? "")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    address?: string
    postal_code?: string
    area?: string
    country?: string
    size?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const payload: CompanyInfo = {
      title: organizationTitle,
      address: streetAndNumber,
      postal_code: postalCode,
      area: location,
      country,
      size: companySize,
    }

    // ✅ Frontend validation using zod
    try {
      companySchema.parse(payload)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: {
          title?: string
          address?: string
          postal_code?: string
          area?: string
          country?: string
          size?: string
        } = {}

        err.errors.forEach((issue) => {
          const field = issue.path[0] as
            | "title"
            | "address"
            | "postal_code"
            | "area"
            | "country"
            | "size"
            | undefined
          if (field) newErrors[field] = issue.message
        })

        setFieldErrors(newErrors)
        return
      }

      console.error("Unexpected validation error:", err)
      setError("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.")
      return
    }

    // ✅ Only call backend if schema passed
    setIsSubmitting(true)

    try {
      await apiFetch("/validate/3", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (onSuccess) onSuccess(payload)
    } catch (err: any) {
      console.error("Step 3 validation failed:", err)

      let message =
        "Beim Überprüfen Ihrer Unternehmensinformationen ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."

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
        {/* Left side text */}
        <div className="text-sm text-text-secondary">
          <h2 className="text-xs font-bold tracking-wide text-text-primary mb-2">
            UNTERNEHMENSINFORMATIONEN
          </h2>
          <p>Bitte vervollständigen Sie die Angaben zu Ihrem Unternehmen.</p>
          <p>Diese Informationen werden für Ihr Arbeitgeberprofil verwendet.</p>
        </div>

        {/* Right side fields */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Name der Organisation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter the name of the organization."
              value={organizationTitle}
              onChange={(e) => setOrganizationTitle(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white"
            />
            {fieldErrors.title && (
              <p className="text-sm text-red-600">{fieldErrors.title}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Straße und Hausnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Straße und Hausnummer"
              value={streetAndNumber}
              onChange={(e) => setStreetAndNumber(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white"
            />
            {fieldErrors.address && (
              <p className="text-sm text-red-600">{fieldErrors.address}</p>
            )}
          </div>

          {/* Postal code */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Postleitzahl <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Geben Sie die Postleitzahl ein."
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white"
            />
            {fieldErrors.postal_code && (
              <p className="text-sm text-red-600">{fieldErrors.postal_code}</p>
            )}
          </div>

          {/* Area */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Ortsteil <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Geben Sie den Ortsteil ein"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white"
            />
            {fieldErrors.area && (
              <p className="text-sm text-red-600">{fieldErrors.area}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Land <span className="text-red-500">*</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white"
            >
              <option value="Deutschland">Deutschland</option>
            </select>
            {fieldErrors.country && (
              <p className="text-sm text-red-600">{fieldErrors.country}</p>
            )}
          </div>

          {/* Company size */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-text-primary">
              Unternehmensgröße
            </label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-white"
            >
              <option value="">-- Bitte auswählen --</option>
              <option value="1-10">1–10 Mitarbeiter</option>
              <option value="11-100">11–100 Mitarbeiter</option>
              <option value="101-1000">101–1000 Mitarbeiter</option>
              <option value="1001-10000">1001–10000 Mitarbeiter</option>
              <option value="10000+">10000+ Mitarbeiter</option>
            </select>
            {fieldErrors.size && (
              <p className="text-sm text-red-600">{fieldErrors.size}</p>
            )}
          </div>

          {/* Global error */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-6 bg-background-darker text-white border-none"
            >
              Zurück
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-primary text-text-primary hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Speichern läuft..." : "Speichern"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
