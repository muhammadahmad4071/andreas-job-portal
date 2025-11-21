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

// Mock data - ready to be replaced with API calls
const MOCK_JOBS: Record<string, JobDetail> = {
  "housekeeping-maid": {
    id: "housekeeping-maid",
    title: "Housekeeping / Maid",
    category: "Hotels and restaurants",
    companyName: "Kesma Establishment",
    location: "82467 Garmisch-Partenkirchen, Germany",
    salaryRange: "€14 – €16 per hour",
    employmentType: "Permanent Employment",
    professionalExperience: "With professional experience (1 to 3 years)",
    isTopJob: true,
    aboutUs: "We are still looking for a dedicated chambermaid for our private household to support our team.",
    yourTasks: [
      "Cleaning and maintenance of guest rooms",
      "Help out in the laundry if necessary",
      "Ensuring cleanliness in all common areas",
      "Reporting damage or necessary repairs",
    ],
    whatWeLookingFor: [
      "Required skills: Experience in housekeeping or a similar role",
      "Good communication skills",
      "Ability to work in a team and reliability",
      "Good knowledge of German and English",
    ],
    whyJoinUs: ["Pleasant working environment", "Flexible working hours", "small, long-standing team"],
    hiringProcess: [
      "Receipt of applications and pre-selection",
      "Invitation to an interview",
      "Practical exercise or trial working day",
      "Final decision and offer",
    ],
    workplace: "Location: Garmisch Partenkirchen",
  },
  "dermatology-assistant": {
    id: "dermatology-assistant",
    title: "Medical pedicure (m/f/d)",
    category: "Healthcare",
    companyName: "Dermatologist Oberland",
    location: "Tegernseer Str. 3, 83703 Gmund am Tegernsee, Germany",
    salaryRange: "€18 – €22 per hour",
    employmentType: "Permanent Employment",
    professionalExperience: "With professional experience (1 to 3 years)",
    isTopJob: true,
    aboutUs:
      "Hautarzt Oberland - with three locations in Gmund, Miesbach and Holzkirchen, we are one of the top addresses in the region. We are all about modern dermatology, podiatry, laser medicine, aesthetic treatments and, above all, the people we accompany every day.",
    yourTasks: [
      "Medical foot care with heart and know-how.",
      "You work independently, keeping an eye on the team.",
      "Advising, treating and making your patients happy.",
      "Appointments, documentation and billing - you have the overview.",
    ],
    whatWeLookingFor: [
      "You have completed training in foot care or podiatry.",
      "You have experience in foot care or podiatry (would be great!)",
      "You work in an organized and independent way - you know what you are doing.",
      "Stressful situations? No problem, you stay calm, focused and keep an overview.",
      "You enjoy working with people and bring positive energy.",
      "Do you know yourself with cosmetic treatments? We look forward to your know-how!",
    ],
    whyJoinUs: [
      "Team that rocks! Look forward to an environment in which respect and appreciation are at the top of the list.",
      "Work-life balance at its best! 30 days of vacation (freely selectable) + no work on 24./31.12.",
      "More money, more recognition! Because good work earns good money.",
      "Long-term and safe! With us, you have a stable career perspective through over 45 years of family tradition.",
    ],
    hiringProcess: [
      "Receipt of applications and pre-selection",
      "Invitation to an interview",
      "Practical exercise or trial working day",
      "Final decision and offer",
    ],
    workplace: "Location: Gmund am Tegernsee",
  },
}

// Backend-ready helper function
async function getJobById(jobId: string): Promise<JobDetail> {
  // For now, return mock data
  const job = MOCK_JOBS[jobId] ?? MOCK_JOBS["housekeeping-maid"]

  // Later, replace with actual API call:
  // const res = await fetch(`${process.env.API_URL}/jobs/${jobId}`, {
  //   cache: "no-store"
  // })
  // if (!res.ok) throw new Error("Job not found")
  // return res.json()

  return job
}

type PageProps = {
  params: Promise<{ jobId: string }>
}

export default async function JobDetailPage({ params }: PageProps) {
  const { jobId } = await params
  const job = await getJobById(jobId)

  return <JobDetailLayout job={job} />
}
