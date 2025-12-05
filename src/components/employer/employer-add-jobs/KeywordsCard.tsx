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
              SCHLÜSSELWÖRTER DER STELLENANZEIGE
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-primary">
                TIPP: Achten Sie stets auf Folgendes:
              </p>
              <p>
               Überlegen Sie, wonach Bewerbende höchstwahrscheinlich suchen.
So finden Sie die besten Schlüsselwörter.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-2 space-y-5">
            {/* Type of employment */}
            <div className="space-y-2">
              <Label htmlFor="employment-type" className="text-base font-semibold">
                Beschäftigungsart <span className="text-destructive">*</span>
              </Label>
              <Select
                value={employmentType}
                onValueChange={setEmploymentType}
              >
                <SelectTrigger
                  id="employment-type"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Bitte auswählen --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="apprenticeship">Ausbildung</SelectItem>
                  <SelectItem value="full-time">Vollzeit</SelectItem>
                  <SelectItem value="part-time"> Teilzeit</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
               Bitte wählen Sie die Beschäftigungsart für diese Stellenanzeige aus.
              </p>
            </div>

            {/* Educational qualification */}
            <div className="space-y-2">
              <Label htmlFor="education" className="text-base font-semibold">
                Erforderliche Ausbildungsqualifikation
              </Label>
              <Select
                value={education}
                onValueChange={setEducation}
              >
                <SelectTrigger
                  id="education"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Bitte auswählen --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="enrolled-student">Eingeschriebene/r Student/in</SelectItem>
                  <SelectItem value="graduate">Absolvent/in</SelectItem>
                  <SelectItem value="technician">Techniker/in</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Bitte wählen Sie die erforderliche Ausbildungsqualifikation aus.
              </p>
            </div>

            {/* Professional experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-base font-semibold">
                Berufserfahrung <span className="text-destructive">*</span>
              </Label>
              <Select
                value={experience}
                onValueChange={setExperience}
              >
                <SelectTrigger
                  id="experience"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Bitte auswählen --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="entry">Berufseinsteiger/in</SelectItem>
                  <SelectItem value="1-3">1–3 Jahre</SelectItem>
                  <SelectItem value="3-5">3–5 Jahre</SelectItem>
                  <SelectItem value="5+">5+ Jahre</SelectItem>
                  <SelectItem value="senior">Erfahrene/r Fachkraft</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Geben Sie an, wie viel Erfahrung für diese Stelle erforderlich ist.
              </p>
            </div>

            {/* Discipline */}
            <div className="space-y-2">
              <Label htmlFor="discipline" className="text-base font-semibold">
                Fachrichtung <span className="text-destructive">*</span>
              </Label>
              <Select
                value={discipline}
                onValueChange={setDiscipline}
              >
                <SelectTrigger
                  id="discipline"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Bitte auswählen --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="art">Kunst</SelectItem>
                  <SelectItem value="engineering">Ingenieurwesen</SelectItem>
                  <SelectItem value="health">Gesundheitswesen</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Geben Sie hier passende Berufsfelder für diese Position an.
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base font-semibold">
                Fachgebiet
              </Label>
              <Select
                value={subject}
                onValueChange={setSubject}
              >
                <SelectTrigger
                  id="subject"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Bitte auswählen --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="architecture">Architektur</SelectItem>
                  <SelectItem value="biology">Biologie</SelectItem>
                  <SelectItem value="chemistry">Chemie</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Geben Sie Informationen zu den für diese Position relevanten Studienrichtungen an.
              </p>
            </div>

            {/* Language skills */}
            <div className="space-y-2">
              <Label htmlFor="languages" className="text-base font-semibold">
                Erforderliche Sprachkenntnisse
              </Label>
              <Select
                value={languages}
                onValueChange={setLanguages}
              >
                <SelectTrigger
                  id="languages"
                  className="h-11 text-base bg-background border border-input"
                >
                  <SelectValue placeholder="-- Bitte auswählen --" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="arabic">Arabisch</SelectItem>
                  <SelectItem value="english">Englisch</SelectItem>
                  <SelectItem value="french">Französisch</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Geben Sie an, welche Sprachkenntnisse für diese Position erforderlich sind.
              </p>
            </div>

            {/* Required skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-base font-semibold">
                Erforderliche Fähigkeiten
              </Label>
              <Input
                id="skills"
                placeholder="Bitte geben Sie ein…"
                className="text-base"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Bitte geben Sie alle Fähigkeiten an, die Bewerbende mitbringen sollten.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
