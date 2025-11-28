// src/components/employer-home/EmployerHeader.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/employer/employer-home/UserMenu"

export function EmployerHeader() {
  return (
    <header className="bg-white border-b border-border">
      <div className="container-custom flex items-center justify-between py-4">

        {/* LEFT SIDE — Logo + Nav */}
        <div className="flex items-center gap-16">

          {/* Logo */}
          <Link href="/employer/home" className="flex items-center gap-3 mr-4">
            <Image
              src="/logo.png"
              alt="Oberland JOBS"
              width={140}
              height={40}
              className="cursor-pointer"
            />
          </Link>

          {/* Simple Nav (keep or remove as needed) */}
          <nav className="flex items-center gap-6 text-sm font-medium text-text-secondary">
            <Link href="#" className="hover:text-text-primary">Product</Link>
            <Link href="#" className="hover:text-text-primary">Shop</Link>
          </nav>
        </div>

        {/* RIGHT SIDE — Actions */}
        <div className="flex items-center gap-4">

          {/* Round Facebook Button */}
          <Button
            size="icon"
            className="bg-primary text-white hover:bg-primary-dark rounded-full h-10 w-10 flex items-center justify-center"
          >
            <Facebook className="h-4 w-4" />
          </Button>

          {/* “For Employers” CTA */}
          {/* <Link href="/employer/home">
          <Button className="bg-primary text-white hover:bg-primary-dark">
          
            For Employers
          </Button>
        </Link>    */}
          {/* USER MENU — contains Logout functionality */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
