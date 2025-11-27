"use client"

import { useState, useEffect, useCallback } from "react"
import { EmployerSidebar } from "@/components/employer-home/EmployerSidebar"
import { EmployerHeader } from "@/components/employer-home/EmployerHeader"
import { EmployerFooter } from "@/components/employer-home/EmployerFooter"
import { EmployerProfileHeaderCard } from "@/components/employer-profile/EmployerProfileHeaderCard"
import { EmployerAboutCard } from "@/components/employer-profile/EmployerAboutCard"
// import { EmployerContactCard } from "@/components/employer-profile/EmployerContactCard"
import { EmployerAttachmentsCard } from "@/components/employer-profile/EmployerAttachmentsCard"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function EmployerProfilePage() {
  const [activeSection, setActiveSection] = useState<
    null | "profile" | "about" | "contact" | "attachments"
  >(null)

  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (!token) {
      console.error("[EmployerProfilePage] No token found in localStorage")
      setError("No authentication token found.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      console.log("🔥 /me PROFILE RESPONSE:", data)

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch profile")
      }

      setProfile(data)
    } catch (err: any) {
      console.error("[EmployerProfilePage] Failed to load profile:", err)
      setError(err?.message ?? "Failed to load profile.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <EmployerSidebar />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <EmployerHeader />

        {/* Main Content */}
        <main className="flex-1 bg-muted">
          {/* Top grey banner */}
          <div className="bg-slate-600 h-32 w-full" />

          <div className="w-full -mt-16 pb-8">
            <div className="container-custom max-w-6xl mx-auto space-y-6">
              {/* Loading / error messages */}
              {loading && (
                <p className="text-sm text-muted-foreground">
                  Loading employer profile…
                </p>
              )}
              {error && !loading && (
                <p className="text-sm text-red-600">
                  Error loading profile: {error}
                </p>
              )}

              {/* Profile Header Card */}
              {(activeSection === null || activeSection === "profile") && (
                <EmployerProfileHeaderCard
                  profile={profile}
                  isEditing={activeSection === "profile"}
                  onEdit={() => setActiveSection("profile")}
                  onCancel={() => setActiveSection(null)}
                  onProfileRefresh={fetchProfile}
                />
              )}

              {/* Lower section cards */}
              {activeSection === null && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column - About (wider) */}
                  <div className="lg:col-span-2">
                    <EmployerAboutCard
                      isEditing={false}
                      onEdit={() => setActiveSection("about")}
                      onCancel={() => setActiveSection(null)}
                      organizationSize={profile?.organization?.size}
                      onProfileRefresh={fetchProfile}
                    />
                  </div>

                  {/* Right column - Contact and Attachments */}
                  <div className="space-y-6">
                    {/* --- CONTACT CARD COMMENTED OUT --- */}
                    {/*
                    <EmployerContactCard
                      isEditing={false}
                      onEdit={() => setActiveSection("contact")}
                      onCancel={() => setActiveSection(null)}
                    />
                    */}
                    {/* Attachments Card (also currently commented by you) */}
                    {/*
                    <EmployerAttachmentsCard
                      isEditing={false}
                      onEdit={() => setActiveSection("attachments")}
                      onCancel={() => setActiveSection(null)}
                    />
                    */}
                  </div>
                </div>
              )}

              {/* Edit mode - show only the active section */}

              {activeSection === "about" && (
                <EmployerAboutCard
                  isEditing={true}
                  onEdit={() => setActiveSection("about")}
                  onCancel={() => setActiveSection(null)}
                  organizationSize={profile?.organization?.size}
                  onProfileRefresh={fetchProfile}
                />
              )}

              {/* --- CONTACT EDIT SECTION COMMENTED OUT --- */}
              {/*
              {activeSection === "contact" && (
                <EmployerContactCard
                  isEditing={true}
                  onEdit={() => setActiveSection("contact")}
                  onCancel={() => setActiveSection(null)}
                />
              )}
              */}

              {activeSection === "attachments" && (
                <EmployerAttachmentsCard
                  isEditing={true}
                  onEdit={() => setActiveSection("attachments")}
                  onCancel={() => setActiveSection(null)}
                />
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <EmployerFooter />
      </div>
    </div>
  )
}
