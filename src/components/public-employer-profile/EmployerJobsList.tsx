"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export type EmployerJobsListItem = {
  id: string | number
  title: string
  company: string
  location: string
  logoSrc?: string | null
}

type EmployerJobsListProps = {
  jobs?: EmployerJobsListItem[]
}

const INITIAL_VISIBLE_JOBS = 3

export function EmployerJobsList({ jobs }: EmployerJobsListProps) {
  const sourceJobs = Array.isArray(jobs) ? jobs : []

  const [showAll, setShowAll] = useState(false)

  const visibleJobs =
    showAll ? sourceJobs : sourceJobs.slice(0, INITIAL_VISIBLE_JOBS)

  const hasMore = sourceJobs.length > INITIAL_VISIBLE_JOBS

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Our jobs
        </p>
      </CardHeader>

      <CardContent className="space-y-1">
        {/* No jobs available */}
        {sourceJobs.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground">
            No jobs available for this employer.
          </div>
        )}

        {/* Jobs list */}
        {sourceJobs.length > 0 &&
          visibleJobs.map((job, index) => (
            <Link
              key={job.id}
              href={`/public/jobs/${job.id}`}
              className={`flex gap-4 p-4 hover:bg-muted/60 transition-colors rounded-md ${
                index !== visibleJobs.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="relative h-12 w-12 flex-shrink-0 rounded border overflow-hidden bg-white">
                <Image
                  src={job.logoSrc || "/placeholder.svg"}
                  alt={job.company}
                  fill
                  className="object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#FDB714] hover:text-[#FDB714]/80 text-sm md:text-base mb-1">
                  {job.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-1">
                  {job.company}
                </p>

                <div className="flex items-start gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
              </div>
            </Link>
          ))}

        {/* Show more / Show less */}
        {sourceJobs.length > 0 && hasMore && (
          <div className="pt-4">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-[#FDB714] hover:text-[#FDB714]/80"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show less" : "Show more"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
