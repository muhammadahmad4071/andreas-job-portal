import Image from "next/image"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

const jobs = [
  {
    id: "1",
    title: "Sous Chef (f/m/d) at Gut Kaltenbrunn",
    company: "Käfer Gut Kaltenbrunn GmbH",
    location: "Kaltenbrunn 1, 83703 Gmund am Tegernsee, Germany",
    logoSrc: "/gut-kaltenbrunn-logo.jpg",
  },
  {
    id: "2",
    title: "Tavern Waiter (f/m/d) at Gut Kaltenbrunn",
    company: "Käfer Gut Kaltenbrunn GmbH",
    location: "Kaltenbrunn 1, 83703 Gmund am Tegernsee, Germany",
    logoSrc: "/gut-kaltenbrunn-logo.jpg",
  },
  {
    id: "3",
    title: "Assistant Patisserie (f/m/d) Gut Kaltenbrunn",
    company: "Käfer Gut Kaltenbrunn GmbH",
    location: "Kaltenbrunn 1, 83703 Gmund am Tegernsee, Germany",
    logoSrc: "/gut-kaltenbrunn-logo.jpg",
  },
  {
    id: "4",
    title: "Chef de Rang (f/m/d) at Gut Kaltenbrunn",
    company: "Käfer Gut Kaltenbrunn GmbH",
    location: "Kaltenbrunn 1, 83703 Gmund am Tegernsee, Germany",
    logoSrc: "/gut-kaltenbrunn-logo.jpg",
  },
  {
    id: "5",
    title: "Chef de Partie (f/m/d) at Gut Kaltenbrunn",
    company: "Käfer Gut Kaltenbrunn GmbH",
    location: "Kaltenbrunn 1, 83703 Gmund am Tegernsee, Germany",
    logoSrc: "/gut-kaltenbrunn-logo.jpg",
  },
]

export function EmployerJobsList() {
  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Our jobs</p>
      </CardHeader>
      <CardContent className="space-y-1">
        {jobs.map((job, index) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className={`flex gap-4 p-4 hover:bg-muted/60 transition-colors rounded-md ${
              index !== jobs.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="relative h-12 w-12 flex-shrink-0 rounded border overflow-hidden bg-white">
              <Image src={job.logoSrc || "/placeholder.svg"} alt={job.company} fill className="object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#FDB714] hover:text-[#FDB714]/80 text-sm md:text-base mb-1">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">{job.company}</p>
              <div className="flex items-start gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{job.location}</span>
              </div>
            </div>
          </Link>
        ))}

        <div className="pt-4">
          <Button variant="link" size="sm" className="h-auto p-0 text-[#FDB714] hover:text-[#FDB714]/80">
            Show more
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
