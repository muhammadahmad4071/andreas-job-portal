"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

const employerDescription = `Above the shore of Lake Gmünd rises Gut Kaltenbrunn. A place that stands for Bavarian hospitality and the highest level of enjoyment like no other on Lake Tegernsee. Michael Käfer reopened Gut Kaltenbrunn in June 2015. Since then, it has stood for warm hospitality and enjoyment in harmony with the products of the region, for credibility and sustainable commitment. Gut Kaltenbrunn combines a hotel, gourmet restaurant, a traditional Bavarian tavern, a delicatessen and a conference area with attractive rooms for meetings, celebrations and seminars on 23 hectares of its own land.

The hotel's 23 rooms and suites are uniquely designed and furnished with great attention to detail. The cuisine in the gourmet restaurant celebrates honest, high-quality products from the region and beyond. With its cozy atmosphere and authentic cuisine, the traditional Bavarian tavern is a popular meeting place for locals and guests. The delicatessen offers a carefully selected range of regional and international specialties.`

export function EmployerAboutCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader className="space-y-1 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">About us</p>
        <h2 className="text-lg md:text-xl font-semibold text-foreground leading-tight">
          On the northern shore of Lake Tegernsee, tradition meets modernity
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={isExpanded ? "" : "line-clamp-4"}>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{employerDescription}</p>
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-auto p-0 text-[#FDB714] hover:text-[#FDB714]/80"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              <span className="font-medium">Number of employees:</span> 50 - 99 employees
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
