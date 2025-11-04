"use client";

import { mockReportData } from "@/lib/mock-report-data";
import { PageLayout } from "@/components/compliance-report/page-layout";
import { SectionHeader } from "@/components/compliance-report/section-header";

interface DocumentItem {
  id: string;
  document: string;
  reviewed_by: string;
  reviewed_at: string;
}

export default function SupportingDocumentsPage() {
  const report = mockReportData;

  // Get supporting documents and DBS information from the correct data structure
  const supportingDocs = report.data.supporting_documents || [];
  const dbsInfo = report.data.dbs_information;

  const groupedDocs: Record<string, DocumentItem[]> = {
    "Police Check Certificate": dbsInfo
      ? [
          {
            id: dbsInfo.id,
            document: `DBS Certificate - ${dbsInfo.certificate_number}`,
            reviewed_by: dbsInfo.reviewed_by,
            reviewed_at: dbsInfo.reviewed_at,
          },
        ]
      : [],
    "Supporting Documents": supportingDocs
      .filter(
        (doc) =>
          doc.document_type === "qualification_evidence" ||
          doc.document_type === "health_document"
      )
      .map((doc) => ({
        id: doc.id,
        document: doc.document,
        reviewed_by: doc.reviewed_by,
        reviewed_at: doc.reviewed_at,
      })),
  };

  return (
    <div data-page="supporting-documents">
      <PageLayout pageNumber={11}>
        <SectionHeader number="" title="Supporting Documents" />

        {Object.entries(groupedDocs).map(([groupName, docs]) => (
          <div key={groupName} className="mb-8">
            <h3 className="font-semibold mb-4">{groupName}</h3>
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
                  {docs.map((doc) => (
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
        ))}

        <div className="mt-12 flex justify-between text-xs text-gray-600 pt-4">
          <p>Report Produced by Safer Recruit</p>
          <p>Page 11</p>
        </div>
      </PageLayout>
    </div>
  );
}
