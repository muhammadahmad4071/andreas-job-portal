// app/public/employer-profile/[employerId]/page.tsx

import { EmployerProfileHero } from "@/components/public-employer-profile/EmployerProfileHero"
import { EmployerAboutCard } from "@/components/public-employer-profile/EmployerAboutCard"
import { EmployerContactCard } from "@/components/public-employer-profile/EmployerContactCard"
import { EmployerBenefitsCard } from "@/components/public-employer-profile/EmployerBenefitsCard"
import { EmployerPicturesGallery } from "@/components/public-employer-profile/EmployerPicturesGallery"
import { EmployerJobsList } from "@/components/public-employer-profile/EmployerJobsList"
import { apiFetch } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"

type PageProps = {
  params: { employerId: string }
}

// ---- Backend-mapped types for this page ----

type EmployerJob = {
  id: number
  title: string
  workplaceLocation: string | null
  companyName: string | null
  companyLogo: string | null
  homeOffice: string | null
  subject: string | null
  minSalary: string | null
  maxSalary: string | null
  salaryUnit: string | null
  status: string
  releaseDate: string | null
  expirationDate: string | null
}

type EmployerProfile = {
  id: number
  name: string
  email: string
  status: string
  username: string
  jobsCount: number
  activeJobsCount: number
  emailVerifiedAt: string
  organization: {
    id: number
    title: string
    address: string | null
    postalCode: string | null
    area: string | null
    country: string | null
    size: string | null
    logo: string | null
  }
  jobs: EmployerJob[]
}

function mapApiEmployerToProfile(api: any): EmployerProfile {
  const org = api.organization || {}

  const jobs: EmployerJob[] = Array.isArray(api.jobs)
    ? api.jobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        workplaceLocation: job.workplace_location ?? null,
        companyName: job.company_name ?? null,
        companyLogo: job.company_logo ?? null,
        homeOffice: job.home_office ?? null,
        subject: job.subject ?? null,
        minSalary: job.min_salary ?? null,
        maxSalary: job.max_salary ?? null,
        salaryUnit: job.salary_unit ?? null,
        status: job.status,
        releaseDate: job.release_date ?? null,
        expirationDate: job.expiration_date ?? null,
      }))
    : []

  return {
    id: api.id,
    name: api.name,
    email: api.email,
    status: api.status,
    username: api.username,
    jobsCount: api.jobs_count ?? jobs.length,
    activeJobsCount: api.active_jobs_count ?? jobs.length,
    emailVerifiedAt: api.email_verified_at,
    organization: {
      id: org.id,
      title: org.title,
      address: org.address ?? null,
      postalCode: org.postal_code ?? null,
      area: org.area ?? null,
      country: org.country ?? null,
      size: org.size ?? null,
      logo: org.logo ?? null,
    },
    jobs,
  }
}

// function PublicSiteFooter() {
//   return (
//     <footer className="bg-slate-900 text-slate-100 mt-auto">
//       {/* Main Footer Content */}
//       <div className="container-custom max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
//           {/* Applicant Section */}
//           <div>
//             <h3 className="text-xs font-semibold uppercase tracking-wide mb-4">Applicant</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="/jobs" className="text-sm hover:text-white transition-colors">
//                   Search Jobs
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/companies" className="text-sm hover:text-white transition-colors">
//                   Discover companies
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Employer Section */}
//           <div>
//             <h3 className="text-xs font-semibold uppercase tracking-wide mb-4">Employer</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="/post-job" className="text-sm hover:text-white transition-colors">
//                   Post a job ad
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/products" className="text-sm hover:text-white transition-colors">
//                   Products & Prices
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/employer-profile" className="text-sm hover:text-white transition-colors">
//                   My Employer Profile
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/for-employers" className="text-sm hover:text-white transition-colors">
//                   For Employers
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/register" className="text-sm hover:text-white transition-colors">
//                   Register
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/faqs" className="text-sm hover:text-white transition-colors">
//                   FAQs
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* About Us Section */}
//           <div>
//             <h3 className="text-xs font-semibold uppercase tracking-wide mb-4">About us</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="/contact" className="text-sm hover:text-white transition-colors">
//                   Contact
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/terms" className="text-sm hover:text-white transition-colors">
//                   Terms & Conditions
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/privacy" className="text-sm hover:text-white transition-colors">
//                   Privacy policy
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/cookies" className="text-sm hover:text-white transition-colors">
//                   Cookie settings
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/imprint" className="text-sm hover:text-white transition-colors">
//                   Imprint
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-slate-700">
//         <div className="container-custom max-w-6xl mx-auto">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
//             <div className="flex items-center gap-2">
//               <Image src="/joblocal-logo.jpg" alt="joblocal" width={32} height={32} className="h-8 w-8" />
//               <span className="text-sm font-medium">joblocal</span>
//             </div>
//             <p className="text-sm text-slate-400">Powered by joblocal - 2025</p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

export default async function EmployerProfilePage({ params }: PageProps) {
  const { employerId } = params

  let profile: EmployerProfile | null = null

  try {
    const apiData = await apiFetch(`/employers/${employerId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    console.log("📦 Employer Profile API Raw Response:", apiData)

    profile = mapApiEmployerToProfile(apiData)
    console.log("✅ Mapped Employer Profile:", profile)
  } catch (err) {
    console.error("❌ Error loading employer profile:", err)
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Employer profile could not be loaded.</p>
        </main>
        {/* <PublicSiteFooter /> */}
      </div>
    )
  }

  const { organization, jobs } = profile
  const locationParts = [organization.area, organization.country].filter(Boolean)
  const locationLabel = locationParts.join(", ")

  // Map jobs for the jobs list component (simple UI shape)
  const jobsForList = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.companyName || organization.title || profile.name,
    location: job.workplaceLocation || locationLabel,
    logoSrc: job.companyLogo || organization.logo || null,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <main className="flex-1">
        <EmployerProfileHero
          name={organization.title || profile.name}
          logoUrl={organization.logo || null}
          street={organization.address}
          postcode={organization.postalCode}
          city={organization.area}
          country={organization.country}
        />

        <section className="container-custom max-w-6xl mx-auto mt-10 space-y-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <EmployerAboutCard
                size={organization.size}
                activeJobsCount={profile.activeJobsCount}
                emailVerifiedAt={profile.emailVerifiedAt} // from backend
              />

              <EmployerPicturesGallery />

              <EmployerJobsList jobs={jobsForList} />
            </div>

            <div className="space-y-6">
              <EmployerContactCard
                name={profile.name}
                email={profile.email}
              />

              <EmployerBenefitsCard />
            </div>
          </div>
        </section>
      </main>

      {/* <PublicSiteFooter /> */}
    </div>
  )
}
