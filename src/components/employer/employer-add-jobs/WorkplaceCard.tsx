"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export type WorkplaceData = {
  workplace: string
  homeOffice: string
}

type WorkplaceCardProps = {
  value?: WorkplaceData
  onChange: (value: WorkplaceData) => void
}

export function WorkplaceCard({ value, onChange }: WorkplaceCardProps) {
  const [workplace, setWorkplace] = useState(value?.workplace ?? "")
  const [homeOffice, setHomeOffice] = useState(value?.homeOffice ?? "")

  useEffect(() => {
    onChange({
      workplace,
      homeOffice,
    })
  }, [workplace, homeOffice, onChange])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="md:grid md:grid-cols-3 md:gap-8">

          {/* Left Column */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              ARBEITSPLATZ
            </h3>
            <p className="text-sm text-muted-foreground space-y-3">
              Geben Sie den Arbeitsort ein und geben Sie Home-Office-Optionen an.
            </p>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-5">

            {/* Workplace */}
            <div className="space-y-2">
              <Label htmlFor="workplace" className="text-base font-semibold">
                Arbeitsort <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="workplace"
                  className="pl-10 text-base"
                  placeholder="e.g. Munich"
                  required
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Geben Sie die Orte an, an denen die Stelle verfügbar ist.
              </p>
            </div>

            {/* Home office */}
            {/* <div className="space-y-2">
              <Label htmlFor="home-office" className="text-base font-semibold">
                Home office option
              </Label>

              <select
                id="home-office"
                className="block w-full text-base h-11 px-3 rounded-md border border-input bg-background"
                value={homeOffice}
                onChange={(e) => setHomeOffice(e.target.value)}
              >
                <option value="" disabled>Please select...</option>
                <option value="100">100% Home office</option>
                <option value="field">Field Service / Travel</option>
                <option value="partial">Partial home office</option>
              </select>

              <p className="text-sm text-muted-foreground">
                Inform applicants about home office options.
              </p>
            </div> */}

            <div className="space-y-2">
            <Label htmlFor="home-office" className="text-base font-semibold">
              Home-office-option
            </Label>

            <Select
              value={homeOffice}
              onValueChange={setHomeOffice}
            >
              <SelectTrigger
                id="home-office"
                className="h-11 text-base bg-background border border-input"
              >
                <SelectValue placeholder="Bitte auswählen…" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                <SelectItem value="100">100% Home-office</SelectItem>
                <SelectItem value="field">Außendienst / Reisetätigkeit</SelectItem>
                <SelectItem value="partial">Teilweise home-office</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-sm text-muted-foreground">
              Informieren Sie die Bewerbenden über die Home-Office-Möglichkeiten.
            </p>
          </div>


          </div>
        </div>
      </CardContent>
    </Card>
  )
}
