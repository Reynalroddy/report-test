"use client";
import { PreEmploymentSection } from "@/components/compliance-report/pre-employment-section";
import { PageLayout } from "@/components/compliance-report/page-layout";

export default function PreEmploymentPage() {
  return (
    <div data-page="pre-employment">
      <PageLayout pageNumber={2}>
        <PreEmploymentSection
          title="2(d). Right to Work Share Code"
          category="Right to Work"
        />
      </PageLayout>

      <PageLayout pageNumber={2}>
        <PreEmploymentSection
          title="2(e). Proof of Qualifications"
          category="Proof of Qualifications"
        />
      </PageLayout>

      <PageLayout pageNumber={2}>
        <PreEmploymentSection
          title="2(f). Self Declared Medical Checklist"
          category="Medical Checklist"
        />
      </PageLayout>
    </div>
  );
}
