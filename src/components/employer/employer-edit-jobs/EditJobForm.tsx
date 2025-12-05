"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"

import {
  ApplicationProcessCard,
  type ApplicationProcessData,
} from "@/components/employer/employer-add-jobs/ApplicationProcessCard"
import {
  SalaryIndicationCard,
  type SalaryIndicationData,
} from "@/components/employer/employer-add-jobs/SalaryIndicationCard"
import {
  ReleaseDatesCard,
  type ReleaseDatesData,
} from "@/components/employer/employer-add-jobs/ReleaseDatesCard"
import {
  KeywordsCard,
  type KeywordsData,
} from "@/components/employer/employer-add-jobs/KeywordsCard"
import {
  CompanyInformationCard,
  type CompanyInformationData,
} from "@/components/employer/employer-add-jobs/CompanyInformationCard"
import {
  WorkplaceCard,
  type WorkplaceData,
} from "@/components/employer/employer-add-jobs/WorkplaceCard"
import {
  JobAdvertisementInfoCard,
  type JobAdvertisementInfoData,
} from "@/components/employer/employer-add-jobs/JobAdvertisementInfoCard"

import { Button } from "@/components/ui/button"

// --------------------
// Zod schema (same as create)
// --------------------

const jobSchema = z
  .object({
    type: z.enum(["template", "link", "file"]),

    title: z.string().min(1, "Title is required").max(255),
    description: z.string().min(1, "Description is required"),

    video_link: z
      .string()
      .url("Video link must be a valid URL")
      .max(255)
      .optional(),

    workplace_location: z
      .string()
      .min(1, "Workplace location is required")
      .max(255),

    employment_types: z.array(z.string()).optional(),
    required_educational_qualifications: z.array(z.string()).optional(),

    professional_experience: z
      .string()
      .min(1, "Professional experience is required")
      .max(255),

    professional_discipline: z
      .string()
      .min(1, "Discipline is required")
      .max(255),

    required_language_skills: z.array(z.string()).optional(),
    required_skills: z.array(z.string()).optional(),

    release_date: z.string().min(1, "Release date is required"),
    expiration_date: z.string().min(1, "Expiration date is required"),

    min_salary: z
      .number({
        required_error: "Minimum salary is required",
        invalid_type_error: "Minimum salary must be a number",
      })
      .min(0, "Minimum salary must be at least 0")
      .max(99999999.99, "Minimum salary is too large"),

    max_salary: z
      .number({
        required_error: "Maximum salary is required",
        invalid_type_error: "Maximum salary must be a number",
      })
      .min(0, "Maximum salary must be at least 0")
      .max(99999999.99, "Maximum salary is too large"),

    salary_unit: z.enum(["hourly", "daily", "weekly", "monthly", "annually"], {
      invalid_type_error: "Salary unit is required",
    }),

    qualification_questions: z
      .array(
        z.object({
          question: z
            .string()
            .min(1, "Question is required")
            .max(500, "Question is too long"),
          mandatory: z.boolean(),
        }),
      )
      .optional(),

    emails: z.array(z.string().email("Invalid email address")).optional(),

    company_name: z.string().max(255).optional(),
    home_office: z.string().max(255).optional(),
    subject: z.string().max(255).optional(),
  })
  .refine(
    (data) => {
      if (!data.release_date || !data.expiration_date) return true
      return data.expiration_date >= data.release_date
    },
    {
      message: "Expiration date must be after release date",
      path: ["expiration_date"],
    },
  )
  .refine(
    (data) => data.max_salary >= data.min_salary,
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["max_salary"],
    },
  )

type JobPayload = z.infer<typeof jobSchema>

type EditJobFormProps = {
  jobId: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

// --------------------
// Helper: update job (POST + _method: PATCH)
// --------------------

async function updateJob(jobId: string, formData: FormData) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  formData.append("_method", "PATCH")

  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // ignore empty bodies
  }

  if (!res.ok) {
    const message =
      data?.message || data?.error || "Something went wrong while updating the job."
    throw new Error(message)
  }

  return data
}

