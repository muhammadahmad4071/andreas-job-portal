"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Users } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

interface EmployerAboutCardProps {
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  organizationSize?: string
  onProfileRefresh: () => Promise<void> | void
}

const SIZE_OPTIONS = ["1-10", "11-100", "101-1000", "1001-10000", "10000+"]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function EmployerAboutCard({
  isEditing,
  onEdit,
  onCancel,
  organizationSize,
  onProfileRefresh,
}: EmployerAboutCardProps) {
  const currentSize = organizationSize || "1-10"

  const [editSize, setEditSize] = useState<string>(currentSize)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      const res = await fetch(`${API_BASE_URL}/organization`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          size: editSize,
        }),
      })

      const body = await res.json().catch(() => null)

      if (!res.ok) {
        const message =
          (body && (body.message as string)) ||
          `Request failed with status ${res.status}`
        throw new Error(message)
      }

      console.log("[EmployerAboutCard] Organization size updated:", body)

      // 🔄 refresh /me so UI shows updated size
      await onProfileRefresh()

      onCancel()
    } catch (err: any) {
      console.error("[EmployerAboutCard] Failed to update organization:", err)
      setError(err?.message ?? "Failed to update organization.")
    } finally {
      setSaving(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase text-foreground">
            Über uns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Anzahl der Mitarbeitenden
            </p>
            <p className="text-xs text-muted-foreground">
             Wählen Sie den Größenbereich aus, der Ihr Unternehmen am besten beschreibt.
            </p>

            <Select
              value={editSize}
              onValueChange={(value) => setEditSize(value)}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Größenbereich auswählen" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option} Mitarbeitende
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-xs text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel} disabled={saving}>
              Abbrechen
            </Button>
            <Button
              type="button"
              className="bg-[#FDB714] hover:bg-[#FDB714]/90 text-black font-semibold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Speichern..." : "Änderungen speichern"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // VIEW MODE
  return (
    <Card className="bg-white shadow-sm relative">
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase text-foreground">
          Über uns
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 rounded-full"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">
              Anzahl der Mitarbeitenden:
            </span>{" "}
            {currentSize} Mitarbeitende
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
