"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ApplicationProcessCard } from "@/components/employer-add-jobs/ApplicationProcessCard"
import { SalaryIndicationCard } from "@/components/employer-add-jobs/SalaryIndicationCard"
import { ReleaseDatesCard } from "@/components/employer-add-jobs/ReleaseDatesCard"
import { KeywordsCard } from "@/components/employer-add-jobs/KeywordsCard"
import { CompanyInformationCard } from "@/components/employer-add-jobs/CompanyInformationCard"
import { WorkplaceCard } from "@/components/employer-add-jobs/WorkplaceCard"
import { JobAdvertisementInfoCard } from "@/components/employer-add-jobs/JobAdvertisementInfoCard"
import { Button } from "@/components/ui/button"

export default function NewJobPage() {
  const [formData, setFormData] = useState({})

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("[v0] Form data:", formData)
  }

  return (
    <main className="min-h-screen bg-muted">
      {/* Logo Header */}
      <div className="bg-white border-b border-border py-6">
        <div className="flex justify-center">
            <Link href="/employer/home">
            <Image
                src="/logo.png"
                alt="Oberland JOBS"
                width={160}
                height={45}
                priority
                className="cursor-pointer"
            />
            </Link>
        </div>
        </div>

      {/* Page Header */}
      <div className="w-full md:w-[70%] mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">Create A New Job Post</h1>
        <p className="text-muted-foreground text-lg">
          Configure your job advertisement by filling out the sections below to attract the best candidates.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full md:w-[70%] mx-auto px-4 pb-16 space-y-8">
        <JobAdvertisementInfoCard />
        <CompanyInformationCard />
        <WorkplaceCard />
        <KeywordsCard />
        <SalaryIndicationCard />
        <ReleaseDatesCard />
        <ApplicationProcessCard />
        
        

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" size="lg">
            Abort
          </Button>
          <Button type="submit" size="lg" className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-semibold">
            Publish job
          </Button>
        </div>
      </form>
    </main>
  )
}
