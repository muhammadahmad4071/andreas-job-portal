"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Users, Briefcase, ShieldCheck } from "lucide-react"

type EmployerAboutCardProps = {
  size?: string | null
  activeJobsCount?: number
  emailVerifiedAt?: string | null
}

export function EmployerAboutCard({
  size,
  activeJobsCount,
  emailVerifiedAt,
}: EmployerAboutCardProps) {
  const employeesLabel = size ? `${size} employees` : "Not specified"

  const verificationLabel =
    emailVerifiedAt === null ? "Not verified" : "Verified"

  const verificationColor =
    emailVerifiedAt === null ? "text-red-500" : "text-green-600"

  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          About us
        </p>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Active Jobs */}
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-[#FDB714]" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Active Job Posts
            </p>
            <p className="text-sm text-muted-foreground">
              {activeJobsCount ?? 0}
            </p>
          </div>
        </div>

        {/* Verification */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[#FDB714]" />
          <div>
            <p className="text-sm font-medium text-foreground">Profile Status</p>
            <p className={`text-sm ${verificationColor}`}>{verificationLabel}</p>
          </div>
        </div>

        {/* Employee Size */}
        <div className="flex items-center gap-3 pt-2 border-t">
          <Users className="h-5 w-5 text-[#FDB714]" />
          <div>
            <p className="text-sm font-medium text-foreground">Employees</p>
            <p className="text-sm text-muted-foreground">{employeesLabel}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
