"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Building2, ChevronRight, Check, Share2, Crown } from "lucide-react"
import type { JobDetail } from "@/../../app/public/jobs/[jobId]/page"

type JobDetailLayoutProps = {
  job: JobDetail
}

export function JobDetailLayout({ job }: JobDetailLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasTasks = job.yourTasks && job.yourTasks.length > 0
  const hasRequirements = job.whatWeLookingFor && job.whatWeLookingFor.length > 0
  const hasWhyJoin = job.whyJoinUs && job.whyJoinUs.length > 0
  const hasHiringProcess = job.hiringProcess && job.hiringProcess.length > 0
  const hasLanguages = job.languages && job.languages.length > 0
  const hasContactEmails = job.contactEmails && job.contactEmails.length > 0

  return (
    <>
      {/* Dark grey header banner */}
      <div className="bg-[#5A6470] h-40 w-full" />

      <div className="bg-muted min-h-screen -mt-24">
        <div className="container-custom py-10">
          <div className="max-w-5xl mx-auto">
            <Card className="rounded-2xl shadow-lg border bg-white">
              {/* Breadcrumb and Apply Button */}
              <div className="p-6 sm:p-8 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    <Link href="/public/jobs" className="text-[#FDB714] hover:underline">
                      Jobs
                    </Link>
                    {job.category && (
                      <>
                        <ChevronRight className="w-4 h-4" />
                        <Link
                          href={`/public/jobs?category=${encodeURIComponent(job.category)}`}
                          className="text-[#FDB714] hover:underline"
                        >
                          {job.category}
                        </Link>
                      </>
                    )}
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground">{job.title}</span>
                  </div>
                  <Link href={`/public/jobs/${job.id}/apply`}>
                    <Button
                      size="lg"
                      className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-primary-foreground whitespace-nowrap"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Job Header */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start gap-6">
                  {/* Company Logo / Initials */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center">
                    {job.companyLogo ? (
                      <Image
                        src={job.companyLogo}
                        alt={job.companyName}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-xl">
                        {job.companyName.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{job.title}</h1>
                      {job.isTopJob && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FDB714] text-white">
                          <Crown className="w-3 h-3" />
                          Top Job
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#FDB714]">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{job.companyName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {job.category && <span>{job.category} | </span>}
                        <span>{job.employmentType}</span>
                        {job.professionalExperience && (
                          <>
                            {" | "}
                            <span>{job.professionalExperience}</span>
                          </>
                        )}
                        {job.salaryRange && (
                          <>
                            {" | "}
                            <span>
                              {job.salaryRange}
                              {job.salaryUnit ? ` (${job.salaryUnit})` : ""}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-4 pt-6 border-t">
                  <h2 className="text-xl font-semibold text-foreground">Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-medium">Job Title:</span> {job.title}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-medium">Location:</span> {job.workplace || job.location}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-medium">Employment Type:</span> {job.employmentType}
                      </p>
                    </div>
                    {job.homeOffice && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-medium">Home office:</span> {job.homeOffice}
                        </p>
                      </div>
                    )}
                    {job.professionalExperience && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-medium">Experience:</span> {job.professionalExperience}
                        </p>
                      </div>
                    )}
                    {job.salaryRange && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-medium">Salary:</span>{" "}
                          {job.salaryRange}
                          {job.salaryUnit ? ` (${job.salaryUnit})` : ""}
                        </p>
                      </div>
                    )}
                    {hasLanguages && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-medium">Language skills:</span>{" "}
                          {job.languages.join(", ")}
                        </p>
                      </div>
                    )}
                    {job.releaseDate && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-medium">Published on:</span> {job.releaseDate}
                        </p>
                      </div>
                    )}
                    {job.expirationDate && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-medium">Valid until:</span> {job.expirationDate}
                        </p>
                      </div>
                    )}
                    {hasContactEmails && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FDB714] mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-medium">Contact:</span>{" "}
                          {job.contactEmails.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* About Us Section */}
                {job.aboutUs && (
                  <div className="space-y-4 pt-6 border-t">
                    <h2 className="text-xl font-semibold text-foreground">About us</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{job.aboutUs}</p>
                  </div>
                )}

                {/* Your Tasks Section */}
                {hasTasks && (
                  <div className="space-y-4 pt-6 border-t">
                    <h2 className="text-xl font-semibold text-foreground">Your tasks</h2>
                    <div className="space-y-3">
                      {job.yourTasks.map((task, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#FDB714] mt-1 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What We Are Looking For Section */}
                {hasRequirements && (
                  <div className="space-y-4 pt-6 border-t">
                    <h2 className="text-xl font-semibold text-foreground">What we are looking for</h2>
                    <div className="space-y-3">
                      {job.whatWeLookingFor.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#FDB714] mt-1 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{item}</p>
                        </div>
                      ))}
                      {hasLanguages && (
                        <div className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#FDB714] mt-1 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            Language skills: {job.languages.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Why You Should Come to Us Section (only if backend provides something later) */}
                {hasWhyJoin && (
                  <div className="space-y-4 pt-6 border-t">
                    <h2 className="text-xl font-semibold text-foreground">Why you should come to us</h2>
                    <div className="space-y-3">
                      {job.whyJoinUs.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#FDB714] mt-1 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- EXPANDABLE PART STARTS HERE --- */}
                {isExpanded && (
                  <>
                    {/* Our Hiring Process Section */}
                    {hasHiringProcess && (
                      <div className="space-y-4 pt-6 border-t">
                        <h2 className="text-xl font-semibold text-foreground">Our Hiring Process</h2>
                        <div className="space-y-3">
                          {job.hiringProcess.map((step, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Check className="w-4 h-4 text-[#FDB714] mt-1 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workplace Section */}
                    {job.workplace && (
                      <div className="space-y-4 pt-6 border-t">
                        <h2 className="text-xl font-semibold text-foreground">Workplace</h2>
                        <div className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#FDB714] mt-1 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{job.workplace}</p>
                        </div>
                      </div>
                    )}

                    {/* Professional Experience Section */}
                    {job.professionalExperience && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">Professional experience</h3>
                        <p className="text-sm text-muted-foreground">{job.professionalExperience}</p>
                      </div>
                    )}

                    {/* Salary Range Section */}
                    {job.salaryRange && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">Salary range</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.salaryRange}
                          {job.salaryUnit ? ` (${job.salaryUnit})` : ""}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {/* --- EXPANDABLE PART ENDS HERE --- */}

                {/* Show More/Less Toggle */}
                <div className="pt-4">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[#FDB714] hover:underline text-sm font-medium border border-[#FDB714] px-4 py-2 rounded-md"
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="border-[#FDB714] text-[#FDB714] hover:bg-[#FDB714]/10 bg-transparent"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Divide
                  </Button>

                  {/* Mobile Apply Button with link */}
                  <Link href={`/public/jobs/${job.id}/apply`} className="sm:hidden w-full">
                    <Button
                      size="lg"
                      className="w-full bg-[#FDB714] hover:bg-[#FDB714]/90 text-primary-foreground"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
