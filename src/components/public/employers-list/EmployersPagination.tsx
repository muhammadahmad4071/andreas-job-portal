"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type EmployersPaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onNext: () => void
  onPrev: () => void
}

export function EmployersPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onNext,
  onPrev,
}: EmployersPaginationProps) {
  // Only show pagination if there's more than one page
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Previous page button */}
      <Button variant="outline" onClick={onPrev} disabled={currentPage === 1} className="rounded-md bg-transparent">
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page indicator */}
      <span className="text-sm text-gray-700 font-medium">
        {currentPage} / {totalPages}
      </span>

      {/* Next page button */}
      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="rounded-md bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
