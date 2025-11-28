import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Pfälzer Jobs Logo"
              width={10}        // adjust if needed
              height={10}        // adjust if needed
              
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* NAVIGATION LINKS */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/public/jobs?employmentType=Apprenticeship"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Find an Apprenticeship
            </Link>
            <Link
              href="/public/jobs"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Find Jobs
            </Link>
            <Link
              href="/public/employer-list"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Discover Employers
            </Link>
            
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="text-primary hover:text-primary-dark"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
            <Link href="/employer/register">
              <Button variant="primary" className="hidden md:block">
                For Employers
              </Button>
            </Link>
            <Link href="/employer/login">
              <Button variant="outline" className="hidden md:block">
                Announce
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
