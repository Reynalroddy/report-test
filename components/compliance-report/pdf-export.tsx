"use client"

import { useRef } from "react"

interface PDFExportProps {
  fileName?: string
}

export function PDFExportButton({ fileName = "compliance-report" }: PDFExportProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const generatePDF = async () => {
    if (!contentRef.current) return

    try {
      // Load html2pdf library
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
      document.head.appendChild(script)

      script.onload = () => {
        const element = contentRef.current
        const opt = {
          margin: 10,
          filename: `${fileName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
        }

        // Use the global html2pdf if available
        const html2pdf = (window as any).html2pdf
        if (html2pdf) {
          html2pdf().set(opt).from(element).save()
        }
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    }
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={generatePDF}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors no-print"
      >
        Download PDF
      </button>
    </div>
  )
}
