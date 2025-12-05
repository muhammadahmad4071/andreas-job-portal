"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { AllJobsFilters } from "@/components/employer/all-jobs/AllJobsFilters"
import { JobList } from "@/components/public/all-jobs/JobList"
import type { EmployerJob } from "@/components/employer/all-jobs/types"
import { Plus } from "lucide-react"
import Link from "next/link"

// ---- Real API integration layer ----

// Adjust to match your deployed backend base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function mapApiJobToEmployerJob(apiJob: any): EmployerJob {
  const title: string = apiJob.title ?? "Untitled job"

  const location: string =
    apiJob.workplace_location ??      // 👈 use backend workplace_location first
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


async function getEmployerJobs(): Promise<EmployerJob[]> {
  try {
    if (!API_BASE_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not set. Add it to your .env and Vercel project."
      )
    }

    // adjust key if you store the token under a different name
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (!token) {
      throw new Error(
        "No auth token found in localStorage. Make sure you store it after login."
      )
    }

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
        // ignore parse errors
      }
      throw new Error(message)
    }

    const data = await res.json()

    // DEBUG LOG — this prints the raw API response exactly as it comes
    console.log("🔥 RAW /jobs API RESPONSE:", data);

    // If your API returns { data: [...] } instead of a bare array,
    // this will handle both cases.
    const rawJobs: any[] = Array.isArray(data) ? data : data.data ?? []

    return rawJobs.map(mapApiJobToEmployerJob)
  } catch (error) {
    console.error("Failed to fetch employer jobs:", error)
    // fail gracefully – just show no jobs instead of crashing the page
    return []
  }
}

// ---- Page Shell ----

export function AllJobsPageShell() {
  const [jobs, setJobs] = useState<EmployerJob[]>([])

  // filters
  const [filterText, setFilterText] = useState("")
  const [filterJobId, setFilterJobId] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const [filterSource, setFilterSource] = useState("All Jobs")
  const [filterEmploymentType, setFilterEmploymentType] = useState(
    "Any type of employment",
  )
  const [filterApplicationWorkflow, setFilterApplicationWorkflow] = useState(
    "Any application workflow",
  )
  const [filterFrontend, setFilterFrontend] = useState("Any frontend")

  useEffect(() => {
    getEmployerJobs().then(setJobs)
  }, [])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = filterText.trim().toLowerCase()
      const idText = filterJobId.trim().toLowerCase()
      const locText = filterLocation.trim().toLowerCase()

      if (text && !job.searchIndex.includes(text)) return false
      if (idText && !job.id.toLowerCase().includes(idText)) return false
      if (locText && !job.location.toLowerCase().includes(locText)) return false

      if (filterSource === "All Jobs") {
        // no-op, we treat All Jobs as no filter
      } else if (filterSource === "Draft jobs" && job.status !== "Draft") {
        return false
      } else if (filterSource === "Active jobs" && job.status !== "Active") {
        return false
      } else if (filterSource === "Expired jobs" && job.status !== "Expired") {
        return false
      }

      if (
        filterEmploymentType !== "Any type of employment" &&
        job.employmentType !== filterEmploymentType
      ) {
        return false
      }

      if (
        filterApplicationWorkflow !== "Any application workflow" &&
        job.applicationWorkflow !== filterApplicationWorkflow
      ) {
        return false
      }

      if (
        filterFrontend !== "Any frontend" &&
        job.frontendType !== filterFrontend
      ) {
        return false
      }

      return true
    })
  }, [
    jobs,
    filterText,
    filterJobId,
    filterLocation,
    filterSource,
    filterEmploymentType,
    filterApplicationWorkflow,
    filterFrontend,
  ])

  function handleClearAll() {
    setFilterText("")
    setFilterJobId("")
    setFilterLocation("")
    setFilterSource("All Jobs")
    setFilterEmploymentType("Any type of employment")
    setFilterApplicationWorkflow("Any application workflow")
    setFilterFrontend("Any frontend")
  }

  function handleApplyFilters() {
    // Filters are live; this is left as a hook for future behavior (e.g. server query).
  }

  return (
    <section className="w-full h-full">
      <div className="container-custom py-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {/* Manage Job Ads */}
          Stellenanzeigen verwalten 
        </h1>

        <AllJobsFilters
          filterText={filterText}
          onFilterTextChange={setFilterText}
          filterJobId={filterJobId}
          onFilterJobIdChange={setFilterJobId}
          filterLocation={filterLocation}
          onFilterLocationChange={setFilterLocation}
          filterSource={filterSource}
          onFilterSourceChange={setFilterSource}
          filterEmploymentType={filterEmploymentType}
          onFilterEmploymentTypeChange={setFilterEmploymentType}
          filterApplicationWorkflow={filterApplicationWorkflow}
          onFilterApplicationWorkflowChange={setFilterApplicationWorkflow}
          filterFrontend={filterFrontend}
          onFilterFrontendChange={setFilterFrontend}
          onClearAll={handleClearAll}
          onApplyFilters={handleApplyFilters}
        />

        <JobList jobs={filteredJobs} />

        <div className="mt-6">
          <Button
            asChild
            size="lg"
            className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-white px-8"
          >
            <Link href="/employer/jobs/add-job">
              <Plus className="w-4 h-4 mr-2" />
              Stellenanzeige hinzufügen
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
