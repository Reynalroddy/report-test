"use client";

import { mockReportData } from "@/lib/mock-report-data";
import { PageLayout } from "@/components/compliance-report/page-layout";
import { SectionHeader } from "@/components/compliance-report/section-header";

export default function ProofOfAddressPage() {
  const report = mockReportData.data;
  const addressDocs = (report?.supporting_documents || []).filter(
    (d) =>
      d.document_type?.includes("address") || d.document_type?.includes("proof")
  );

  return (
    <div data-page="proof-of-address">
      <PageLayout pageNumber={3}>
        <SectionHeader
          number="3"
          title="Proof of Identification"
          subtitle="3(f). Proof of Address"
        />

        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-200">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">
                    Document Checked
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">
                    Verified by Who
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">
                    Date Verified
                  </th>
                </tr>
              </thead>
              <tbody>
                {addressDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {doc.document}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      <div className="text-xs">Reviewed by:</div>
                      <div className="font-semibold">{doc.reviewed_by}</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {doc.reviewed_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 flex justify-between text-xs text-gray-600 pt-4">
          <p>Report Produced by Safer Recruit</p>
          <p>Page 3</p>
        </div>
      </PageLayout>
    </div>
  );
}
