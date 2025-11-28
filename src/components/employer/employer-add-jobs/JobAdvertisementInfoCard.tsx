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
              INFORMATION IN THE JOB ADVERTISEMENT
            </h3>
            <div className="text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-primary">
                Our tips for the perfect job ad
              </p>
              <p>Divide your ad clearly into the following sections:</p>
              <ul className="space-y-1.5 ml-1">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Introduction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Preconditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Call for applications</span>
                </li>
              </ul>
              <p className="pt-2">Choose a &quot;you&quot; or &quot;you&quot; address for your ad.</p>
              <p>
                Formulate the sections in bullet points for better readability
                and use the stored heading formats.
              </p>
              <p>
                Pay attention to the terminology and wording that is
                appropriate for the target group.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="job-title" className="text-base font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="job-title"
                placeholder="Specify the title of the job"
                className="text-base"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Use a descriptive 3–6 word title.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="job-description" className="text-base font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                {/* <Info className="h-4 w-4 text-muted-foreground" /> */}
              </div>
              <Textarea
                id="job-description"
                placeholder="Provide detailed information about the job advertisement..."
                className="min-h-[280px] text-base font-normal resize-y"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Provide detailed information about the job advertisement.
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
                Paste the full URL of the video you want to embed (Youtube or
                Vimeo) starting with &quot;https://&quot;
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
