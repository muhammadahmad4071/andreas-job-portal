"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SalaryIndicationData = {
  minSalary: string
  maxSalary: string
  salaryUnit: string
}

type SalaryIndicationCardProps = {
  value?: SalaryIndicationData
  onChange: (value: SalaryIndicationData) => void
}

export function SalaryIndicationCard({
  value,
  onChange,
}: SalaryIndicationCardProps) {
  const [minSalary, setMinSalary] = useState(value?.minSalary ?? "")
  const [maxSalary, setMaxSalary] = useState(value?.maxSalary ?? "")
  const [salaryUnit, setSalaryUnit] = useState(value?.salaryUnit ?? "")

  useEffect(() => {
    onChange({
      minSalary,
      maxSalary,
      salaryUnit,
    })
  }, [minSalary, maxSalary, salaryUnit, onChange])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="md:grid md:grid-cols-3 md:gap-8">

          {/* Left Column */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              GEHALTSANGABE
            </h3>
            <p className="text-sm text-muted-foreground">
              Die Angabe einer Gehaltsspanne erhöht die Auffindbarkeit der Stelle bei Google for Jobs.
            </p>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-base font-semibold">Gehaltsspanne  <span className="text-destructive">*</span></h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Min salary */}
              <div className="space-y-2">
                <Label htmlFor="min-salary" className="text-sm font-semibold">
                 Mindestgehalt  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    id="min-salary"
                    type="number"
                    className="pl-8"
                    placeholder="0"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                  />
                </div>
              </div>

              {/* Max salary */}
              <div className="space-y-2">
                <Label htmlFor="max-salary" className="text-sm font-semibold">
                  Höchstgehalt  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <Input
                    id="max-salary"
                    type="number"
                    className="pl-8"
                    placeholder="0"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                  />
                </div>
              </div>

              {/* Salary unit */}
              <div className="space-y-2">
                <Label htmlFor="salary-unit" className="text-sm font-semibold">
                 Gehaltsangabe (Einheit)  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={salaryUnit}
                  onValueChange={setSalaryUnit}
                >
                  <SelectTrigger id="salary-unit" className="text-base">
                    <SelectValue placeholder="-- Please Select --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="hour">Pro Stunde</SelectItem>
                    <SelectItem value="month">Pro Monat</SelectItem>
                    <SelectItem value="year">Pro Jahr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Geben Sie eine Gehaltsspanne für diese Stelle an.

            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
