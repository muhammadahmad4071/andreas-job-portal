"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, Zap } from "lucide-react"
import type { Job } from "./JobsPageShell"
import { cn } from "@/lib/utils"

type JobListItemProps = {
  job: Job
  isSelected: boolean
  onClick: () => void
}

export function JobListItem({ job, isSelected, onClick }: JobListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:bg-muted/50",
        isSelected && "bg-muted border-l-4 border-l-[#FDB714]",
      )}
    >
      <div className="flex gap-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <Image src={job.logoSrc || "/placeholder.svg"} alt={job.companyName} width={48} height={48} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#FDB714] leading-tight line-clamp-1">{job.title}</h3>
            {job.isTopJob && (
              <Badge variant="secondary" className="flex-shrink-0 bg-[#FDB714] text-white">
                <Briefcase className="h-3 w-3 mr-1" />
                Top Job
              </Badge>
            )}
          </div>


          <p className="text-sm font-medium text-foreground line-clamp-1">{job.companyName}</p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{job.location}</span>
          </div>

          {job.salary && <p className="text-xs font-medium text-muted-foreground">{job.salary}</p>}

          {job.isExpressApplication && (
            <div className="flex items-center gap-1 text-xs text-[#FDB714] font-medium">
              <Zap className="h-3 w-3 fill-current" />
              <span>Express application</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
