"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import type { Region } from "@/lib/types"

export function HomeBannerStrip() {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadRegions() {
      try {
        const data = await apiFetch("/jobs/locations")

        console.log("Locations API response:", data)

        let items: any[] = []

        // API shape: { locations: ["ddddddddddd", "Munich"] }
        if (data && Array.isArray(data.locations)) {
          items = data.locations
        } else if (Array.isArray(data)) {
          items = data
        } else if (data && Array.isArray(data.data)) {
          items = data.data
        }

        const mapped: Region[] = items.map((loc: any, idx: number) => {
          const name = typeof loc === "string" ? loc : loc.name ?? "Unknown"
          const id = String(typeof loc === "string" ? idx : loc.id ?? idx)

          const slug = name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "")

          const jobCount =
            typeof loc === "object" && loc !== null && typeof loc.job_count === "number"
              ? loc.job_count
              : 0

          return {
            id,
            name,
            slug,
            jobCount,
          }
        })

        if (!cancelled) {
          setRegions(mapped)
          setLoading(false)
        }
      } catch (err) {
        console.error("Failed to load locations:", err)
        if (!cancelled) {
          setRegions([])
          setLoading(false)
        }
      }
    }

    loadRegions()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="bg-primary py-8">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font text-black mb-6">
          Jobbörse für Oberland {" "}
          <span className="font-bold text-white">
            Regionale Stellenangebote, Ausbildungsplätze und Minijobs
          </span>
        </h2>

        <div className="flex flex-wrap gap-3">
          {loading && (
            <span className="text-white text-sm opacity-70">
              Loading regions...
            </span>
          )}

          {!loading && regions.length === 0 && (
            <span className="text-white text-sm opacity-70">
              No regions available.
            </span>
          )}

          {!loading &&
            regions.map((region) => (
              <Link
                key={region.id}
                href={`/public/jobs?location=${encodeURIComponent(region.name)}`}
                className="bg-white text-gray-800 px-5 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Jobs in {region.name} &gt;
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
