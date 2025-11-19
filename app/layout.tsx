'use client'

import "./globals.css"
import { SiteHeader } from "@/components/layout/SiteHeader"
// import { Footer } from "@/components/footer" // if you have it
import { usePathname } from "next/navigation"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Disable header/footer for ALL employer pages
  const isEmployerRoute = pathname.startsWith("/employer")

  return (
    <html lang="en">
      <body className="bg-background text-foreground">

        {/* Show header only when NOT inside /employer */}
        {!isEmployerRoute && <SiteHeader />}

        {children}

        {/* Show footer only when NOT inside /employer */}
        {/* {!isEmployerRoute && <Footer />} */}

      </body>
    </html>
  )
}
