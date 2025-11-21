"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { AllJobsFilters } from "@/components/all-jobs/AllJobsFilters"
import { JobList } from "@/components/all-jobs/JobList"
import type { EmployerJob } from "@/components/all-jobs/types"
import { Plus } from "lucide-react"
import Link from "next/link"

// ---- Mock data & fake API layer ----

const BASE_JOB: Omit<EmployerJob, "id" | "searchIndex" | "title" | "location"> = {
  companyName: "Example Clinic GmbH",
  status: "Draft",  // now allowed 🎉
  source: "Any Source",
  employmentType: "Any type of employment",
  applicationWorkflow: "Any application workflow",
  frontendType: "Any frontend",
  description:
    "This is a sample job ad used for the employer overview...",
  statisticsSummary: "Statistics: not specified",
  createdAt: "2025-01-01",
  updatedAt: "2025-01-10",
}

const MOCK_JOBS: EmployerJob[] = Array.from({ length: 6 }).map((_, index) => {
  const title = index % 2 === 0 ? "fff" : "Medical Assistant (m/f/d)"
  const location =
    "ffffff, Kasselgrund 1, 63599 Biebergemünd, Germany"

  return {
    ...BASE_JOB,
    id: `JOB-${index + 1}`,
    title,
    location,
    status: index === 0 ? "Draft" : index % 2 === 0 ? "Active" : "Expired",
    searchIndex: `${title} ${location} ${BASE_JOB.companyName}`.toLowerCase(),
  }
})

async function getEmployerJobs(): Promise<EmployerJob[]> {
  // In production this will call the backend, e.g. fetch("/api/employer/jobs")
  // The UI is already prepared to plug into that data source.
  return Promise.resolve(MOCK_JOBS)
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
    // Keeping it so the "Apply" button already has a place to plug into.
  }

  return (
    <section className="w-full h-full">
      <div className="container-custom py-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Manage Job Ads
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
            <Link href="/employerjobs/add-job">
              <Plus className="w-4 h-4 mr-2" />
              Add a job ad
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}