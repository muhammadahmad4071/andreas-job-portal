import { JobApplicationForm } from "@/components/apply/JobApplicationForm"
import { apiFetch } from "@/lib/api"

type PageProps = {
  params: { jobId: string }
}

type JobSummary = {
  id: string
  title: string
  company: string
}

async function getJobSummary(jobId: string): Promise<JobSummary> {
  try {
    // Assumes your backend exposes GET /jobs/{id}
    const data = await apiFetch(`/jobs/${jobId}`)

    return {
      id: String(data.id ?? jobId),
      title: data.title ?? "Job",
      company: data.company_name ?? data.organization?.title ?? "Company",
    }
  } catch (err) {
    console.error("Failed to load job summary:", err)

    // Fallback so the page still works even if the detail call fails
    return {
      id: jobId,
      title: "Job",
      company: "",
    }
  }
}

export default async function ApplyPage({ params }: PageProps) {
  const job = await getJobSummary(params.jobId)

  return <JobApplicationForm job={job} />
}
