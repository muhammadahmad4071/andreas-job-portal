"use client"

import { useEffect, useState, useMemo } from "react"
import { EmployerCard } from "./EmployerCard"
import { EmployersFilters } from "./EmployersFilters"
import { EmployersPagination } from "./EmployersPagination"
import { apiFetch } from "@/lib/api"

// Type definition for Employer
export type Employer = {
  id: number
  name: string
  street: string
  postalCode: string
  city: string
  country: string
  industry: string
  employeeRange: string
  openPositions: number
  isHighlighted?: boolean
  imageUrl?: string | null
  logoUrl?: string | null
  discipline?: string
  subject?: string
  location?: string
  searchIndex: string
}

// Filter options for dropdowns
export const DISCIPLINE_OPTIONS = ["Healthcare", "Engineering", "IT", "Other"]
export const INDUSTRY_OPTIONS = ["Retail and wholesale", "Other industry", "Crafts/trade"]
export const SUBJECT_OPTIONS = ["Dermatology", "Podiatry", "Cosmetics"]

// Map backend employer object -> UI Employer type
function mapApiEmployerToEmployer(apiEmployer: any): Employer {
  const org = apiEmployer.organization || {}

  const name = org.title || apiEmployer.name || "Unknown employer"
  const street = org.address || ""
  const postalCode = org.postal_code || ""
  const city = org.area || ""
  const country = org.country || ""
  const employeeRange = org.size || "Not specified"
  const logo = org.logo || null

  // Build a lowercased search index for free-text filtering
  const searchIndex = [
    name,
    street,
    postalCode,
    city,
    country,
    employeeRange,
    apiEmployer.username,
    apiEmployer.email,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return {
    id: apiEmployer.id,
    name,
    street,
    postalCode,
    city,
    country,
    industry: "Not specified", // backend doesn't send industry in this endpoint
    employeeRange,
    openPositions: 0, // list API response doesn't include jobs_count/active_jobs_count
    isHighlighted: false,
    imageUrl: logo, // use logo as top banner image if present
    logoUrl: logo,
    discipline: "", // not in backend, kept for future use
    subject: "", // not in backend, kept for future use
    location: city || country,
    searchIndex,
  }
}

// Real API call
async function fetchEmployersFromApi(page: number): Promise<Employer[]> {
  const response = await apiFetch(`/employers?page=${page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })

  console.log("📦 Employers list API response:", response)

  const data = Array.isArray(response.data) ? response.data : []
  return data.map(mapApiEmployerToEmployer)
}

export function EmployersListPageShell() {
  // State for employers data
  const [employers, setEmployers] = useState<Employer[]>([])

  // Filter state
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [discipline, setDiscipline] = useState("")
  const [industry, setIndustry] = useState("")
  const [subject, setSubject] = useState("")

  // Pagination state (client-side)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 12 // 4 rows * 3 columns

  // Load employers on mount (first backend page)
  useEffect(() => {
    async function load() {
      const data = await fetchEmployersFromApi(1)
      setEmployers(data)
      setCurrentPage(1) // Reset to first page when data loads
    }

    load()
  }, [])

  // Filter employers based on all filter criteria
  const filteredEmployers = useMemo(() => {
    return employers.filter((employer) => {
      // Free-text search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim()
        if (!employer.searchIndex.includes(searchLower)) {
          return false
        }
      }

      // Location filter
      if (location) {
        const locationLower = location.toLowerCase().trim()
        const locationMatch =
          employer.city.toLowerCase().includes(locationLower) ||
          employer.postalCode.toLowerCase().includes(locationLower) ||
          employer.country.toLowerCase().includes(locationLower) ||
          (employer.location && employer.location.toLowerCase().includes(locationLower))
        if (!locationMatch) {
          return false
        }
      }

      // Discipline filter
      if (discipline && employer.discipline !== discipline) {
        return false
      }

      // Industry filter
      if (industry && employer.industry !== industry) {
        return false
      }

      // Subject filter
      if (subject && employer.subject !== subject) {
        return false
      }

      return true
    })
  }, [employers, searchTerm, location, discipline, industry, subject])

  // Pagination calculations (client-side)
  const totalEmployers = filteredEmployers.length
  const totalPages = Math.max(1, Math.ceil(totalEmployers / PAGE_SIZE))

  // Clamp current page to valid range when total pages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  // Get employers for current page
  const pageStartIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedEmployers = filteredEmployers.slice(pageStartIndex, pageStartIndex + PAGE_SIZE)

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("")
    setLocation("")
    setDiscipline("")
    setIndustry("")
    setSubject("")
    setCurrentPage(1)
  }

  // Search button handler - resets to page 1 for better UX
  const handleSearch = () => {
    setCurrentPage(1)
  }

  // Pagination handlers (client-side only; backend currently returns single page)
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <section className="container-custom py-8 md:py-10">
      {/* Page title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Enterprise</h1>

      {/* Filters section */}
      <EmployersFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        location={location}
        onLocationChange={setLocation}
        discipline={discipline}
        onDisciplineChange={setDiscipline}
        industry={industry}
        onIndustryChange={setIndustry}
        subject={subject}
        onSubjectChange={setSubject}
        onReset={handleResetFilters}
        onSubmitSearch={handleSearch}
      />

      {/* Employers grid - 3 columns on large screens */}
      <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {paginatedEmployers.map((employer) => (
          <EmployerCard key={employer.id} employer={employer} />
        ))}
      </div>

      {/* Pagination */}
      <EmployersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalEmployers}
        pageSize={PAGE_SIZE}
        onNext={handleNextPage}
        onPrev={handlePrevPage}
      />
    </section>
  )
}
