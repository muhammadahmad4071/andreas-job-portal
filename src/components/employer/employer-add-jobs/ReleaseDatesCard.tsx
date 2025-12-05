"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type ReleaseDatesData = {
  releaseDate: string
  expirationDate: string
}

type ReleaseDatesCardProps = {
  value?: ReleaseDatesData
  onChange: (value: ReleaseDatesData) => void
}

export function ReleaseDatesCard({ value, onChange }: ReleaseDatesCardProps) {
  const [releaseDate, setReleaseDate] = useState(value?.releaseDate ?? "")
  const [expirationDate, setExpirationDate] = useState(value?.expirationDate ?? "")

  // Sync to parent
  useEffect(() => {
    onChange({
      releaseDate,
      expirationDate,
    })
  }, [releaseDate, expirationDate, onChange])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          
          {/* Left Description Column */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              VERÖFFENTLICHUNGSDATUM & DAUER
            </h3>
            <p className="text-sm text-muted-foreground">
              Geben Sie Informationen zum Veröffentlichungsdatum und zur Dauer der Stellenausschreibung an.

            </p>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-2 space-y-5">

            {/* Release date */}
            <div className="space-y-2">
              <Label htmlFor="release-date" className="text-base font-semibold">
                Veröffentlichungsdatum  <span className="text-destructive">*</span>
              </Label>
              <Input
                id="release-date"
                type="date"
                className="text-base w-full sm:w-[220px]"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Wählen Sie aus, wann die Stellenausschreibung veröffentlicht werden soll.
              </p>
            </div>

            {/* Expiration date */}
            <div className="space-y-2">
              <Label htmlFor="expiration-date" className="text-base font-semibold">
                Ablaufdatum  <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expiration-date"
                type="date"
                className="text-base w-full sm:w-[220px]"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Wählen Sie aus, wann die Stelle offline gehen soll.
              </p>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
