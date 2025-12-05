import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Briefcase, Building, Zap } from "lucide-react"
import type { Job } from "./JobsPageShell"

type JobDetailPanelProps = {
  job: Job | null
}

function TagPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  )
}

export function JobDetailPanel({ job }: JobDetailPanelProps) {
  if (!job) {
    return (
      <Card className="p-12 flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            Select a job to see details
          </p>
          <p className="text-sm text-muted-foreground">
            Click on a job from the list to view its full description.
          </p>
        </div>
      </Card>
    )
  }

  const hasSalary = Boolean(job.salary)

  const formattedPublishedAt = job.publishedAt
    ? new Date(job.publishedAt).toLocaleDateString()
    : "–"

  const formattedExpirationDate = job.expirationDate
    ? new Date(job.expirationDate).toLocaleDateString()
    : null

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="h-[600px]">
        {/* Header Image */}
        {job.headerImageSrc && (
          <div className="relative h-48 w-full">
            <Image
              src={job.headerImageSrc || "/placeholder.svg"}
              alt={job.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Actions */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold leading-tight">{job.title}</h1>

              <Link href={`/public/jobs/${job.id}/apply`}>
                <Button className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-primary-foreground flex-shrink-0">
                  {job.isExpressApplication && (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {job.isExpressApplication
                    ? "Express application"
                    : "Jetzt bewerben"}
                </Button>
              </Link>
            </div>

            {job.isTopJob && (
              <span className="inline-flex items-center rounded-full bg-[#FDB714] px-3 py-1 text-xs font-semibold text-white">
                <Briefcase className="h-3 w-3 mr-1" />
                Top Job
              </span>
            )}
          </div>

          {/* Company Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#FDB714] font-medium">
              <Building className="h-4 w-4" />
              <span>{job.companyName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* Meta Tags */}
          {/* QA: Fix — hide generic "Any" values so only meaningful tags are shown */}
          <div className="flex flex-wrap gap-2">
            {job.industry !== "Any" && <TagPill>{job.industry}</TagPill>}
            {job.employmentType !== "Any" && (
              <TagPill>{job.employmentType}</TagPill>
            )}
            {job.homeOfficeOption !== "Any" && (
              <TagPill>{job.homeOfficeOption}</TagPill>
            )}
            {job.workExperience !== "Any" && (
              <TagPill>{job.workExperience}</TagPill>
            )}
          </div>

          {/* Main content */}
          <div className="space-y-6 border-t pt-6">
            {/* Intro / teaser */}
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {/* Job description */}
                Stellenbeschreibung
                </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {job.teaser ||
                  "No detailed description has been provided for this position yet."}
              </p>
            </section>

            {/* Key facts */}
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Positionsdetails
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <span className="font-medium">
                      {/* Type of employment: */}
                      Art der Beschäftigung:
                      </span>{" "}
                    {job.employmentType}
                  </li>
                  <li>
                    <span className="font-medium">
                      {/* Work model: */}
                      Arbeitsmodell:
                      </span>{" "}
                    {job.homeOfficeOption}
                  </li>
                  {job.subject && (
                    <li>
                      <span className="font-medium">
                        {/* Subject: */}
                        Betreff:
                        </span>{" "}
                      {job.subject}
                    </li>
                  )}
                  {job.discipline !== "Any" && (
                    <li>
                      <span className="font-medium">
                        {/* Discipline */}
                        Fachbereich:
                        </span>{" "}
                      {job.discipline}
                    </li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <span className="font-medium">Erfahrungsstufe:</span>{" "}
                    {job.workExperience}
                  </li>
                  {hasSalary && (
                    <li>
                      <span className="font-medium">Gehalt:</span>{" "}
                      {job.salary}
                    </li>
                  )}
                  {job.salaryUnit && (
                    <li>
                      <span className="font-medium">Gehaltsplan:</span>{" "}
                      {job.salaryUnit}
                    </li>
                  )}
                  <li>
                    <span className="font-medium">Veröffentlicht am:</span>{" "}
                    {formattedPublishedAt}
                  </li>
                  {formattedExpirationDate && (
                    <li>
                      <span className="font-medium">Läuft ab am:</span>{" "}
                      {formattedExpirationDate}
                    </li>
                  )}
                </ul>
              </div>
            </section>

            {/* How to apply */}
            <section>
              <h3 className="text-lg font-semibold mb-2">So bewerben Sie sich</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                Klicken Sie auf die Schaltfläche ‚Jetzt bewerben‘ unten und folgen Sie den nächsten Schritten,
                um Ihre Unterlagen einzureichen für {job.title} at {job.companyName}.
              </p>
              <Link href={`/public/jobs/${job.id}/apply`}>
                <Button className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-primary-foreground">
                  {/* Apply now */}
                  Jetzt bewerben
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}
