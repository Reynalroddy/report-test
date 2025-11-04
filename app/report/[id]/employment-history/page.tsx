"use client"

import { mockReportData } from "@/lib/mock-report-data"
import { EmploymentHistorySection } from "@/components/compliance-report/employment-history-section"
import { PageLayout } from "@/components/compliance-report/page-layout"

export default function EmploymentHistoryPage() {
  const report = mockReportData

  const employmentRecords = (report.data?.employment_histories || []).map((emp) => ({
    employer: emp.company_name || "N/A",
    dateStarted: emp.start_date || "N/A",
    dateEnded: emp.end_date || "Present",
    verifiedBy: emp.verification_status === "verified" ? "Safer Recruit" : "Pending",
    dateVerified: report.data?.employment_reviewed_at || "N/A",
  }))

  return (
    <div data-page="employment-history">
      <PageLayout pageNumber={1}>
        <EmploymentHistorySection records={employmentRecords} />
      </PageLayout>
    </div>
  )
}
