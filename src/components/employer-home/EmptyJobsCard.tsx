import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from "next/link"
export function EmptyJobsCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        {/* Illustration placeholder */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full text-muted-foreground/30" viewBox="0 0 100 100" fill="none">
            <rect x="20" y="30" width="60" height="50" rx="4" stroke="currentColor" strokeWidth="2" />
            <rect x="30" y="40" width="40" height="4" fill="currentColor" opacity="0.5" />
            <rect x="30" y="50" width="30" height="4" fill="currentColor" opacity="0.5" />
            <rect x="30" y="60" width="35" height="4" fill="currentColor" opacity="0.5" />
            <circle cx="75" cy="25" r="8" stroke="currentColor" strokeWidth="2" />
            <line x1="75" y1="17" x2="75" y2="33" stroke="currentColor" strokeWidth="2" />
            <line x1="67" y1="25" x2="83" y2="25" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="absolute bottom-0 right-0 w-12 h-16 text-muted-foreground/30">
            <svg viewBox="0 0 40 60" fill="currentColor">
              <ellipse cx="20" cy="15" rx="12" ry="15" />
              <rect x="8" y="25" width="24" height="35" rx="2" />
            </svg>
          </div>
        </div>

        <p className="text-muted-foreground max-w-md">
          You have not published any job advertisements at the moment. As soon as you create a new job advertisement, it will appear here.
        </p>

        <Link href="/employer/jobs/add-job">
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add a job ad
          </Button>
        </Link>
      </div>
    </div>
  )
}