// --------------------
// Helper: load job using GET /jobs (list) then find by id
// --------------------

async function fetchJob(jobId: string) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await res.json()

  const rawJobs: any[] = Array.isArray(data) ? data : data.data ?? []
  const job = rawJobs.find((j) => String(j.id) === String(jobId))

  console.log("🔥 /jobs LIST EDIT RESPONSE:", { raw: data, pickedJob: job })

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Failed to load jobs list.`
    throw new Error(message)
  }

  if (!job) {
    throw new Error(`Job with id ${jobId} not found in /jobs response.`)
  }

  return job
}

// --------------------
// Component
// --------------------

export function EditJobForm({ jobId }: EditJobFormProps) {
  const router = useRouter()

  // section states
  const [jobAdInfo, setJobAdInfo] = useState<JobAdvertisementInfoData>({
    title: "",
    description: "",
    videoUrl: "",
  })

  const [companyInfo, setCompanyInfo] = useState<CompanyInformationData>({
    enterprise: "",
    logoFile: null,
  })

  const [workplace, setWorkplace] = useState<WorkplaceData>({
    workplace: "",
    homeOffice: "",
  })

  const [keywords, setKeywords] = useState<KeywordsData>({
    employmentType: "",
    education: "",
    experience: "",
    discipline: "",
    subject: "",
    languages: "",
    skills: "",
  })

  const [salaryIndication, setSalaryIndication] =
    useState<SalaryIndicationData>({
      minSalary: "",
      maxSalary: "",
      salaryUnit: "",
    })

  const [releaseDates, setReleaseDates] = useState<ReleaseDatesData>({
    releaseDate: "",
    expirationDate: "",
  })

  const [applicationProcess, setApplicationProcess] =
    useState<ApplicationProcessData>({
      emails: [""],
      questions: [{ text: "", mandatory: false }],
    })

  const [isLoadingJob, setIsLoadingJob] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "idle" | "success" | "error"
    message: string
  }>({ type: "idle", message: "" })
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // --------------------
  // Prefill from API
  // --------------------

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoadingJob(true)
        setLoadError(null)

        const job = await fetchJob(jobId)
        if (cancelled) return

        setJobAdInfo({
          title: job.title ?? "",
          description: job.description ?? "",
          videoUrl: job.video_link ?? "",
        })

        setCompanyInfo({
          enterprise: job.company_name ?? "",
          logoFile: null,
        })

        setWorkplace({
          workplace: job.workplace_location ?? "",
          homeOffice: job.home_office ?? "",
        })

        const employmentType =
          Array.isArray(job.employment_types) && job.employment_types.length > 0
            ? job.employment_types[0]
            : ""

        const education =
          Array.isArray(job.required_educational_qualifications) &&
          job.required_educational_qualifications.length > 0
            ? job.required_educational_qualifications[0]
            : ""

        const languages =
          Array.isArray(job.required_language_skills) &&
          job.required_language_skills.length > 0
            ? job.required_language_skills[0]
            : ""

        const skillsJoined =
          Array.isArray(job.required_skills) && job.required_skills.length > 0
            ? job.required_skills.join(", ")
            : ""

        const salaryUnitMap: Record<string, string> = {
          hourly: "hour",
          monthly: "month",
          annually: "year",
          daily: "hour",
          weekly: "hour",
        }

        setKeywords({
          employmentType,
          education,
          experience: job.professional_experience ?? "",
          discipline: job.professional_discipline ?? "",
          subject: job.subject ?? "",
          languages,
          skills: skillsJoined,
        })

        setSalaryIndication({
          minSalary: job.min_salary ? String(job.min_salary) : "",
          maxSalary: job.max_salary ? String(job.max_salary) : "",
          salaryUnit: salaryUnitMap[job.salary_unit] ?? "",
        })

        setReleaseDates({
          releaseDate: job.release_date
            ? String(job.release_date).slice(0, 10)
            : "",
          expirationDate: job.expiration_date
            ? String(job.expiration_date).slice(0, 10)
            : "",
        })

        const emails =
          Array.isArray(job.emails) && job.emails.length > 0
            ? job.emails
            : [""]

        const questions =
          Array.isArray(job.qualification_questions) &&
          job.qualification_questions.length > 0
            ? job.qualification_questions.map((q: any) => ({
                text: q.question ?? "",
                mandatory: !!q.mandatory,
              }))
            : [{ text: "", mandatory: false }]

        setApplicationProcess({
          emails,
          questions,
        })
      } catch (err: any) {
        if (!cancelled) {
          console.error("Failed to load job for edit:", err)
          setLoadError(err?.message ?? "Failed to load job details.")
        }
      } finally {
        if (!cancelled) setIsLoadingJob(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [jobId])

  // --------------------
  // Submit handler
  // --------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitStatus({ type: "idle", message: "" })
    setValidationErrors([])

    const minSalaryNum = Number(salaryIndication.minSalary)
    const maxSalaryNum = Number(salaryIndication.maxSalary)

    const unitMap: Record<string, JobPayload["salary_unit"]> = {
      hour: "hourly",
      month: "monthly",
      year: "annually",
    }

    const employmentTypes = keywords.employmentType
      ? [keywords.employmentType]
      : []

    const educationArr = keywords.education ? [keywords.education] : []
    const languageArr = keywords.languages ? [keywords.languages] : []

    const skillsArr =
      keywords.skills
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? []

    const questionsMapped =
      applicationProcess.questions
        .filter((q) => q.text.trim().length > 0)
        .map((q) => ({
          question: q.text.trim(),
          mandatory: !!q.mandatory,
        })) || []

    const emailsArr =
      applicationProcess.emails
        .map((e2) => e2.trim())
        .filter(Boolean) || []

    const basePayload: Partial<JobPayload> = {
      type: "template",
      title: jobAdInfo.title.trim(),
      description: jobAdInfo.description.trim(),
      workplace_location: workplace.workplace.trim(),
      professional_experience: keywords.experience || "",
      professional_discipline: keywords.discipline || "",
      release_date: releaseDates.releaseDate,
      expiration_date: releaseDates.expirationDate,
      min_salary: minSalaryNum,
      max_salary: maxSalaryNum,
      salary_unit:
        unitMap[salaryIndication.salaryUnit as keyof typeof unitMap],
      company_name: companyInfo.enterprise.trim() || undefined,
      home_office: workplace.homeOffice || undefined,
      subject: keywords.subject || undefined,
    }

    if (jobAdInfo.videoUrl.trim()) {
      basePayload.video_link = jobAdInfo.videoUrl.trim()
    }
    if (employmentTypes.length) {
      basePayload.employment_types = employmentTypes
    }
    if (educationArr.length) {
      basePayload.required_educational_qualifications = educationArr
    }
    if (languageArr.length) {
      basePayload.required_language_skills = languageArr
    }
    if (skillsArr.length) {
      basePayload.required_skills = skillsArr
    }
    if (questionsMapped.length) {
      basePayload.qualification_questions = questionsMapped
    }
    if (emailsArr.length) {
      basePayload.emails = emailsArr
    }

    const result = jobSchema.safeParse(basePayload)

    if (!result.success) {
      const issues = result.error.issues.map((issue) => {
        const path = issue.path.join(".")
        return path ? `${path}: ${issue.message}` : issue.message
      })
      setValidationErrors(issues)
      setSubmitStatus({
        type: "error",
        message: "Please fix the highlighted validation issues.",
      })
      return
    }

    const validPayload = result.data

    const formData = new FormData()

    formData.append("type", validPayload.type)
    formData.append("title", validPayload.title)
    formData.append("description", validPayload.description)
    formData.append("workplace_location", validPayload.workplace_location)
    formData.append(
      "professional_experience",
      validPayload.professional_experience,
    )
    formData.append(
      "professional_discipline",
      validPayload.professional_discipline,
    )
    formData.append("release_date", validPayload.release_date)
    formData.append("expiration_date", validPayload.expiration_date)
    formData.append("min_salary", String(validPayload.min_salary))
    formData.append("max_salary", String(validPayload.max_salary))
    formData.append("salary_unit", validPayload.salary_unit)

    if (validPayload.video_link) {
      formData.append("video_link", validPayload.video_link)
    }
    if (validPayload.company_name) {
      formData.append("company_name", validPayload.company_name)
    }
    if (validPayload.home_office) {
      formData.append("home_office", validPayload.home_office)
    }
    if (validPayload.subject) {
      formData.append("subject", validPayload.subject)
    }

    validPayload.employment_types?.forEach((val) => {
      formData.append("employment_types[]", val)
    })
    validPayload.required_educational_qualifications?.forEach((val) => {
      formData.append("required_educational_qualifications[]", val)
    })
    validPayload.required_language_skills?.forEach((val) => {
      formData.append("required_language_skills[]", val)
    })
    validPayload.required_skills?.forEach((val) => {
      formData.append("required_skills[]", val)
    })

    validPayload.qualification_questions?.forEach((q, index) => {
      formData.append(`qualification_questions[${index}][question]`, q.question)
      formData.append(
        `qualification_questions[${index}][mandatory]`,
        q.mandatory ? "1" : "0",
      )
    })

    validPayload.emails?.forEach((email) => {
      formData.append("emails[]", email)
    })

    if (companyInfo.logoFile) {
      formData.append("company_logo", companyInfo.logoFile)
    }

    try {
      setIsSubmitting(true)
      await updateJob(jobId, formData)

      setSubmitStatus({
        type: "success",
        message: "Job updated successfully.",
      })

      router.push("/employer/jobs/all-jobs")
    } catch (err: any) {
      setSubmitStatus({
        type: "error",
        message: err?.message ?? "Failed to update job.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingJob) {
    return (
      <main className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading job details…</p>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-muted flex flex-col items-center justify-center gap-3 px-4">
        <p className="text-sm text-red-600 text-center max-w-md">
          {loadError}
        </p>
        <Button variant="outline" asChild>
          <Link href="/employer/jobs/all-jobs">Back to jobs</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted">
      {/* Page Header (same width as create page) */}
      <div className="w-full md:w-[70%] mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          {/* Edit Job Post */}
          Stellenanzeige bearbeiten
        </h1>
        <p className="text-muted-foreground text-lg">
          {/* Update your job advertisement details and save the changes. */}
          Aktualisieren Sie die Details Ihrer Stellenanzeige und speichern Sie die Änderungen.
        </p>
      </div>

      {/* Form (same width as create page) */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[70%] mx-auto px-4 pb-16 space-y-8"
      >
        <JobAdvertisementInfoCard value={jobAdInfo} onChange={setJobAdInfo} />

        <CompanyInformationCard
          value={companyInfo}
          onChange={setCompanyInfo}
        />

        <WorkplaceCard value={workplace} onChange={setWorkplace} />

        <KeywordsCard value={keywords} onChange={setKeywords} />

        <SalaryIndicationCard
          value={salaryIndication}
          onChange={setSalaryIndication}
        />

        <ReleaseDatesCard value={releaseDates} onChange={setReleaseDates} />

        <ApplicationProcessCard
          value={applicationProcess}
          onChange={setApplicationProcess}
        />

        {validationErrors.length > 0 && (
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-md p-4 text-sm space-y-2">
            <p className="font-semibold">Bitte beheben Sie die folgenden Probleme:</p>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {submitStatus.type !== "idle" && (
          <p
            className={
              submitStatus.type === "success"
                ? "text-sm text-emerald-600"
                : "text-sm text-red-600"
            }
          >
            {submitStatus.message}
          </p>
        )}

        <div className="flex justify-end gap-4 pt-6">
          <Button asChild variant="outline" size="lg" disabled={isSubmitting}>
            <Link href="/employer/jobs/all-jobs">Abbrechen</Link>
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-semibold disabled:opacity-70"
          >
            {isSubmitting ? "Speichern läuft…" : "Speichern läuft…"}
          </Button>
        </div>
      </form>
    </main>
  )
}
