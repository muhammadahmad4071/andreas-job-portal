"use client"

import { useEffect, useState } from "react"
import { Employer } from "@/lib/types"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

function mapApiEmployerToEmployer(apiEmployer: any): Employer {
  const org = apiEmployer.organization || {}

  const id = apiEmployer.id ?? org.id ?? ""
  const name = org.title || apiEmployer.name || "Unbekannter Arbeitgeber"

  // 👇 Slug: best guess – username, otherwise fallback on id
  const slug =
    apiEmployer.username ||
    org.slug ||
    `employer-${id}`

  // 👇 This is the important part: take logo from organization
  const logo: string | undefined =
    org.logo ||
    apiEmployer.logo ||
    undefined

  // You can later extend this when backend adds a dedicated hero/featured image
  const featuredImage: string | undefined =
    org.hero_image || logo || undefined

  return {
    id: String(id),
    name,
    slug,
    logo,
    featuredImage,
  } as Employer
}

export function HomeTopEmployers() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Local slider pagination
  const pageSize = 12
  const [page, setPage] = useState(0)

  // Backend pagination
  const [apiPage, setApiPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  async function loadEmployers(page = 1) {
    try {
      setLoading(true)

      const response = await apiFetch(`/employers?page=${page}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      // 🔍 See exactly what backend sends
      console.log("📦 Employers API Response:", response)

      const raw = Array.isArray(response.data) ? response.data : []

      // 🔄 Map backend format -> UI Employer type
      const mapped = raw.map(mapApiEmployerToEmployer)

      setEmployers(mapped)

      // Pagination info from backend (top-level)
      setApiPage(response.current_page ?? 1)
      setLastPage(response.last_page ?? 1)
    } catch (err) {
      console.error("Employer fetch error:", err)
      setError("Failed to load employers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployers()
  }, [])

  // --- UI pagination (slider) ---

  const featured = employers.slice(0, 3)
  const rest = employers.slice(3)

  const pageCount = Math.max(1, Math.ceil(rest.length / pageSize))

  const startIndex = page * pageSize
  const visibleEmployers = rest.slice(startIndex, startIndex + pageSize)

  const handlePrev = () => {
    if (pageCount <= 1) return
    setPage((prev) => (prev - 1 + pageCount) % pageCount)
  }

  const handleNext = () => {
    if (pageCount <= 1) return
    setPage((prev) => (prev + 1) % pageCount)
  }

  const loadNextApiPage = () => {
    if (apiPage < lastPage) loadEmployers(apiPage + 1)
  }

  const loadPrevApiPage = () => {
    if (apiPage > 1) loadEmployers(apiPage - 1)
  }

  // --- States ---

  if (loading) {
    return (
      <section className="py-16 bg-[#eef2f5]">
        <div className="container-custom text-center text-gray-500">
          Loading employers…
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-[#eef2f5]">
        <div className="container-custom text-center text-red-500">
          {error}
        </div>
      </section>
    )
  }

  if (employers.length === 0) {
    return (
      <section className="py-16 bg-[#eef2f5]">
        <div className="container-custom text-center text-gray-500">
          No employers found.
        </div>
      </section>
    )
  }

  // --- UI ---

  return (
    <section className="py-16 bg-[#eef2f5]">
      <div className="container-custom relative">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-[#9aa2ad] text-center mb-12">
          Top Employer
        </h2>

        {/* Featured Employers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featured.map((employer) => (
            // <Link key={employer.id} href={`/employers/${employer.slug}`}>
            <Link key={employer.id} href={`/public/employer-profile/${employer.id}`}>

              <Card hover className="overflow-hidden bg-white rounded-md shadow-sm">
                <div className="relative h-36 md:h-52">
                  <Image
                    src={employer.featuredImage || employer.logo || "/placeholder.svg"}
                    alt={employer.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-white px-3 py-2 rounded-md shadow-md">
                    <Image
                      src={employer.logo || "/placeholder.svg"}
                      alt={`${employer.name} logo`}
                      width={90}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Logo Grid + Carousel Controls */}
        <div className="relative">
          {pageCount > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous employers"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                         flex items-center justify-center w-8 h-8 rounded-full 
                         border border-gray-300 text-gray-500 bg-white shadow-sm hover:bg-gray-50"
            >
              ‹
            </button>
          )}

          {pageCount > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next employers"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                         flex items-center justify-center w-8 h-8 rounded-full 
                         border border-gray-300 text-gray-500 bg-white shadow-sm hover:bg-gray-50"
            >
              ›
            </button>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-10">
            {visibleEmployers.map((employer) => (
              // <Link key={employer.id} href={`/employers/${employer.slug}`}>
              <Link key={employer.id} href={`/public/employer-profile/${employer.id}`}>

                <Card
                  hover
                  className="h-24 md:h-28 flex items-center justify-center 
                             rounded-md bg-white shadow-sm"
                >
                  <Image
                    src={employer.logo || "/placeholder.svg"}
                    alt={employer.name}
                    width={130}
                    height={60}
                    className="max-h-14 max-w-full object-contain"
                  />
                </Card>
              </Link>
            ))}
          </div>

          {/* Local pagination dots */}
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === page ? "bg-gray-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to employers page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Backend pagination */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            type="button"
            onClick={loadPrevApiPage}
            disabled={apiPage <= 1}
            className="px-4 py-2 rounded bg-white border shadow-sm disabled:opacity-30"
          >
            Prev Page
          </button>

          <span className="text-gray-600">
            Page {apiPage} of {lastPage}
          </span>

          <button
            type="button"
            onClick={loadNextApiPage}
            disabled={apiPage >= lastPage}
            className="px-4 py-2 rounded bg-white border shadow-sm disabled:opacity-30"
          >
            Next Page
          </button>
        </div>
      </div>
    </section>
  )
}
