import { JobDetailLayout } from "@/components/job-details/JobDetailPage"

// Type definition for job detail data
export type JobDetail = {
  id: string
  title: string
  category: string
  companyName: string
  companyLogo?: string
  location: string
  salaryRange: string
  employmentType: string
  professionalExperience: string
  isTopJob: boolean
  aboutUs: string
  yourTasks: string[]
  whatWeLookingFor: string[]
  whyJoinUs: string[]
  hiringProcess: string[]
  workplace: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function getJobById(jobId: string): Promise<JobDetail> {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to load job: ${res.status}`)
  }

  const apiJob = await res.json()
  // console.log("Job detail response:", apiJob)

  // ---- Salary mapping (min_salary / max_salary) ----
  const minSalary = apiJob.min_salary
  const maxSalary = apiJob.max_salary

  let salaryRange = "Salary not specified"
  if (minSalary != null && maxSalary != null) {
    salaryRange = `€${minSalary} - €${maxSalary}`
  } else if (minSalary != null) {
    salaryRange = `From €${minSalary}`
  } else if (maxSalary != null) {
    salaryRange = `Up to €${maxSalary}`
  }

  // ---- Employment type (employment_types[0]) ----
  const rawEmploymentType =
    Array.isArray(apiJob.employment_types) && apiJob.employment_types.length > 0
      ? String(apiJob.employment_types[0]).toLowerCase()
      : ""

  let employmentType = "Employment"
  if (rawEmploymentType.includes("full")) {
    employmentType = "Full-time"
  } else if (rawEmploymentType.includes("part")) {
    employmentType = "Part-time"
  } else if (rawEmploymentType.includes("mini")) {
    employmentType = "Mini-job"
  }

  // ---- Professional experience mapping ----
  const rawExperience = String(apiJob.professional_experience ?? "").toLowerCase()
  let professionalExperience = apiJob.professional_experience ?? ""
  if (rawExperience === "1-3") {
    professionalExperience = "With professional experience (1 to 3 years)"
  } else if (rawExperience === "3-5") {
    professionalExperience = "With professional experience (3 to 5 years)"
  } else if (rawExperience === "5+") {
    professionalExperience = "With professional experience (5+ years)"
  }

  const jobDetail: JobDetail = {
    id: String(apiJob.id ?? jobId),
    title: apiJob.title ?? "Job",
    category: apiJob.subject ?? apiJob.professional_discipline ?? "",
    companyName: apiJob.company_name ?? apiJob.organization?.title ?? "Company",
    companyLogo: apiJob.company_logo ?? undefined,
    location: apiJob.workplace_location ?? "Location not specified",
    salaryRange,
    employmentType,
    professionalExperience,
    // you can wire this to a real flag later if backend supports it
    isTopJob: false,
    aboutUs: apiJob.description ?? "No description provided yet.",
    yourTasks: Array.isArray(apiJob.required_skills)
      ? apiJob.required_skills
      : [],
    whatWeLookingFor: Array.isArray(apiJob.required_educational_qualifications)
      ? apiJob.required_educational_qualifications
      : [],
    // backend doesn’t provide these yet – keep as empty arrays for now
    whyJoinUs: [],
    hiringProcess: [],
    workplace: apiJob.workplace_location ?? "",
  }

  return jobDetail
}

type PageProps = {
  params: { jobId: string }
}

export default async function JobDetailPage({ params }: PageProps) {
  const job = await getJobById(params.jobId)

  return <JobDetailLayout job={job} />
}
