"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import type { Job } from "@/lib/types"

function mapApiJobToHomeJob(apiJob: any): Job {
  const id = String(apiJob.id ?? "")
  const title: string = apiJob.title ?? "Untitled job"

  const employer: string =
    apiJob.company_name ??
    apiJob.organization?.title ??
    "Unknown company"

  // Backend gives a relative path like "company-logos/..."
  const employerLogo: string =
    apiJob.company_logo ??
    "" // fallback handled in JSX

  const location: string =
    apiJob.workplace_location ??
    "Location not specified"

  // we don't really use slug for routing anymore,
  // but keep it to satisfy the Job type
  const slug: string = id

  // map employment_types[0] -> Job["type"]
  const rawType =
    Array.isArray(apiJob.employment_types) && apiJob.employment_types.length > 0
      ? String(apiJob.employment_types[0]).toLowerCase()
      : ""

  let type: Job["type"] = "full-time"
  if (rawType.includes("part")) {
    type = "part-time"
  } else if (rawType.includes("mini")) {
    type = "full-time"
  } else if (rawType.includes("apprent")) {
    type = "apprenticeship"
  }

  const postedDate: string =
    apiJob.release_date ??
    apiJob.created_at ??
    ""

  return {
    id,
    title,
    employer,
    employerLogo,
    location,
    slug,
    type,
    postedDate,
  }
}

export function HomeFeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadJobs() {
      try {
        setLoading(true)
        setError(null)

        const data = await apiFetch("/jobs/public?page=1")

        //console.log("HomeFeaturedJobs public jobs response:", data)

        let items: any[] = []

        if (Array.isArray(data)) {
          items = data
        } else if (data && Array.isArray(data.data)) {
          items = data.data
        }

        const mapped = items.map(mapApiJobToHomeJob)

        if (!cancelled) {
          setJobs(mapped)
        }
      } catch (err: any) {
        console.error("Failed to load featured jobs:", err)
        if (!cancelled) {
          setError(err?.message || "Failed to load featured jobs.")
          setJobs([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-16 bg-background-gray">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            TopJobs
          </h2>
          <Link
            href="/public/jobs"
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2"
          >
            <span className="text-2xl">+</span>
            View all jobs
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-gray-600">Loading featured jobs…</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Link key={job.id} href={`/public/jobs/${job.id}`}>
                <Card hover className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={job.employerLogo || "/placeholder.svg"}
                        alt={job.employer}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-primary mb-2 leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-gray-800 font-medium mb-1 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {job.employer}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {job.location}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 15H4V8h16v11z" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
