import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Building2, Users, Briefcase } from "lucide-react"
import type { Employer } from "./EmployersListPageShell"
import Image from "next/image"
import Link from "next/link"

type EmployerCardProps = {
  employer: Employer
}

export function EmployerCard({ employer }: EmployerCardProps) {
  return (
    <Link href={`/public/employer-profile/${employer.id}`} className="block h-full">
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Top banner - yellow/orange block or image */}
        {employer.imageUrl ? (
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={employer.imageUrl || "/placeholder.svg"}
              alt={employer.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-40 w-full bg-amber-400" />
        )}

        {/* Card content */}
        <CardContent
          className={`p-5 flex flex-col gap-3 flex-1 ${
            employer.isHighlighted ? "bg-yellow-50" : "bg-white"
          }`}
        >
          {/* Employer name */}
          <h2 className="font-semibold text-lg text-gray-900 leading-snug mb-1">
            {employer.name}
          </h2>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <div>{employer.street}</div>
              <div>
                {employer.postalCode} {employer.city}
              </div>
              <div>{employer.country}</div>
            </div>
          </div>

          {/* Industry */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span>{employer.industry}</span>
          </div>

          {/* Employee range */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{employer.employeeRange}</span>
          </div>

          {/* Open positions */}
          {/* <div className="flex items-center gap-2 text-sm text-gray-700">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span>{employer.openPositions} open positions</span>
          </div> */}
        </CardContent>
      </Card>
    </Link>
  )
}
