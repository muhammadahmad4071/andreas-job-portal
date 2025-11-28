"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { MapPin, Search } from "lucide-react"
import type {
  HomeOfficeOption,
  EmploymentType,
  Industry,
  Discipline,
  WorkExperience,
  EnterpriseSize,
} from "./JobsPageShell"

type JobsSearchFiltersProps = {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  locationTerm: string
  onLocationTermChange: (value: string) => void
  homeOfficeFilter: HomeOfficeOption
  onHomeOfficeFilterChange: (value: HomeOfficeOption) => void
  employmentTypeFilter: EmploymentType
  onEmploymentTypeFilterChange: (value: EmploymentType) => void
  industryFilter: Industry
  onIndustryFilterChange: (value: Industry) => void
  disciplineFilter: Discipline
  onDisciplineFilterChange: (value: Discipline) => void
  workExperienceFilter: WorkExperience
  onWorkExperienceFilterChange: (value: WorkExperience) => void
  enterpriseSizeFilter: EnterpriseSize
  onEnterpriseSizeFilterChange: (value: EnterpriseSize) => void
  onSubmitSearch: (e: React.FormEvent) => void
}

export function JobsSearchFilters({
  searchTerm,
  onSearchTermChange,
  locationTerm,
  onLocationTermChange,
  homeOfficeFilter,
  onHomeOfficeFilterChange,
  employmentTypeFilter,
  onEmploymentTypeFilterChange,
  industryFilter,
  onIndustryFilterChange,
  disciplineFilter,
  onDisciplineFilterChange,
  workExperienceFilter,
  onWorkExperienceFilterChange,
  enterpriseSizeFilter,
  onEnterpriseSizeFilterChange,
  onSubmitSearch,
}: JobsSearchFiltersProps) {
  const handleClearFilters = () => {
    onSearchTermChange("")
    onLocationTermChange("")
    onHomeOfficeFilterChange("Any")
    onEmploymentTypeFilterChange("Any")
    onIndustryFilterChange("Any")
    onDisciplineFilterChange("Any")
    onWorkExperienceFilterChange("Any")
    onEnterpriseSizeFilterChange("Any")
  }

  return (
    <div className="bg-background rounded-xl shadow-sm px-6 py-5 space-y-4">
      {/* ---------------- ROW 1 ---------------- */}
      <div className="flex flex-wrap gap-4">
        {/* Job search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter job"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Location */}
        <div className="relative flex-1 min-w-[200px]">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter location"
            value={locationTerm}
            onChange={(e) => onLocationTermChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* ---------------- ROW 2 ---------------- */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        {/* LEFT SIDE — dropdown(s) */}
        <div className="flex flex-wrap gap-4">
          <Select
            value={employmentTypeFilter}
            onValueChange={onEmploymentTypeFilterChange}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Type of employment" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Any">Type of Employment</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Apprenticeship">Apprenticeship</SelectItem>
            </SelectContent>
          </Select>

          {/* keep your commented filters cleanly here */}
          {/* 
        <Select
          value={homeOfficeFilter}
          onValueChange={onHomeOfficeFilterChange}
        >
          <SelectTrigger className="min-w-[190px] md:min-w-[220px]">
            <SelectValue placeholder="Home office options" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Any">Home Office Options</SelectItem>
            <SelectItem value="100">100% Home office</SelectItem>
            <SelectItem value="field">Field Service / Travel</SelectItem>
            <SelectItem value="partial">Partial home office</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={industryFilter}
          onValueChange={onIndustryFilterChange}
        >
          <SelectTrigger className="min-w-[190px] md:min-w-[220px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Any">Industry</SelectItem>
            <SelectItem value="Health service">Health service</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Tourism, hospitality and gastronomy">
              Tourism, hospitality and gastronomy
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={disciplineFilter}
          onValueChange={onDisciplineFilterChange}
        >
          <SelectTrigger className="min-w-[190px] md:min-w-[220px]">
            <SelectValue placeholder="Discipline" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Any">Discipline</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Nursing">Nursing</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Medicine">Medicine</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={workExperienceFilter}
          onValueChange={onWorkExperienceFilterChange}
        >
          <SelectTrigger className="min-w-[190px] md:min-w-[220px]">
            <SelectValue placeholder="Work experience" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Any">Work Experience</SelectItem>
            <SelectItem value="No experience">No experience</SelectItem>
            <SelectItem value="1-3 years">1-3 years</SelectItem>
            <SelectItem value="3-5 years">3-5 years</SelectItem>
            <SelectItem value="5+ years">5+ years</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={enterpriseSizeFilter}
          onValueChange={onEnterpriseSizeFilterChange}
        >
          <SelectTrigger className="min-w-[190px] md:min-w-[220px]">
            <SelectValue placeholder="Enterprise" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Any">Enterprise</SelectItem>
            <SelectItem value="Small">Small (0-50 employees)</SelectItem>
            <SelectItem value="Medium">Medium (50-250 employees)</SelectItem>
            <SelectItem value="Large">Large (250+ employees)</SelectItem>
          </SelectContent>
        </Select>
        */}
        </div>

        {/* RIGHT SIDE — actions */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            onClick={onSubmitSearch}
            className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-primary-foreground px-6"
          >
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
            className="text-sm border-dashed"
          >
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  )
}
