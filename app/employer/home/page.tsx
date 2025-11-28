import { EmployerSidebar } from "@/components/employer/employer-home/EmployerSidebar"
import { EmployerHeader } from "@/components/employer/employer-home/EmployerHeader"
import { EmployerFooter } from "@/components/employer/employer-home/EmployerFooter"
import { WelcomeBanner } from "@/components/employer/employer-home/WelcomeBanner"
// import { VerificationCard } from "@/components/employer/employer-home/VerificationCard"
import { EmptyJobsCard } from "@/components/employer/employer-home/EmptyJobsCard"
import { UserMenu } from "@/components/employer/employer-home/UserMenu"
import { EmployerApplicationsSection } from "@/components/employer/employer-home/EmployerApplicationsSection"

import { Button } from "@/components/ui/button"
import { Facebook, BriefcaseBusiness } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function EmployerDashboard() {
  return (
    // (1) & (2) Sidebar goes to very top, header starts AFTER sidebar
    <div className="min-h-screen flex bg-muted">
      {/* Left sidebar, full height */}
      <EmployerSidebar />

      {/* Right side: header + main content + footer */}
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
        <EmployerHeader />

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {/* (5) Centered/narrower content: extra padding + max-w-5xl */}
          <div className="w-full py-8">
            <div className="container-custom max-w-5xl mx-auto space-y-8">
              {/* Welcome banner */}
              <WelcomeBanner />

              {/* Overview of job advertisements */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-text-primary">
                  Overview of job advertisements
                </h2>

                {/* <VerificationCard /> */}
                <EmptyJobsCard />
              </section>

              {/* Your applications */}
              <EmployerApplicationsSection />
            </div>
          </div>
        </main>

        {/* FOOTER (already starts after sidebar, like header now) */}
        <EmployerFooter />
      </div>
    </div>
  )
}
