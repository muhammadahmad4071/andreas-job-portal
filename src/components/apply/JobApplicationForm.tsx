"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { UploadCloud } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type JobSummary = {
  id: string
  title: string
  company: string
}

type JobApplicationFormProps = {
  job: JobSummary
}

// Local helper to read token (copied from api.ts logic)
function getAuthToken(): string | null {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(/(?:^|; )token=([^;]*)/)
  const cookieToken = match ? decodeURIComponent(match[1]) : null

  const lsToken =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null

  return cookieToken || lsToken
}

export function JobApplicationForm({ job }: JobApplicationFormProps) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!acceptedTerms || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formEl = e.currentTarget
    const formData = new FormData(formEl)

    // Ensure a CV file is present and named as backend expects
    if (!formData.get("cv_file")) {
      setError("Please upload your CV (PDF, DOC, DOCX).")
      setIsSubmitting(false)
      return
    }

    try {
      const headers: HeadersInit = {
        Accept: "application/json",
      }

      const token = getAuthToken()
      if (token) {
        ;(headers as any).Authorization = `Bearer ${token}`
      }

      const response = await fetch(
        `${API_BASE_URL}/jobs/${job.id}/applications`,
        {
          method: "POST",
          headers,
          body: formData, // multipart/form-data; browser sets boundary
        }
      )

      if (!response.ok) {
        let message = "Could not submit application."
        try {
          const data = await response.json()
          if (data && typeof data.message === "string") {
            message = data.message
          }
        } catch {
          // ignore JSON parse error
        }
        setError(message)
        setIsSubmitting(false)
        return
      }

      setSuccess("Application submitted successfully! Redirecting to job listings...")
      setIsSubmitting(false)

      // Redirect after 5 seconds
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/public/jobs"
        } else {
          router.push("/public/jobs")
        }
      }, 5000)
    } catch (err) {
      console.error("Application submit error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted py-10">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Application for: {job.title}
        </h1>

        <Card className="rounded-2xl shadow-lg border bg-white p-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {/* Full name */}
            <div className="space-y-1">
              <Label htmlFor="name">
                Full name <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" required />
            </div>

            {/* E-mail address */}
            <div className="space-y-1">
              <Label htmlFor="email">
                E-mail address <span className="text-red-500">*</span>
              </Label>
              <Input id="email" name="email" type="email" required />
            </div>

            {/* Phone number */}
            <div className="space-y-1">
              <Label htmlFor="phone_number">Phone number</Label>
              <Input id="phone_number" name="phone_number" type="tel" />
            </div>

            {/* Applicant's cover letter */}
            <div className="space-y-1">
              <Label htmlFor="cover_letter">
                Applicant&apos;s cover letter{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cover_letter"
                name="cover_letter"
                required
                className="min-h-[180px]"
                defaultValue={`Sehr geehrte Damen und Herren,
Hiermit bewerbe ich mich für den auf Oberland-JOBS.de ausgeschriebenen Job ${job.title}.
Meine Kontaktinformationen finden Sie weiter unten.
Ich freue mich auf Ihre Antwort.
Mit freundlichen Grüßen`}
              />
            </div>

            {/* Upload CV */}
            <div className="mt-8 space-y-3">
              <h2 className="text-lg font-semibold">Upload CV</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg py-10 px-4 flex flex-col items-center justify-center gap-4 text-center">
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag &amp; drop your CV here or click the button to upload.
                  Accepted formats: PDF, DOC, DOCX (max 5MB).
                </p>

                <div>
                  <input
                    id="cv_file"
                    name="cv_file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      document.getElementById("cv_file")?.click()
                    }
                    className="px-8"
                  >
                    Upload
                  </Button>
                </div>

                {selectedFile && (
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>{selectedFile.name}</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="mt-6 flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(value) => setAcceptedTerms(Boolean(value))}
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                Terms{" "}
                <a href="#" className="text-[#FDB714] hover:underline">
                  of use
                </a>{" "}
                apply. Information on data protection can be found{" "}
                <a href="#" className="text-[#FDB714] hover:underline">
                  here
                </a>
                . <span className="text-red-500">*</span>
              </Label>
            </div>

            {/* Error / success messages */}
            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-emerald-600">
                {success}
              </div>
            )}

            {/* Apply button */}
            <div className="mt-6">
              <Button
                type="submit"
                className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-primary-foreground px-8"
                disabled={!acceptedTerms || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Apply"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
