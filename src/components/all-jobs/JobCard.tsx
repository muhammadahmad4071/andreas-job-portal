"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { EmployerJob } from "@/components/all-jobs/types"
import { Info, MapPin, ChevronDown, ChevronUp, Edit } from "lucide-react"
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

  const createdDate =
    job.createdAt && typeof job.createdAt === "string"
      ? job.createdAt.slice(0, 10)
      : ""
  const updatedDate =
    job.updatedAt && typeof job.updatedAt === "string"
      ? job.updatedAt.slice(0, 10)
      : ""

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

            {/* Title with label */}
            <div className="mt-2 text-sm text-gray-800">
              <span className="font-semibold">Title: </span>
              <span className="text-[#FDB714] font-semibold">
                {job.title}
              </span>
            </div>

            {/* Company with label */}
            <div className="mt-1 text-sm text-gray-800">
              <span className="font-semibold">Company: </span>
              <span>{job.companyName}</span>
            </div>

            {/* Location with label */}
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4" />
              <span>
                <span className="font-semibold">Location: </span>
                {job.location}
              </span>
            </div>

            {/* Description + toggle */}
            <div className="mt-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Description: </span>
                <span>{shownDescription}</span>
              </p>

              {/* Always show toggle so user can open extra fields even if description is short */}
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-1 inline-flex items-center text-sm font-medium text-gray-800 hover:text-gray-900"
              >
                {expanded ? " " : " "}
                {expanded ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>

            {/* Expanded extra details */}
            {expanded && (
              <div className="mt-3 border-t pt-3 text-sm text-gray-700 space-y-1">
                {job.employmentType && (
                  <p>
                    <span className="font-semibold">Employment type: </span>
                    <span>{job.employmentType}</span>
                  </p>
                )}

                {job.source && (
                  <p>
                    <span className="font-semibold">Source: </span>
                    <span>{job.source}</span>
                  </p>
                )}

                {createdDate && (
                  <p>
                    <span className="font-semibold">Created at: </span>
                    <span>{createdDate}</span>
                  </p>
                )}

                {updatedDate && (
                  <p>
                    <span className="font-semibold">Last updated: </span>
                    <span>{updatedDate}</span>
                  </p>
                )}

                {/* {job.statisticsSummary && (
                  <p>
                    <span className="font-semibold">Statistics: </span>
                    <span>{job.statisticsSummary}</span>
                  </p>
                )} */}
              </div>
            )}
          </div>

          {/* Right side: Edit */}
          <div className="mt-2 flex items-start gap-3 md:mt-0 md:flex-col md:items-end">
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
