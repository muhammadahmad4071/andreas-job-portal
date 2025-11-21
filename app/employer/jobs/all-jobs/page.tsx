// app/employer/jobs/all-jobs/page.tsx

import { EmployerSidebar } from "@/components/employer-home/EmployerSidebar"
import { EmployerHeader } from "@/components/employer-home/EmployerHeader"
import { EmployerFooter } from "@/components/employer-home/EmployerFooter"
import { AllJobsPageShell } from "@/components/all-jobs/AllJobsPageShell"

export default function AllJobsPage() {
  return (
    <div className="min-h-screen flex bg-muted">
      {/* Left sidebar, full height */}
      <EmployerSidebar />

      {/* Right side: header + main content + footer */}
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
        <EmployerHeader />

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <div className="w-full py-8">
            {/* match employer home layout width */}
            <div className="container-custom max-w-5xl mx-auto">
              <AllJobsPageShell />
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <EmployerFooter />
      </div>
    </div>
  )
}
