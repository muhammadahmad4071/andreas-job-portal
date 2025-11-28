// app/admin/seo/main-text/page.tsx
"use client"

import { useEffect, useState, FormEvent } from "react"
import { EmployerSidebar } from "@/components/admin/admin-home/EmployerSidebar"
import { EmployerHeader } from "@/components/admin/admin-home/EmployerHeader"
import { EmployerFooter } from "@/components/admin/admin-home/EmployerFooter"
import { apiFetch } from "@/lib/api"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type SeoRecord = {
  id: number
  key: string
  value: string
  created_at: string
  updated_at: string
}

export default function AdminSeoMainTextPage() {
  const [seo, setSeo] = useState<SeoRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editValue, setEditValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // ---- Load current SEO text on mount ----
  useEffect(() => {
    const fetchSeo = async () => {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)

      try {
        const data = (await apiFetch("/admin/seos/key/main-text", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })) as SeoRecord

        setSeo(data)
      } catch (err) {
        console.error("Failed to load SEO main-text:", err)
        setError("Failed to load SEO main text. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeo()
  }, [])

  // Open dialog with current value
  const handleOpenDialog = () => {
    if (!seo) return
    setEditValue(seo.value ?? "")
    setError(null)
    setSuccessMessage(null)
    setDialogOpen(true)
  }

  // Cancel editing → close dialog and reset editValue next time it opens
  const handleCancel = () => {
    setDialogOpen(false)
    setError(null)
  }

  // Save updated text
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!seo) return

    setIsSaving(true)
    setError(null)

    try {
      await apiFetch(`/admin/seos/${seo.id}`, {
        method: "PUT", // or "PATCH" depending on backend
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "main-text",
          value: editValue,
        }),
      })

      // Update local state
      setSeo({ ...seo, value: editValue })
      setDialogOpen(false)
      setSuccessMessage("SEO text saved successfully.")
    } catch (err) {
      console.error("Failed to save SEO main-text:", err)
      setError("Failed to save. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Helper to show a short preview in the card
  const previewText =
    seo?.value && seo.value.length > 220
      ? seo.value.slice(0, 220) + "…"
      : seo?.value ?? ""

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <EmployerSidebar />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <EmployerHeader />

        {/* Main content */}
        <main className="flex-1">
          <div className="w-full py-8">
            <div className="container-custom max-w-4xl mx-auto space-y-4">
              <h1 className="text-2xl font-semibold">SEO Settings</h1>

              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="rounded-md border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              {isLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading SEO text…
                </div>
              ) : !seo ? (
                <div className="text-sm text-muted-foreground">
                  No SEO entry found for <code>main-text</code>.
                </div>
              ) : (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">
                        Homepage SEO Main Text
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Key: <code>main-text</code>
                      </p>
                    </div>
                    <Button size="sm" onClick={handleOpenDialog}>
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {previewText || "No text set yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <EmployerFooter />
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit SEO Main Text</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Main SEO Text
              </label>
              <textarea
                className="w-full min-h-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This text appears on the public homepage as the SEO / intro
                text.
              </p>
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
