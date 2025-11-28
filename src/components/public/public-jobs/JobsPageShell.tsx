"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { JobsSearchFilters } from "./JobsSearchFilters"
// import { JobAlertBanner } from "./JobAlertBanner"
import { JobsList } from "./JobsList"
import { JobDetailPanel } from "./JobDetailPanel"
import { JobsPagination } from "./JobsPagination"
import { useSearchParams } from "next/navigation"   // ⬅️ add this
export type HomeOfficeOption = "Any" | "On-site" | "Hybrid" | "Remote"
export type EmploymentType = "Any" | "Full-time" | "Part-time" | "Apprenticeship"
export type Industry =
  | "Any"
  | "Health service"
  | "Finance"
  | "Retail"
  | "Tourism, hospitality and gastronomy"
export type Discipline = "Any" | "Sales" | "Nursing" | "IT" | "Medicine"
export type WorkExperience = "Any" | "No experience" | "1-3 years" | "3-5 years" | "5+ years"
export type EnterpriseSize = "Any" | "Small" | "Medium" | "Large"

export type Job = {
  id: string
  title: string
  companyName: string
  location: string
  street: string
  city: string
  zip: string
  country: string
  isTopJob?: boolean
  isExpressApplication?: boolean
  homeOfficeOption: HomeOfficeOption
  employmentType: EmploymentType
  industry: Industry
  discipline: Discipline
  workExperience: WorkExperience
  enterpriseSize: EnterpriseSize
  teaser: string
  logoSrc?: string
  headerImageSrc?: string
  publishedAt: string
  salary?: string
  salaryUnit?: string
  subject?: string
  expirationDate?: string
}

// map API job → Job
function mapApiJobToJob(apiJob: any): Job {
  const title: string = apiJob.title ?? "Untitled job"

  const companyName: string =
    apiJob.company_name ??
    apiJob.organization?.title ??
    "Unknown company"

  const city: string = apiJob.workplace_location ?? ""
  const country: string = "Germany"

  const street: string = ""
  const zip: string = ""

  const location =
    city && country ? `${city}, ${country}` : city || "Location not specified"

  const rawHomeOffice = String(apiJob.home_office ?? "").toLowerCase()
  let homeOfficeOption: HomeOfficeOption = "Any"
  if (rawHomeOffice.includes("remote")) {
    homeOfficeOption = "Remote"
  } else if (rawHomeOffice.includes("hybrid")) {
    homeOfficeOption = "Hybrid"
  } else if (
    rawHomeOffice.includes("office") ||
    rawHomeOffice.includes("onsite") ||
    rawHomeOffice.includes("field")
  ) {
    homeOfficeOption = "On-site"
  }

  const rawEmploymentType =
    Array.isArray(apiJob.employment_types) && apiJob.employment_types.length > 0
      ? String(apiJob.employment_types[0]).toLowerCase()
      : ""
  let employmentType: EmploymentType = "Any"
  if (rawEmploymentType.includes("full")) {
    employmentType = "Full-time"
  } else if (rawEmploymentType.includes("part")) {
    employmentType = "Part-time"
  } else if (rawEmploymentType.includes("apprent")) {
    employmentType = "Apprenticeship"
  }

  const rawDiscipline = String(apiJob.professional_discipline ?? "").toLowerCase()
  let discipline: Discipline = "Any"
  if (rawDiscipline.includes("sales")) {
    discipline = "Sales"
  } else if (rawDiscipline.includes("nurse") || rawDiscipline.includes("pflege")) {
    discipline = "Nursing"
  } else if (rawDiscipline.includes("it") || rawDiscipline.includes("software") || rawDiscipline.includes("dev")) {
    discipline = "IT"
  } else if (rawDiscipline.includes("medicin") || rawDiscipline.includes("arzt") || rawDiscipline.includes("doctor")) {
    discipline = "Medicine"
  }

  const industry: Industry = "Any"

  const rawExperience = String(apiJob.professional_experience ?? "").toLowerCase()
  let workExperience: WorkExperience = "Any"
  if (rawExperience.includes("no") || rawExperience.includes("entry")) {
    workExperience = "No experience"
  } else if (rawExperience.includes("1-3") || rawExperience.includes("1 to 3") || rawExperience.includes("1–3")) {
    workExperience = "1-3 years"
  } else if (rawExperience.includes("3-5") || rawExperience.includes("3 to 5") || rawExperience.includes("3–5")) {
    workExperience = "3-5 years"
  } else if (rawExperience.includes("5+") || rawExperience.includes("senior") || rawExperience.includes("5+ years")) {
    workExperience = "5+ years"
  }

  const minSalary = apiJob.min_salary
  const maxSalary = apiJob.max_salary
  const salaryUnitRaw: string = apiJob.salary_unit ?? ""
  const salaryUnit = salaryUnitRaw ? String(salaryUnitRaw).toLowerCase() : ""

  let salaryText: string | undefined
  if (minSalary != null && maxSalary != null) {
    salaryText = `€${minSalary} - €${maxSalary}`
  } else if (minSalary != null) {
    salaryText = `From €${minSalary}`
  } else if (maxSalary != null) {
    salaryText = `Up to €${maxSalary}`
  }

  const teaser: string =
    apiJob.description ??
    "No description provided right now."

  const publishedAt: string =
    apiJob.release_date ??
    apiJob.created_at ??
    new Date().toISOString().slice(0, 10)

  const subject: string | undefined = apiJob.subject ?? undefined
  const expirationDate: string | undefined = apiJob.expiration_date ?? undefined

  const isTopJob: boolean = false
  const isExpressApplication: boolean = false

  const logoSrc: string | undefined = apiJob.company_logo ?? undefined
  const headerImageSrc: string | undefined = undefined

  return {
    id: String(apiJob.id ?? ""),
    title,
    companyName,
    location,
    street,
    city,
    zip,
    country,
    isTopJob,
    isExpressApplication,
    homeOfficeOption,
    employmentType,
    industry,
    discipline,
    workExperience,
    enterpriseSize: "Any",
    teaser,
    logoSrc,
    headerImageSrc,
    publishedAt,
    salary: salaryText,
    salaryUnit,
    subject,
    expirationDate,
  }
}

