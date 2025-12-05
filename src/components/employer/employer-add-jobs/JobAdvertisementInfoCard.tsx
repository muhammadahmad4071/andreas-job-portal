"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Sparkles, Info } from "lucide-react"

export type JobAdvertisementInfoData = {
  title: string
  description: string
  videoUrl: string
}

type JobAdvertisementInfoCardProps = {
  value?: JobAdvertisementInfoData
  onChange: (value: JobAdvertisementInfoData) => void
}

export function JobAdvertisementInfoCard({
  value,
  onChange,
}: JobAdvertisementInfoCardProps) {
  const [title, setTitle] = useState(value?.title ?? "")
  const [description, setDescription] = useState(value?.description ?? "")
  const [videoUrl, setVideoUrl] = useState(value?.videoUrl ?? "")

  // Sync local state up to parent whenever something changes
  useEffect(() => {
    onChange({
      title,
      description,
      videoUrl,
    })
  }, [title, description, videoUrl, onChange])

  return (
    <Card>
      <CardContent className="p-6">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          {/* Left Description Column */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              INFORMATIONEN ZUR STELLENANZEIGE
            </h3>
            <div className="text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-primary">
                Unsere Tipps für die perfekte Stellenanzeige
              </p>
              <p>Teilen Sie Ihre Anzeige klar in die folgenden Abschnitte auf:</p>
              <ul className="space-y-1.5 ml-1">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Einleitung</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Aufgaben</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Voraussetzungen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Vorteile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Aufforderung zur Bewerbung</span>
                </li>
              </ul>
              <p className="pt-2">Wählen Sie für Ihre Anzeige eine "Du"- oder "Sie"-Ansprache.</p>
              <p>
                Formulieren Sie die Abschnitte in Aufzählungspunkten für bessere Lesbarkeit und verwenden Sie die gespeicherten Überschriftenformate.
              </p>
              <p>
                Achten Sie auf die für die Zielgruppe passende Terminologie und Formulierung.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="job-title" className="text-base font-semibold">
                Titel <span className="text-destructive">*</span>
              </Label>
              <Input
                id="job-title"
                placeholder="Geben Sie den Jobtitel an"
                className="text-base"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Verwenden Sie einen aussagekräftigen Titel mit 3–6 Wörtern.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="job-description" className="text-base font-semibold">
                  Beschreibung <span className="text-destructive">*</span>
                </Label>
                {/* <Info className="h-4 w-4 text-muted-foreground" /> */}
              </div>
              <Textarea
                id="job-description"
                placeholder="Geben Sie ausführliche Informationen zur Stellenanzeige an..."
                className="min-h-[280px] text-base font-normal resize-y"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Geben Sie ausführliche Informationen zur Stellenanzeige an.
              </p>
            </div>

            {/* AI Generate Button (no-op for now) */}
            {/* <div className="border border-border rounded-lg p-4 bg-[#FFFBF0]">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto bg-white hover:bg-gray-50"
                // later you can pass an onGenerate prop if needed
              >
                <Sparkles className="h-4 w-4 mr-2 text-[#FDB913]" />
                Generate with AI
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                To use the AI Generator, at least the title must be filled in.
                We recommend filling in as many fields as possible to achieve
                the best possible result.
              </p>
            </div> */}

            {/* Video */}
            <div className="space-y-2">
              <Label htmlFor="job-video" className="text-base font-semibold">
                Video
              </Label>
              <Input
                id="job-video"
                type="url"
                placeholder="https://"
                className="text-base"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Fügen Sie die vollständige URL des Videos ein, das Sie einbetten möchten (YouTube oder Vimeo), 
                beginnend mit "https://".
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
