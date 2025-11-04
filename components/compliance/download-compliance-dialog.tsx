"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import type { ComplianceReport } from "@/lib/types"
import { generateCompliancePdfReport, createOrganizedZip, downloadBlob } from "@/lib/compliance-download"

interface DownloadComplianceDialogProps {
  isOpen: boolean
  onClose: () => void
  reportData: ComplianceReport
}

export function DownloadComplianceDialog({ isOpen, onClose, reportData }: DownloadComplianceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "generating-pdf" | "creating-zip" | "complete">("idle")

  const employeeName = reportData.data.profile.user_full_name.replace(/\s+/g, "_")

  const handleDownloadReportOnly = async () => {
    setIsLoading(true)
    setError(null)
    setStatus("generating-pdf")

    try {
      const pdfBlob = await generateCompliancePdfReport(reportData, false)
      downloadBlob(pdfBlob, `${employeeName}_Compliance_Report.pdf`)
      setStatus("complete")
      setTimeout(() => onClose(), 1000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate PDF"
      setError(errorMsg)
      console.error("[v0] PDF generation error:", err)
    } finally {
      setIsLoading(false)
      setStatus("idle")
    }
  }

  const handleDownloadWithFiles = async () => {
    setIsLoading(true)
    setError(null)
    setStatus("generating-pdf")

    try {
      // Generate PDF report
      const pdfBlob = await generateCompliancePdfReport(reportData, true)
      downloadBlob(pdfBlob, `${employeeName}_Compliance_Report.pdf`)

      // Create organized ZIP with all documents
      setStatus("creating-zip")
      const zipBlob = await createOrganizedZip(reportData, employeeName)
      downloadBlob(zipBlob, `${employeeName}_Supporting_Documents.zip`)

      setStatus("complete")
      setTimeout(() => onClose(), 1000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate files"
      setError(errorMsg)
      console.error("[v0] Download error:", err)
    } finally {
      setIsLoading(false)
      setStatus("idle")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Download Compliance Report</DialogTitle>
          <DialogDescription>Choose how you want to download the compliance verification report</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive text-sm">Error</p>
              <p className="text-xs text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {status === "complete" && (
          <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Download Complete</p>
              <p className="text-xs text-green-700">Your files are ready</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Report Only Option */}
          <Button
            onClick={handleDownloadReportOnly}
            disabled={isLoading}
            variant="outline"
            className="w-full justify-start h-auto py-3 px-4 bg-transparent"
          >
            <div className="flex-1 text-left">
              {isLoading && status === "generating-pdf" ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-sm">Report PDF Only</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Download the compliance report as PDF (recommended for quick review)
                  </p>
                </div>
              )}
            </div>
          </Button>

          {/* Report + Files Option */}
          <Button
            onClick={handleDownloadWithFiles}
            disabled={isLoading}
            className="w-full justify-start h-auto py-3 px-4"
          >
            <div className="flex-1 text-left">
              {isLoading && (status === "creating-zip" || status === "generating-pdf") ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{status === "generating-pdf" ? "Generating PDF" : "Creating ZIP file"}...</span>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-sm">Report + All Files</p>
                  <p className="text-xs text-muted-foreground/90 mt-1">
                    PDF report + organized folder with all supporting documents, references, and attachments
                  </p>
                </div>
              )}
            </div>
          </Button>
        </div>

        <Button onClick={onClose} disabled={isLoading} variant="ghost" className="w-full">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  )
}
