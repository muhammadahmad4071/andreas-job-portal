"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const allBenefits = [
  "Workwear",
  "Parking lot",
  "Coaching",
  "Distance allowance",
  "Canteen",
  "Employee events",
  "Company doctor",
  "Employee discount",
]

export function EmployerBenefitsCard() {
  const [showAll, setShowAll] = useState(false)
  const displayedBenefits = showAll ? allBenefits : allBenefits.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Benefits</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {displayedBenefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        {allBenefits.length > 8 && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="h-auto p-0 text-[#FDB714] hover:text-[#FDB714]/80"
          >
            {showAll ? "Show less" : "Show more"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
