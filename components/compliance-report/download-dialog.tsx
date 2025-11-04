"use client";

import { useState } from "react";
import type { ComplianceReport } from "@/lib/types";
import { createAttachmentsZip, downloadBlob } from "@/lib/frontend-pdf-zip";
import { createReportPdfFromPages } from "@/lib/report-to-pdf";

interface DownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ComplianceReport;
}

export function DownloadDialog({
  isOpen,
  onClose,
  reportData,
}: DownloadDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (includeAttachments: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const employeeName = reportData.data.profile.user_full_name.replace(
        /\s+/g,
        "_"
      );

      // Generate PDF first
      console.log("Generating PDF...");
      const pdfBlob = await createReportPdfFromPages(employeeName);
      downloadBlob(pdfBlob, `${employeeName}_Compliance_Report.pdf`);

      // Generate ZIP with attachments if requested
      if (includeAttachments) {
        console.log("Creating attachments ZIP...");
        const zipBlob = await createAttachmentsZip(
          reportData.data.supporting_documents || [],
          reportData.data.references || [],
          reportData.data.cv?.url,
          employeeName
        );
        downloadBlob(zipBlob, `${employeeName}_Supporting_Documents.zip`);
      }

      // Close dialog after successful download
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("[v0] Download failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Download failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4">Download Compliance Report</h2>

        <p className="text-gray-600 mb-6">
          Would you like to download supporting documents and attachments along
          with the report?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => handleDownload(false)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-lg font-medium transition"
          >
            {isLoading ? "Generating PDF..." : "Report Only"}
          </button>

          <button
            onClick={() => handleDownload(true)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
          >
            {isLoading ? "Processing..." : "Report + Files"}
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full mt-3 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
