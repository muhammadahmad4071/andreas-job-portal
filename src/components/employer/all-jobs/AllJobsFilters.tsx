"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { MapPin, ChevronDown } from "lucide-react"

type AllJobsFiltersProps = {
  filterText: string
  onFilterTextChange: (value: string) => void
  filterJobId: string
  onFilterJobIdChange: (value: string) => void
  filterLocation: string
  onFilterLocationChange: (value: string) => void
  filterSource: string
  onFilterSourceChange: (value: string) => void
  filterEmploymentType: string
  onFilterEmploymentTypeChange: (value: string) => void
  filterApplicationWorkflow: string
  onFilterApplicationWorkflowChange: (value: string) => void
  filterFrontend: string
  onFilterFrontendChange: (value: string) => void
  onClearAll: () => void
  onApplyFilters: () => void
}

const SOURCE_OPTIONS = ["All Jobs", "Draft jobs", "Active jobs", "Expired jobs"]

const EMPLOYMENT_TYPE_OPTIONS = [
  "Any type of employment",
  "Full-time",
  "Part-time",
  "Apprenticeship",
]

const WORKFLOW_OPTIONS = ["Any application workflow", "Standard", "Custom"]

const FRONTEND_OPTIONS = ["Any frontend", "Classic", "Modern"]

export function AllJobsFilters({
  filterText,
  onFilterTextChange,
  filterJobId,
  onFilterJobIdChange,
  filterLocation,
  onFilterLocationChange,
  filterSource,
  onFilterSourceChange,
  filterEmploymentType,
  onFilterEmploymentTypeChange,
  filterApplicationWorkflow,
  onFilterApplicationWorkflowChange,
  filterFrontend,
  onFilterFrontendChange,
  onClearAll,
  onApplyFilters,
}: AllJobsFiltersProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 md:p-6">
        {/* Main row: inputs + clear all */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {/* Left side: text + location (stack on mobile, inline on desktop) */}
          <div className="flex flex-col gap-3 md:flex-row md:flex-1">
            <Input
              placeholder="Filterung nach Stellenbezeichnung"
              value={filterText}
              onChange={(e) => onFilterTextChange(e.target.value)}
              className="bg-white md:flex-[2]"
            />

            {/* <Input
              placeholder="Filter by ID"
              value={filterJobId}
              onChange={(e) => onFilterJobIdChange(e.target.value)}
              className="bg-white md:flex-[2]"
            /> */}

            <div className="relative md:flex-[2]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Nach Standort filtern"
                value={filterLocation}
                onChange={(e) => onFilterLocationChange(e.target.value)}
                className="bg-white pl-9"
              />
            </div>

            {/* <Select value={filterSource} onValueChange={onFilterSourceChange}>
              <SelectTrigger className="bg-white md:flex-[2] justify-between">
                <SelectValue placeholder="Any Source" />
                <ChevronDown className="w-4 h-4 ml-2" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {SOURCE_OPTIONS.map((option) => (
                  <SelectItem key={`src-${option}`} value={option}>
                    {option === "All Jobs" ? "Any Source" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>

          {/* Right side: Clear all */}
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-gray-800 hover:underline md:ml-4 self-start md:self-center"
          >
            {/* Clear all */}
            Alle löschen
          </button>
        </div>

        {/* Extra filters row (still commented, unchanged) */}
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
          {/* <Select
            value={filterEmploymentType}
            onValueChange={onFilterEmploymentTypeChange}
          >
            <SelectTrigger className="bg-white md:flex-1 justify-between">
              <SelectValue placeholder="Any type of employment" />
              <ChevronDown className="w-4 h-4 ml-2" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* <Select
            value={filterApplicationWorkflow}
            onValueChange={onFilterApplicationWorkflowChange}
          >
            <SelectTrigger className="bg-white md:flex-1 justify-between">
              <SelectValue placeholder="Any application workflow" />
              {/* <ChevronDown className="w-4 h-4 ml-2" /> 
            </SelectTrigger>
            <SelectContent className="bg-white">
              {WORKFLOW_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* <Select
            value={filterFrontend}
            onValueChange={onFilterFrontendChange}
          >
            <SelectTrigger className="bg-white md:flex-1 justify-between">
              <SelectValue placeholder="Any frontend" />
              {/* <ChevronDown className="w-4 h-4 ml-2" /> 
            </SelectTrigger>
            <SelectContent className="bg-white">
              {FRONTEND_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* <Button
            onClick={onApplyFilters}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 md:ml-2"
          >
            Apply
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}
