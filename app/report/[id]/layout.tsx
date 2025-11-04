"use client";

import { useState, useRef, use } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { mockReportData } from "@/lib/mock-report-data";
import { DownloadDialog } from "@/components/compliance-report/download-dialog";
import { createReportPdfFromPages } from "@/lib/report-to-pdf";

export default function ReportLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const report = mockReportData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    const pdfBlob = await createReportPdfFromPages(
      report.data.profile.user_full_name
    );
    return pdfBlob;
  };

  const sections = [
    { name: "Cover", path: "" },
    { name: "Employment History", path: "/employment-history" },
    { name: "Pre-Employment", path: "/pre-employment" },
    { name: "Proof of Address", path: "/proof-of-address" },
    { name: "Proof of Identification", path: "/proof-of-identification" },
    { name: "References", path: "/references" },
    { name: "Supporting Documents", path: "/supporting-documents" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">
              {report.data.profile.user_full_name} - Compliance Report
            </h1>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Generate Report
            </button>
          </div>

          {/* Section Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((section) => (
              <Link key={section.path} href={`/report/${id}${section.path}`}>
                <button className="whitespace-nowrap px-3 py-1 rounded text-sm hover:bg-gray-100 transition">
                  {section.name}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={reportContentRef} className="max-w-4xl mx-auto py-8 px-4">
        {children}
      </div>

      {/* Download Dialog */}
      <DownloadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        reportData={report}
      />
    </div>
  );
}
