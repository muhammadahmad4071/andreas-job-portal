"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { VideoHighlight } from "@/lib/types"
import { apiFetch } from "@/lib/api"

export function HomeVideoHighlights() {
  const [videos, setVideos] = useState<VideoHighlight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadVideos() {
      try {
        setLoading(true)
        setError(null)

        const data = await apiFetch("/jobs/public?page=1")
        //console.log("Video highlights API response:", data)

        const items: any[] = Array.isArray(data.data) ? data.data : []

        // Take first 6 jobs (even if video_link is null)
        const limited = items.slice(0, 6)

        const mapped: VideoHighlight[] = limited.map((job) => ({
          id: String(job.id),
          title: job.title ?? "Untitled job",
          employer: job.company_name ?? job.organization?.title ?? "Unknown company",
          location: job.workplace_location ?? "Location not specified",
          embedUrl: job.video_link, // can be null
          thumbnailUrl: "",
        }))

        if (!cancelled) setVideos(mapped)
      } catch (err) {
        console.error("Failed to load video jobs:", err)
        if (!cancelled) setError("Failed to load videos.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadVideos()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="py-16 bg-background-dark">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          Jobs at a glance
        </h2>

        {loading && <p className="text-gray-300">Loading videos…</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && videos.length === 0 && (
          <p className="text-gray-400">No jobs available.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="flex flex-col h-full overflow-hidden bg-background-darker border-gray-700"
            >
              {/* Video / placeholder area (clicking here controls the video only) */}
              <div className="relative aspect-video w-full">
                {video.embedUrl ? (
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 text-sm">
                    Video coming soon
                  </div>
                )}
              </div>

              {/* Content area → clicking this goes to /public/jobs/{id} */}
              <Link
                href={`/public/jobs/${video.id}`}
                className="flex-1 bg-white p-4 flex flex-col hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-primary mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-800 font-medium mb-1">
                  {video.employer}
                </p>
                <p className="text-sm text-gray-600">
                  {video.location}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
