"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  UserCircle,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/employer/home", hasSubmenu: false },
  { icon: Briefcase, label: "Jobs", href: "/employer/jobs/all-jobs", hasSubmenu: false },
  // { icon: Users, label: "Candidacies", href: "/employer/candidacies", hasSubmenu: false },
  // {
  //   icon: FileText,
  //   label: "Contract & Products",
  //   href: "/employer/contracts",
  //   hasSubmenu: true,
  // },
  // { icon: Building2, label: "Enterprise", href: "/employer/enterprise", hasSubmenu: false },
  { icon: UserCircle, label: "Employer Profile", href: "/employer/profile", hasSubmenu: false },
]

export function EmployerSidebar() {
  const pathname = usePathname()

  // Open contract submenu by default when on a contracts route
  const [isContractOpen, setIsContractOpen] = useState(
    pathname.startsWith("/employer/contracts")
  )

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-border flex-col">
      <nav className="flex-1 py-6">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (!item.hasSubmenu && pathname.startsWith(item.href)) ||
            (item.hasSubmenu && pathname.startsWith(item.href))

          return (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={(e) => {
                  if (item.hasSubmenu) {
                    e.preventDefault()
                    setIsContractOpen((prev) => !prev)
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                  isActive
                    ? "text-primary bg-primary/5 border-l-4 border-primary"
                    : "text-foreground hover:bg-muted hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.hasSubmenu && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isContractOpen && "rotate-180"
                    )}
                  />
                )}
              </Link>

              {/* later you can render submenu items here when isContractOpen is true */}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
