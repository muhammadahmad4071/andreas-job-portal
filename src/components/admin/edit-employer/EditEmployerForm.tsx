"use client"

import { useEffect, useState, FormEvent, useRef } from "react"
import { apiFetch } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { Pencil } from "lucide-react"

type EditEmployerFormProps = {
  employerId: string
}

type EmployerDetail = {
  id: string
  name: string
  email: string
  username?: string
  salutation?: string
  status?: string
  createdAt?: string
  organization?: {
    title?: string
    address?: string
    postal_code?: string
    area?: string
    country?: string
    logo?: string
  }
}
function getAdminToken(): string | null {
  if (typeof document === "undefined") return null

  // Read admin_token cookie
  const match = document.cookie.match(/(?:^|; )admin_token=([^;]*)/)
  if (match) {
    return decodeURIComponent(match[1])
  }

  // Optional: fallback to localStorage if you ever stored it there
  if (typeof window !== "undefined") {
    return (
      window.localStorage.getItem("admin_token") ||
      window.localStorage.getItem("token") || // legacy fallback if still around
      null
    )
  }

  return null
}

export function EditEmployerForm({ employerId }: EditEmployerFormProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const [employer, setEmployer] = useState<EmployerDetail | null>(null)

  // Editable fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [status, setStatus] = useState<string>("")

  const [orgTitle, setOrgTitle] = useState("")
  const [orgAddress, setOrgAddress] = useState("")
  const [orgPostalCode, setOrgPostalCode] = useState("")
  const [orgArea, setOrgArea] = useState("")
  const [orgCountry, setOrgCountry] = useState("")

  // Logo upload
  const [logoPreview, setLogoPreview] = useState<string>("/placeholder.svg")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadEmployer() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await apiFetch(`/admin/users/${employerId}`, {
          method: "GET",
        })

        console.log("🔍 /users/:id raw response:", data)

        const org = data.organization ?? {}

        const mapped: EmployerDetail = {
          id: String(data.id ?? employerId),
          name: data.name ?? "",
          email: data.email ?? "",
          username: data.username ?? "",
          salutation: data.salutation ?? "",
          status: data.status ?? "",
          createdAt: data.created_at ?? undefined,
          organization: {
            title: org.title ?? "",
            address: org.address ?? "",
            postal_code: org.postal_code ?? "",
            area: org.area ?? "",
            country: org.country ?? "",
            logo: org.logo ?? "",
          },
        }

        if (!cancelled) {
          setEmployer(mapped)
          setName(mapped.name)
          setEmail(mapped.email)
          setUsername(mapped.username ?? "")
          setStatus(mapped.status ?? "")
          setOrgTitle(mapped.organization?.title ?? "")
          setOrgAddress(mapped.organization?.address ?? "")
          setOrgPostalCode(mapped.organization?.postal_code ?? "")
          setOrgArea(mapped.organization?.area ?? "")
          setOrgCountry(mapped.organization?.country ?? "")

          const initialLogo =
            mapped.organization?.logo && typeof mapped.organization.logo === "string"
              ? mapped.organization.logo
              : "/placeholder.svg"

          setLogoPreview(initialLogo)
          setLogoFile(null)
        }
      } catch (err: any) {
        console.error("Failed to load employer detail:", err)
        if (!cancelled) {
          setError(err?.message ?? "Failed to load employer details.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadEmployer()
    return () => {
      cancelled = true
    }
  }, [employerId])

  const handleLogoClick = () => fileInputRef.current?.click()

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  // ===========================
  // 🔥 UPDATE EMPLOYER
  // ===========================
  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault()
  //   setError(null)
  //   setSuccessMessage("")

  //   try {
  //     const formData = new FormData()
  //     formData.append("_method", "PATCH")

  //     formData.append("name", name.trim())
  //     formData.append("email", email.trim())
  //     if (username.trim()) formData.append("username", username.trim())
  //     if (status) formData.append("status", status)

  //     const adminToken = getAdminToken();

  //     formData.append("organization[title]", orgTitle.trim())
  //     formData.append("organization[address]", orgAddress.trim())
  //     formData.append("organization[postal_code]", orgPostalCode.trim())
  //     formData.append("organization[area]", orgArea.trim())
  //     formData.append("organization[country]", orgCountry.trim())

  //     if (logoFile) {
  //       formData.append("organization_logo", logoFile)
  //     }

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${employerId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Accept: "application/json",
  //           ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
  //           //Authorization: `Bearer ${localStorage.getItem(adminToken) || ""}`,
  //         },
  //         body: formData,
  //       }
  //     )

  //     const data = await response.json().catch(() => null)
  //     console.log("🔵 Update response:", data)

  //     if (!response.ok) {
  //       throw new Error(
  //         data?.message || `Failed to update employer (${response.status})`
  //       )
  //     }

  //     // SUCCESS
  //     setSuccessMessage("Employer updated successfully!")

  //     // Redirect in 2 sec
  //     setTimeout(() => {
  //       window.location.href = "/admin/all-employers"
  //     }, 2000)

  //   } catch (err: any) {
  //     console.error("❌ Employer update failed:", err)
  //     setError(err?.message || "Failed to update employer.")
  //   }
  // }

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setError(null)
  setSuccessMessage("")

  try {
    const formData = new FormData()
    formData.append("_method", "PATCH")

    formData.append("name", name.trim())
    formData.append("email", email.trim())
    if (username.trim()) formData.append("username", username.trim())
    if (status) formData.append("status", status)

    formData.append("organization[title]", orgTitle.trim())
    formData.append("organization[address]", orgAddress.trim())
    formData.append("organization[postal_code]", orgPostalCode.trim())
    formData.append("organization[area]", orgArea.trim())
    formData.append("organization[country]", orgCountry.trim())

    if (logoFile) {
      formData.append("organization_logo", logoFile)
    }

    const adminToken = getAdminToken()

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${employerId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: formData,
        //credentials: "include", // just in case backend also uses cookies
      }
    )

    const data = await response.json().catch(() => null)
    console.log("🔵 Update response:", data)

    if (!response.ok) {
      throw new Error(
        data?.message || `Failed to update employer (${response.status})`
      )
    }

    setSuccessMessage("Employer updated successfully!")

    setTimeout(() => {
      //window.location.href = "/admin/all-employers"
    }, 2000)
  } catch (err: any) {
    console.error("❌ Employer update failed:", err)
    setError(err?.message || "Failed to update employer.")
  }
}


  // ===========================
  // UI RENDER
  // ===========================
  if (isLoading) {
    return (
      <main className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading employer…</p>
      </main>
    )
  }

  if (error && !employer) {
    return (
      <main className="min-h-screen bg-muted flex flex-col items-center justify-center">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted">
      <div className="w-full py-8">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Employer</h1>
          <p className="text-muted-foreground">
            Update employer details, organization info and logo.
          </p>
        </div>
      </div>

      <div className="pb-10">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <Card className="bg-white shadow-sm border">
            <CardContent className="p-6 md:p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                
                {/* ACCOUNT INFO */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Account</h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>
                </div>

                {/* ORGANIZATION */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Organization</h2>

                  {/* Logo */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Company Logo</p>

                    <div className="flex items-center gap-4">
                      <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={logoPreview}
                          alt="Company Logo"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleLogoClick}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
                        >
                          <Pencil className="h-5 w-5 text-white" />
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />

                      <div className="text-xs text-muted-foreground">
                        <p>Click logo to upload new image.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Company Name</Label>
                      <Input value={orgTitle} onChange={(e) => setOrgTitle(e.target.value)} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Input value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        value={orgPostalCode}
                        onChange={(e) => setOrgPostalCode(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>City / Area</Label>
                      <Input
                        value={orgArea}
                        onChange={(e) => setOrgArea(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 md:max-w-sm">
                      <Label>Country</Label>
                      <Input
                        value={orgCountry}
                        onChange={(e) => setOrgCountry(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* BOTTOM SUCCESS + ERROR */}
                <div className="mt-2">

                  {successMessage && (
                    <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700 border border-green-300">
                      {successMessage}
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
                      {error}
                    </div>
                  )}

                  {/* SAVE BUTTON */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-black font-semibold"
                    >
                      Save changes
                    </Button>
                  </div>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
