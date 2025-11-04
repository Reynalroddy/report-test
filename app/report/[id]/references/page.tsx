"use client";

import { mockReportData } from "@/lib/mock-report-data";
import { ReferencesSection } from "@/components/compliance-report/references-section";
import { PageLayout } from "@/components/compliance-report/page-layout";

export default function ReferencesPage() {
  const report = mockReportData;

  return (
    <div data-page="references">
      <PageLayout pageNumber={10}>
        <ReferencesSection references={report.data.references} />
      </PageLayout>
    </div>
  );
}
