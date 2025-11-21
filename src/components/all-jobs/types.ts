export type EmployerJobStatus = "Draft" | "Active" | "Expired"

export type EmployerJob = {
  id: string
  title: string
  location: string
  companyName: string
  status: EmployerJobStatus
  source: string
  employmentType: string
  applicationWorkflow: string
  frontendType: string
  description: string
  statisticsSummary: string
  createdAt: string
  updatedAt: string
  searchIndex: string
}