export function JobsPageShell() {
  // filters
  const [searchTerm, setSearchTerm] = useState("")
  const [locationTerm, setLocationTerm] = useState("")
  const [homeOfficeFilter, setHomeOfficeFilter] = useState<HomeOfficeOption>("Any")
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<EmploymentType>("Any")
  const [industryFilter, setIndustryFilter] = useState<Industry>("Any")
  const [disciplineFilter, setDisciplineFilter] = useState<Discipline>("Any")
  const [workExperienceFilter, setWorkExperienceFilter] = useState<WorkExperience>("Any")
  const [enterpriseSizeFilter, setEnterpriseSizeFilter] = useState<EnterpriseSize>("Any")

  const searchParams = useSearchParams()

  const searchTermParam = searchParams.get("searchTerm") ?? ""
  const locationParam = searchParams.get("location") ?? ""
  const employmentTypeParam =
    (searchParams.get("employmentType") as EmploymentType | null) ?? null

// ✅ Read query params on client (searchTerm + location + employmentType)
  // 🔁 QA fix: keep employmentTypeFilter in sync with ?employmentType= in the URL
  // QA: Fix — keep filters in sync with URL query params (hero search + navbar)
  useEffect(() => {
    setSearchTerm(searchTermParam)
  }, [searchTermParam])

  useEffect(() => {
    setLocationTerm(locationParam)
  }, [locationParam])

  // QA: Fix — employmentTypeFilter follows ?employmentType= (and resets when removed)
  useEffect(() => {
    const allowed: EmploymentType[] = [
      "Any",
      "Full-time",
      "Part-time",
      "Apprenticeship",
    ]

    // No param in URL → reset to "Any"
    if (!employmentTypeParam) {
      setEmploymentTypeFilter("Any")
      return
    }

    // Valid param → use it, otherwise fall back to "Any"
    if (allowed.includes(employmentTypeParam)) {
      setEmploymentTypeFilter(employmentTypeParam)
    } else {
      setEmploymentTypeFilter("Any")
    }
  }, [employmentTypeParam])


  // api state
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchJobs = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await apiFetch(`/jobs/public?page=${currentPage}`)
        console.log("Public jobs API response:", data)

        let apiJobs: any[] = []
        let meta: any = null

        if (Array.isArray(data)) {
          apiJobs = data
        } else if (data && Array.isArray(data.data)) {
          apiJobs = data.data
          meta = data
        }

        const mappedJobs = apiJobs.map(mapApiJobToJob)

        if (!isCancelled) {
          setJobs(mappedJobs)

          if (meta && typeof meta.last_page === "number") {
            setTotalPages(meta.last_page)
          } else {
            setTotalPages(1)
          }
        }
      } catch (err: any) {
        console.error("Failed to load public jobs:", err)
        if (!isCancelled) {
          setError(err?.message || "Failed to load jobs.")
          setJobs([])
          setTotalPages(1)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchJobs()

    return () => {
      isCancelled = true
    }
  }, [currentPage])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesTitle = job.title.toLowerCase().includes(search)
        const matchesCompany = job.companyName.toLowerCase().includes(search)
        if (!matchesTitle && !matchesCompany) return false
      }

      if (locationTerm) {
        const location = locationTerm.toLowerCase()
        const matchesCity = job.city.toLowerCase().includes(location)
        const matchesLocation = job.location.toLowerCase().includes(location)
        if (!matchesCity && !matchesLocation) return false
      }

      if (homeOfficeFilter !== "Any" && job.homeOfficeOption !== homeOfficeFilter) return false
      if (employmentTypeFilter !== "Any" && job.employmentType !== employmentTypeFilter) return false
      if (industryFilter !== "Any" && job.industry !== industryFilter) return false
      if (disciplineFilter !== "Any" && job.discipline !== disciplineFilter) return false
      if (workExperienceFilter !== "Any" && job.workExperience !== workExperienceFilter) return false
      if (enterpriseSizeFilter !== "Any" && job.enterpriseSize !== enterpriseSizeFilter) return false

      return true
    })
  }, [
    jobs,
    searchTerm,
    locationTerm,
    homeOfficeFilter,
    employmentTypeFilter,
    industryFilter,
    disciplineFilter,
    workExperienceFilter,
    enterpriseSizeFilter,
  ])

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJobId(null)
    } else if (!selectedJobId || !filteredJobs.find((job) => job.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id)
    }
  }, [filteredJobs, selectedJobId])

  const selectedJob = filteredJobs.find((job) => job.id === selectedJobId) || null

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => {
      if (prev >= totalPages) return prev
      return prev + 1
    })
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => {
      if (prev <= 1) return prev
      return prev - 1
    })
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-muted py-8">
      <section className="container-custom max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {filteredJobs.length.toLocaleString()} Jobs
          </h1>
          <p className="text-sm text-muted-foreground">
            Find your next opportunity in the Oberland region.
          </p>
        </div>

        <JobsSearchFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          locationTerm={locationTerm}
          onLocationTermChange={setLocationTerm}
          homeOfficeFilter={homeOfficeFilter}
          onHomeOfficeFilterChange={setHomeOfficeFilter}
          employmentTypeFilter={employmentTypeFilter}
          onEmploymentTypeFilterChange={setEmploymentTypeFilter}
          industryFilter={industryFilter}
          onIndustryFilterChange={setIndustryFilter}
          disciplineFilter={disciplineFilter}
          onDisciplineFilterChange={setDisciplineFilter}
          workExperienceFilter={workExperienceFilter}
          onWorkExperienceFilterChange={setWorkExperienceFilter}
          enterpriseSizeFilter={enterpriseSizeFilter}
          onEnterpriseSizeFilterChange={setEnterpriseSizeFilter}
          onSubmitSearch={handleSubmitSearch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-6">
          <div className="space-y-4">
            {/* <JobAlertBanner /> */}

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {isLoading && !error && (
              <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
                Loading jobs…
              </div>
            )}

            <JobsList
              jobs={filteredJobs}
              selectedJobId={selectedJobId}
              onSelectJob={setSelectedJobId}
            />

            <JobsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={handleNextPage}
              onPrev={handlePrevPage}
            />
          </div>

          <JobDetailPanel job={selectedJob} />
        </div>
      </section>
    </main>
  )
}
