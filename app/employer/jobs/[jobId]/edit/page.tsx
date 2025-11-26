// app/employer/jobs/[jobId]/edit/page.tsx

import { EditJobForm } from "@/components/employer-edit-jobs/EditJobForm"

type PageProps = {
  params: { jobId: string }
}

export default function EditJobPage({ params }: PageProps) {
  const { jobId } = params

  // EXACT SAME LAYOUT AS THE ADD JOB PAGE — no container-custom, no wrappers.
  return (
    <main className="min-h-screen bg-muted">
      <EditJobForm jobId={jobId} />
    </main>
  )
}
