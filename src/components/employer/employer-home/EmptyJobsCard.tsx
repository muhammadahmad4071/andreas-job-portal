"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Info } from "lucide-react"
import type { EmployerJob } from "@/components/employer/all-jobs/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function mapApiJobToEmployerJob(apiJob: any): EmployerJob {
  const title: string = apiJob.title ?? "Untitled job"

  const location: string =
    apiJob.workplace_location ??
    apiJob.location ??
    apiJob.address ??
    "Location not specified"

  const companyName: string = apiJob.company_name ?? "Unknown company"

  return {
    // required fields
    id: String(apiJob.id ?? ""),
    title,
    location,
    companyName,

    // status / meta (fallbacks keep filters working)
    status: apiJob.status ?? "Draft",
    source: apiJob.source ?? "Any Source",
    employmentType: apiJob.employment_types?.[0] ?? "Any type of employment",
    applicationWorkflow:
      apiJob.application_workflow ?? "Any application workflow",
    frontendType: apiJob.frontend_type ?? "Any frontend",

    description:
      apiJob.description ??
      "No description has been provided for this job ad yet.",
    statisticsSummary:
      apiJob.statistics_summary ?? "Statistics: not available yet",

    createdAt: apiJob.created_at ?? "",
    updatedAt: apiJob.updated_at ?? "",

    // used for free-text search
    searchIndex: `${title} ${location} ${companyName}`
      .toLowerCase()
      .trim(),
  }
}

async function fetchEmployerJobs(): Promise<EmployerJob[]> {
  if (!API_BASE_URL) {
    console.error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to your .env and Vercel project."
    )
    return []
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  if (!token) {
    console.warn(
      "[EmptyJobsCard] No auth token found in localStorage. User might not be logged in."
    )
    return []
  }

  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`
      try {
        const body = (await res.json()) as { message?: string }
        if (body?.message) message = body.message
      } catch {
        // ignore parse error
      }
      throw new Error(message)
    }

    const data = await res.json()

    // If your API returns { data: [...] } (pagination), handle both forms
    const rawJobs: any[] = Array.isArray(data) ? data : data.data ?? []

    return rawJobs.map(mapApiJobToEmployerJob)
  } catch (error) {
    console.error("[EmptyJobsCard] Failed to fetch employer jobs:", error)
    return []
  }
}

export function EmptyJobsCard() {
  const [jobs, setJobs] = useState<EmployerJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      setLoading(true)
      const fetched = await fetchEmployerJobs()
      if (isMounted) {
        setJobs(fetched)
        setLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  const hasJobs = jobs.length > 0

  // 🔹 CASE 1: still loading → keep simple skeleton-y version of empty state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative w-32 h-32">
            <svg
              className="w-full h-full text-muted-foreground/30 animate-pulse"
              viewBox="0 0 100 100"
              fill="none"
            >
              <rect
                x="20"
                y="30"
                width="60"
                height="50"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="30"
                y="40"
                width="40"
                height="4"
                fill="currentColor"
                opacity="0.5"
              />
              <rect
                x="30"
                y="50"
                width="30"
                height="4"
                fill="currentColor"
                opacity="0.5"
              />
              <rect
                x="30"
                y="60"
                width="35"
                height="4"
                fill="currentColor"
                opacity="0.5"
              />
              <circle
                cx="75"
                cy="25"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="75"
                y1="17"
                x2="75"
                y2="33"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="67"
                y1="25"
                x2="83"
                y2="25"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>

          <p className="text-muted-foreground max-w-md">
            Loading your job advertisements…
          </p>

          <Link href="/employer/jobs/add-job">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              {/* Add a job ad */}
              Eine Stellenanzeige hinzufügen
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 🔹 CASE 2: no jobs → original empty state
  if (!hasJobs) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Illustration placeholder */}
          <div className="relative w-32 h-32">
            <svg
              className="w-full h-full text-muted-foreground/30"
              viewBox="0 0 100 100"
              fill="none"
            >
              <rect
                x="20"
                y="30"
                width="60"
                height="50"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="30"
                y="40"
                width="40"
                height="4"
                fill="currentColor"
                opacity="0.5"
              />
              <rect
                x="30"
                y="50"
                width="30"
                height="4"
                fill="currentColor"
                opacity="0.5"
              />
              <rect
                x="30"
                y="60"
                width="35"
                height="4"
                fill="currentColor"
                opacity="0.5"
              />
              <circle
                cx="75"
                cy="25"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="75"
                y1="17"
                x2="75"
                y2="33"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="67"
                y1="25"
                x2="83"
                y2="25"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute bottom-0 right-0 w-12 h-16 text-muted-foreground/30">
              <svg viewBox="0 0 40 60" fill="currentColor">
                <ellipse cx="20" cy="15" rx="12" ry="15" />
                <rect x="8" y="25" width="24" height="35" rx="2" />
              </svg>
            </div>
          </div>

          <p className="text-muted-foreground max-w-md">
            Sie haben momentan keine Stellenanzeigen veröffentlicht. Sobald Sie eine neue Stellenanzeige erstellen, 
            wird sie hier angezeigt.
          </p>

          <Link href="/employer/jobs/add-job">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Eine Stellenanzeige hinzufügen
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 🔹 CASE 3: jobs exist → show a compact list + keep the Add job button
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Ihre Stellenanzeigen
            </p>
            <p className="text-xs text-muted-foreground">
              Sie haben derzeit {jobs.length} Stellenanzeigen
              {jobs.length === 1 ? "" : "s"} veröffentlicht.
            </p>
          </div>

          <Link href="/employer/jobs/add-job">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add a job ad
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-muted">
          {jobs.map((job) => (
            <div key={job.id} className="py-4 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-[#FDB714]">
                    {job.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {job.companyName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-gray-800 uppercase tracking-wide">
                  <Info className="w-3 h-3" />
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
