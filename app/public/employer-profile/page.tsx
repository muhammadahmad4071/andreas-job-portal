import { SiteHeader } from "@/components/layout/SiteHeader"
import { EmployerProfileHero } from "@/components/public-employer-profile/EmployerProfileHero"
import { EmployerAboutCard } from "@/components/public-employer-profile/EmployerAboutCard"
import { EmployerContactCard } from "@/components/public-employer-profile/EmployerContactCard"
import { EmployerBenefitsCard } from "@/components/public-employer-profile/EmployerBenefitsCard"
import { EmployerPicturesGallery } from "@/components/public-employer-profile/EmployerPicturesGallery"
import { EmployerJobsList } from "@/components/public-employer-profile/EmployerJobsList"
import Link from "next/link"
import Image from "next/image"

function PublicSiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-100 mt-auto">
      {/* Main Footer Content */}
      <div className="container-custom max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Applicant Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-4">Applicant</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-sm hover:text-white transition-colors">
                  Search Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-sm hover:text-white transition-colors">
                  Discover companies
                </Link>
              </li>
            </ul>
          </div>

          {/* Employer Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-4">Employer</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/post-job" className="text-sm hover:text-white transition-colors">
                  Post a job ad
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm hover:text-white transition-colors">
                  Products & Prices
                </Link>
              </li>
              <li>
                <Link href="/employer-profile" className="text-sm hover:text-white transition-colors">
                  My Employer Profile
                </Link>
              </li>
              <li>
                <Link href="/for-employers" className="text-sm hover:text-white transition-colors">
                  For Employers
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm hover:text-white transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-4">About us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm hover:text-white transition-colors">
                  Cookie settings
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-sm hover:text-white transition-colors">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-2">
              <Image src="/joblocal-logo.jpg" alt="joblocal" width={32} height={32} className="h-8 w-8" />
              <span className="text-sm font-medium">joblocal</span>
            </div>
            <p className="text-sm text-slate-400">Powered by joblocal - 2025</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function EmployerProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
     
      <main className="flex-1">
        <EmployerProfileHero />

        <section className="container-custom max-w-6xl mx-auto mt-10 space-y-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <EmployerAboutCard />
              <EmployerPicturesGallery />
              <EmployerJobsList />
            </div>

            <div className="space-y-6">
              <EmployerContactCard />
              <EmployerBenefitsCard />
            </div>
          </div>
        </section>
      </main>
      
    </div>
  )
}
