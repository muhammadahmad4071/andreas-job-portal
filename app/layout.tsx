'use client'

import "./globals.css"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { usePathname } from "next/navigation"
// ⬇️ If you have a Footer component, keep this import. If not, delete this line & the Footer JSX.
// import { Footer } from "@/components/footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // true ONLY on /employer/register (and deeper, if any)
  const isEmployerRegister = pathname.startsWith("/employer/register")

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {/* Show main header on all pages EXCEPT employer/register */}
        {!isEmployerRegister && <SiteHeader />}

        {children}

        {/* Show footer on all pages EXCEPT employer/register */}
        {/* If you don't have a Footer component, remove this block */}
        {/* {!isEmployerRegister && <Footer />} */}
      </body>
    </html>
  )
}
