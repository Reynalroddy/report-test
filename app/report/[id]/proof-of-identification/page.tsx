"use client";

import { mockReportData } from "@/lib/mock-report-data";
import { PageLayout } from "@/components/compliance-report/page-layout";
import { SectionHeader } from "@/components/compliance-report/section-header";
import { DocumentGallery } from "@/components/compliance-report/document-gallery";

export default function ProofOfIdentificationPage() {
  const report = mockReportData.data;
  const onfidoResult = report?.onfido_results?.[0];

  // Map onfido result to document format for gallery
  const passportDocs =
    onfidoResult?.document_photos?.map((photo: any) => ({
      id: photo[0],
      name: `Passport ${photo[1]}`,
      url: "", // Onfido photos need special handling
      type: "image",
    })) || [];

  return (
    <div data-page="proof-of-identification">
      <PageLayout pageNumber={4}>
        <SectionHeader
          number="3"
          title="Proof of Identification"
          subtitle="3(b). Passport"
        />

        {/* Passport Details Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-200">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">
                  Document Checked
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">
                  Document number
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">
                  Issuing country
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-sm">
                  Issuing Date
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
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {onfidoResult?.document_type || "Passport"}
                  <div className="text-xs text-gray-500">
                    (User identity was also verified.)
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {onfidoResult?.document_number || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {onfidoResult?.issuing_country || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {onfidoResult?.issuing_date || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        onfidoResult?.status === "approved"
                          ? "bg-green-500"
                          : "bg-orange-400"
                      }`}
                    >
                      {onfidoResult?.status === "approved" ? "✓" : "N"}
                    </div>
                    <div className="text-xs">
                      <div>UK DAITE Tier HIA (High Confidence Level A).</div>
                      <div>Reviewed by:</div>
                      <div className="font-semibold">
                        {onfidoResult?.reviewed_by || "Pending"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {onfidoResult?.reviewed_at || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Uploaded Documents Gallery */}
        {passportDocs.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Uploaded Documents</h3>
            <DocumentGallery documents={passportDocs} />
          </div>
        )}

        <div className="mt-12 flex justify-between text-xs text-gray-600 pt-4">
          <p>Report Produced by Safer Recruit</p>
          <p>Page 4</p>
        </div>
      </PageLayout>
    </div>
  );
}
