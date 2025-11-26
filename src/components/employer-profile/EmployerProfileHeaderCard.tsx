"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Crown } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmployerProfileHeaderCardProps {
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  profile: any | null
  onProfileRefresh: () => Promise<void> | void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function EmployerProfileHeaderCard({
  isEditing,
  onEdit,
  onCancel,
  profile,
  onProfileRefresh,
}: EmployerProfileHeaderCardProps) {
  const org = profile?.organization

  // ---- READ-ONLY VALUES FROM API ----
  const companyTitle = org?.title ?? "Company Name"
  const headOfficeArea = org?.area ?? "Head office area not specified"
  const address = org?.address ?? "No address provided"
  const country = org?.country ?? "Country not specified"

  // backend returns logo path in organization.logo
  const logoPath: string | undefined = org?.logo
  const logoSrc =
    logoPath && API_BASE_URL
      ? `${API_BASE_URL}/storage/${logoPath}`
      : "/placeholder.svg"

  // ---- EDITABLE STATE ----
  const [editCompanyTitle, setEditCompanyTitle] = useState("")
  const [editHeadOfficeArea, setEditHeadOfficeArea] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editCountry, setEditCountry] = useState("")

  // image upload state
  const [logoPreview, setLogoPreview] = useState<string>(logoSrc)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔁 When entering edit mode OR when profile changes,
  // sync edit fields & preview with current API data
  useEffect(() => {
    if (isEditing) {
      setEditCompanyTitle(companyTitle)
      setEditHeadOfficeArea(headOfficeArea)
      setEditAddress(address)
      setEditCountry(country)
      setLogoPreview(logoSrc)
      setLogoFile(null)
    }
  }, [isEditing, companyTitle, headOfficeArea, address, country, logoSrc])

  function handleClickChangeImage() {
    fileInputRef.current?.click()
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const url = URL.createObjectURL(file)
    setLogoPreview(url)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)

    try {
      if (!API_BASE_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_BASE_URL is not set. Please configure it in your environment."
        )
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null

      if (!token) {
        throw new Error("No authentication token found in localStorage.")
      }

      // ⚠️ Laravel expects multipart POST + _method=PATCH
      const formData = new FormData()
      formData.append("_method", "PATCH")

      // Only append fields if there is a non-empty value
      if (editCompanyTitle.trim()) {
        formData.append("title", editCompanyTitle.trim())
      }
      if (editHeadOfficeArea.trim()) {
        formData.append("area", editHeadOfficeArea.trim())
      }
      if (editAddress.trim()) {
        formData.append("address", editAddress.trim())
      }
      if (editCountry.trim()) {
        formData.append("country", editCountry.trim())
      }

      // logo file (optional)
      if (logoFile) {
        formData.append("logo", logoFile)
      }

      const res = await fetch(`${API_BASE_URL}/organization`, {
        method: "POST", // <- important: POST + _method=PATCH
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          // NO manual Content-Type for FormData
        },
        body: formData,
      })

      const body = await res.json().catch(() => null)

      if (!res.ok) {
        const message =
          (body && (body.message as string)) ||
          `Request failed with status ${res.status}`
        throw new Error(message)
      }

      console.log(
        "[EmployerProfileHeaderCard] Organization updated successfully:",
        body
      )

      // refresh /me in parent so new values + logo show up
      await onProfileRefresh()
      onCancel()
    } catch (err: any) {
      console.error(
        "[EmployerProfileHeaderCard] Failed to update organization:",
        err
      )
      setError(err?.message ?? "Failed to update organization.")
    } finally {
      setSaving(false)
    }
  }

  // ---- EDIT MODE ----
  if (isEditing) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Edit employer profile</h3>

            {/* UPDATE IMAGE SECTION */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Update Image
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={logoPreview}
                    alt="Company Logo"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClickChangeImage}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
                  >
                    <Pencil className="h-5 w-5 text-white" />
                  </button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Click the image to upload a new company logo.</p>
                  <p>Recommended: square image, max size 2MB.</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>

            {/* TEXT FIELDS */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyTitle">Company name</Label>
                <Input
                  id="companyTitle"
                  value={editCompanyTitle}
                  onChange={(e) => setEditCompanyTitle(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headOfficeArea">Head office (area)</Label>
                <Input
                  id="headOfficeArea"
                  value={editHeadOfficeArea}
                  onChange={(e) => setEditHeadOfficeArea(e.target.value)}
                  placeholder="Enter head office area"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Enter company address"
                />
              </div>

              <div className="space-y-2 md:col-span-2 md:max-w-sm">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  placeholder="Enter country"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onCancel} disabled={saving}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-black font-semibold"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ---- VIEW MODE ----
  return (
    <Card className="bg-white shadow-sm relative">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Company image from organization.logo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src={logoSrc}
                alt="Company Logo"
                width={128}
                height={128}
                className="rounded-lg object-cover"
              />
            </div>
          </div>

          {/* Right side - Company info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {companyTitle}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold">Company name: </span>
                <span>{companyTitle}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Crown className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">
                Head office:
              </span>
              <span>{headOfficeArea}</span>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Address: </span>
              <span>{address}</span>
            </p>

            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Country: </span>
              <span>{country}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 rounded-full"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
