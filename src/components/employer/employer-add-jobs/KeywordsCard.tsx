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

export type KeywordsData = {
  employmentType: string
  education: string
  experience: string
  discipline: string
  subject: string
  languages: string
  skills: string
}

type KeywordsCardProps = {
  value?: KeywordsData
  onChange: (value: KeywordsData) => void
}

export function KeywordsCard({ value, onChange }: KeywordsCardProps) {
  const [employmentType, setEmploymentType] = useState(
    value?.employmentType ?? ""
  )
  const [education, setEducation] = useState(value?.education ?? "")
  const [experience, setExperience] = useState(value?.experience ?? "")
  const [discipline, setDiscipline] = useState(value?.discipline ?? "")
  const [subject, setSubject] = useState(value?.subject ?? "")
  const [languages, setLanguages] = useState(value?.languages ?? "")
  const [skills, setSkills] = useState(value?.skills ?? "")

  // Sync up to parent whenever something changes
  useEffect(() => {
    onChange({
      employmentType,
      education,
      experience,
      discipline,
      subject,
      languages,
      skills,
    })
  }, [
    employmentType,
    education,
    experience,
    discipline,
    subject,
    languages,
    skills,
    onChange,
  ])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          {/* Left Description Column */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              KEYWORDS OF THE JOB AD
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-primary">
                TIP: Always be aware of the following:
              </p>
              <p>
                Think about what candidates are most likely to look for.
                Here&apos;s how to find the best keywords.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-2 space-y-5">
            {/* Type of employment */}
            <div className="space-y-2">
              <Label htmlFor="employment-type" className="text-base font-semibold">
                Type of employment <span className="text-destructive">*</span>
              </Label>
              <Select
                value={employmentType}
                onValueChange={setEmploymentType}
              >
                <SelectTrigger
                  id="employment-type"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Please Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Please select the type of employment for this job advertisement.
              </p>
            </div>

            {/* Educational qualification */}
            <div className="space-y-2">
              <Label htmlFor="education" className="text-base font-semibold">
                Required educational qualification
              </Label>
              <Select
                value={education}
                onValueChange={setEducation}
              >
                <SelectTrigger
                  id="education"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Please Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="enrolled-student">Enrolled Student</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Please select the required educational qualification.
              </p>
            </div>

            {/* Professional experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-base font-semibold">
                Professional experience <span className="text-destructive">*</span>
              </Label>
              <Select
                value={experience}
                onValueChange={setExperience}
              >
                <SelectTrigger
                  id="experience"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Please Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="entry">Entry level</SelectItem>
                  <SelectItem value="1-3">1–3 years</SelectItem>
                  <SelectItem value="3-5">3–5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                  <SelectItem value="senior">Senior level</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Indicate how much experience is required for this job.
              </p>
            </div>

            {/* Discipline */}
            <div className="space-y-2">
              <Label htmlFor="discipline" className="text-base font-semibold">
                Discipline <span className="text-destructive">*</span>
              </Label>
              <Select
                value={discipline}
                onValueChange={setDiscipline}
              >
                <SelectTrigger
                  id="discipline"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Please Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Enter suitable career fields for this position here.
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base font-semibold">
                Subject
              </Label>
              <Select
                value={subject}
                onValueChange={setSubject}
              >
                <SelectTrigger
                  id="subject"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Please Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="architecture">Architecture</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Provide information about the fields of study relevant to this position.
              </p>
            </div>

            {/* Language skills */}
            <div className="space-y-2">
              <Label htmlFor="languages" className="text-base font-semibold">
                Required language skills
              </Label>
              <Select
                value={languages}
                onValueChange={setLanguages}
              >
                <SelectTrigger
                  id="languages"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Please Select --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Indicate what language skills are required for this position.
              </p>
            </div>

            {/* Required skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-base font-semibold">
                Required Skills
              </Label>
              <Input
                id="skills"
                placeholder="Please type..."
                className="text-base"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Please indicate all skills that applicants should have.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
