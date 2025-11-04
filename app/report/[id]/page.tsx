"use client"

import { mockReportData } from "@/lib/mock-report-data"
import { ReportHeader } from "@/components/compliance-report/report-header"
import { PageLayout } from "@/components/compliance-report/page-layout"

export default function CoverPage() {
  const report = mockReportData

  return (
    <div data-page="cover">
      <PageLayout pageNumber={0}>
        <ReportHeader
          employeeName={report.data.profile.user_full_name}
          email={report.data.profile.email}
          phone={report.data.profile.phone}
          address={report.data.profile.full_address}
          nationality={report.data.profile.nationality}
          dateOfBirth={report.data.profile.date_of_birth}
        />
      </PageLayout>
    </div>
  )
}
