"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { EmployerJob } from "@/components/all-jobs/types"
import { JobCard } from "@/components/all-jobs/JobCard"

type JobListProps = {
  jobs: EmployerJob[]
}

export function JobList({ jobs }: JobListProps) {
  if (!jobs.length) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6 text-sm text-gray-700">
          No job ads found for the selected filters.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}