"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { EmployerJob } from "@/components/all-jobs/types"
import {
  Info,
  MapPin,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react"
import Link from "next/link"

type JobCardProps = {
  job: EmployerJob
}

export function JobCard({ job }: JobCardProps) {
  const [expanded, setExpanded] = useState(false)

  const shownDescription =
    expanded || job.description.length <= 140
      ? job.description
      : job.description.slice(0, 140) + "…"

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          <div className="flex-1">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 rounded-md bg-[#FDB714] text-white px-3 py-1 text-xs font-semibold">
              <Info className="w-3 h-3" />
              <span>{job.status}</span>
            </div>

            {/* Title */}
            <div className="mt-2 text-base font-semibold text-[#FDB714]">
              {job.title}
            </div>

            {/* Location */}
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>

            {/* Statistics line */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-800">
              <span>{job.statisticsSummary}</span>
              <span className="inline-flex items-center justify-center border border-gray-800 rounded-sm w-5 h-5 text-[10px]">
                ▾
              </span>
            </div>

            {/* Description + see more/less */}
            <div className="mt-3 text-sm text-gray-700">
              <p>{shownDescription}</p>
              {job.description.length > 140 && (
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="mt-1 inline-flex items-center text-sm font-medium text-gray-800 hover:text-gray-900"
                >
                  {expanded ? "See less" : "See more"}
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right side: Options + Edit */}
          <div className="mt-2 flex items-start gap-3 md:mt-0 md:flex-col md:items-end">
            {/* <button
              type="button"
              className="text-sm text-gray-800 inline-flex items-center gap-1 hover:text-gray-900"
            >
              Options
              <ChevronDown className="w-4 h-4" />
            </button> */}

            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-1 md:mt-2"
            >
              <Link href={`/employer/jobs/${job.id}/edit`}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}