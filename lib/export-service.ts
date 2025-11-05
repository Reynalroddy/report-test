"use client"

import JSZip from "jszip"
import type { ComplianceReport } from "./types"

/**
 * Dynamically imports html2pdf only in the browser
 */
async function loadHtml2Pdf() {
  if (typeof window === "undefined") {
    throw new Error("html2pdf can only be used in the browser")
  }
  const html2pdfModule = await import("html2pdf.js")
  return html2pdfModule.default
}

/**
 * Generates a styled PDF report from the compliance data
 * Each section is rendered on a separate page
 */
export async function generatePdfReport(
  reportData: ComplianceReport
): Promise<Blob> {
  // Find the report container in the DOM
  const element = document.querySelector("[data-report-container]")

  if (!element) {
    throw new Error(
      "Report container not found. Ensure the report is rendered on the page."
    )
  }

  const employeeName = reportData.data.profile.user_full_name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")

  const options = {
    margin: [10, 10, 10, 10],
    filename: `${employeeName}_Compliance_Report.pdf`,
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    },
    pagebreak: { mode: ["css", "legacy"] },
  }

  // Dynamically load html2pdf
  const html2pdf = await loadHtml2Pdf()

  return new Promise((resolve, reject) => {
    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf: any) => {
        const pageCount = pdf.internal.pages.length - 1
        console.log(`[Export] Generated PDF with ${pageCount} pages`)

        // Convert to blob
        const blob = pdf.output("blob")
        resolve(blob)
      })
      .catch((error: any) => {
        console.error("[Export] PDF generation failed:", error)
        reject(new Error(`PDF generation failed: ${error.message}`))
      })
  })
}

/**
 * Fetches a file from a URL with retry logic
 * Returns null if the file cannot be fetched after retries
 */
async function fetchFileWithRetry(
  url: string,
  filename: string,
  maxRetries = 3
): Promise<{ blob: Blob; filename: string } | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[Export] Fetching ${filename} (attempt ${attempt}/${maxRetries})`
      )

      const response = await fetch(url, {
        headers: {
          Accept: "*/*",
        },
        mode: "cors",
      })

      if (!response.ok) {
        console.warn(
          `[Export] File fetch returned status ${response.status}: ${filename}`
        )
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000 * attempt))
          continue
        }
        return null
      }

      const blob = await response.blob()
      console.log(`[Export] Successfully fetched ${filename}`)
      return { blob, filename }
    } catch (error) {
      console.warn(
        `[Export] Attempt ${attempt}/${maxRetries} failed for ${filename}:`,
        error
      )
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise((r) => setTimeout(r, 1000 * attempt))
      }
    }
  }

  console.error(`[Export] Failed to fetch ${filename} after ${maxRetries} attempts`)
  return null
}

/**
 * Creates a ZIP file containing the PDF report and all attachments
 * Files are organized by section for easy navigation
 */
export async function createComplianceZip(
  pdfBlob: Blob,
  reportData: ComplianceReport,
  employeeName: string
): Promise<Blob> {
  const zip = new JSZip()
  const data = reportData.data

  console.log("[Export] Creating ZIP file...")

  // Add the PDF report to the root
  const pdfFilename = `${employeeName}_Compliance_Report.pdf`
  zip.file(pdfFilename, pdfBlob)
  console.log(`[Export] Added PDF report: ${pdfFilename}`)

  // Create folder structure
  const attachmentsFolder = zip.folder("attachments")
  if (!attachmentsFolder) {
    throw new Error("Failed to create attachments folder")
  }

  // Track statistics
  const stats = {
    total: 0,
    fetched: 0,
    failed: 0,
  }

  // Add CV
  if (data.cv?.url) {
    stats.total++
    const cvFolder = attachmentsFolder.folder("cv")
    if (cvFolder) {
      const result = await fetchFileWithRetry(
        data.cv.url,
        data.cv.file || "CV.pdf"
      )
      if (result) {
        cvFolder.file(result.filename, result.blob)
        stats.fetched++
      } else {
        stats.failed++
      }
    }
  }

  // Add supporting documents
  if (data.supporting_documents?.length > 0) {
    const supportingFolder = attachmentsFolder.folder("supporting_documents")
    if (supportingFolder) {
      for (const doc of data.supporting_documents) {
        if (doc.file_url) {
          stats.total++
          const docTypeFolder =
            supportingFolder.folder(doc.document_type) || supportingFolder
          const result = await fetchFileWithRetry(doc.file_url, doc.document)
          if (result) {
            docTypeFolder.file(result.filename, result.blob)
            stats.fetched++
          } else {
            stats.failed++
          }
        }
      }
    }
  }

  // Add reference attachments
  if (data.references?.length > 0) {
    const referencesFolder = attachmentsFolder.folder("references")
    if (referencesFolder) {
      for (let i = 0; i < data.references.length; i++) {
        const ref = data.references[i]
        const refNumber = i + 1
        const refName = ref.referee_name.replace(/[^a-zA-Z0-9_]/g, "_")
        const refFolder = referencesFolder.folder(
          `Reference_${refNumber}_${refName}`
        )

        if (refFolder) {
          // Add reference details as text file
          const refDetails = [
            `REFERENCE #${refNumber}`,
            "========================",
            `Referee Name: ${ref.referee_name}`,
            `Position: ${ref.referee_role}`,
            `Company: ${ref.company_name}`,
            `Email: ${ref.referee_email}`,
            `Phone: ${ref.referee_phone_number}`,
            `Type: ${ref.reference_type.replace("_", " ")}`,
            "",
            `Date Received: ${ref.reference_entry.date_received}`,
            "Reference Notes:",
            ref.reference_entry.notes,
            "",
            "Verification Information:",
            ...ref.verification_logs.map((log) => 
              [
                `Outcome: ${log.verification_outcome}`,
                `Date Contacted: ${log.date_contacted}`,
                `Verification Notes: ${log.verification_notes}`,
                `Additional Notes: ${log.additional_notes || "N/A"}`,
                `Verified By: ${log.verified_by}`,
                "---"
              ].join("\n")
            ),
          ].join("\n")
          refFolder.file("reference_details.txt", refDetails)

          // Add reference attachments
          if (ref.reference_entry.attachments?.length > 0) {
            for (const attachment of ref.reference_entry.attachments) {
              stats.total++
              const result = await fetchFileWithRetry(
                attachment.url,
                attachment.file
              )
              if (result) {
                refFolder.file(result.filename, result.blob)
                stats.fetched++
              } else {
                stats.failed++
              }
            }
          }
        }
      }
    }
  }

  // Add DBS information text file
  if (data.dbs_information) {
    const dbs = data.dbs_information
    const dbsInfo = `DBS CHECK INFORMATION
====================
Certificate Number: ${dbs.certificate_number}
Status: ${dbs.status}
Is Valid: ${dbs.is_valid ? "Yes" : "No"}

Result Details:
- Status: ${dbs.result.status}
- Name: ${dbs.result.first_name} ${dbs.result.last_name}
- Data Generated: ${dbs.result.data_generated}

Review Information:
- Reviewed By: ${dbs.reviewed_by}
- Reviewed At: ${dbs.reviewed_at}
- Is Reviewed: ${dbs.is_reviewed ? "Yes" : "No"}
`
    attachmentsFolder.file("dbs_check_details.txt", dbsInfo)
  }

  // Add identity verification details
  if (data.onfido_results?.length > 0) {
    const identityFolder = attachmentsFolder.folder("identity_verification")
    if (identityFolder) {
      for (let i = 0; i < data.onfido_results.length; i++) {
        const result = data.onfido_results[i]
        const identityInfo = `IDENTITY VERIFICATION #${i + 1}
============================
Verification Type: ${result.verification_type}
Status: ${result.status}

Personal Information:
- Name: ${result.first_name} ${result.last_name}

Document Information:
- Document Type: ${result.document_type}
- Document Number: ${result.document_number}
- Issuing Country: ${result.issuing_country}
- Issuing Date: ${result.issuing_date}
- Expiry Date: ${result.expiry_date}

Verification Details:
- Completed At: ${result.completed_at}
- Reviewed By: ${result.reviewed_by}
- Reviewed At: ${result.reviewed_at}
- Is Reviewed: ${result.is_reviewed ? "Yes" : "No"}

Document Photos: ${result.document_photos?.length || 0} photo(s)
`
        identityFolder.file(`identity_verification_${i + 1}.txt`, identityInfo)
      }
    }
  }

  // Add employment history
  if (data.employment_histories?.length > 0) {
    const employmentInfo = `EMPLOYMENT HISTORY
==================

${data.employment_histories
  .map(
    (emp, idx) => `
${idx + 1}. ${emp.company_name}
   Role: ${emp.role}
   Start Date: ${emp.start_date}
   End Date: ${emp.end_date || "Present"}
   Verification Status: ${emp.verification_status}
   Is Current: ${emp.is_current ? "Yes" : "No"}
   Is Declared: ${emp.is_declared ? "Yes" : "No"}
   Gap Explanation: ${emp.gap_explanation || "None"}
`
  )
  .join("\n")}
`
    attachmentsFolder.file("employment_history.txt", employmentInfo)
  }

  // Add README with metadata
  const metadata = `COMPLIANCE REPORT PACKAGE
=========================

Report ID: ${data.id}
Generated: ${new Date().toLocaleString()}

CANDIDATE INFORMATION
---------------------
Name: ${data.profile.user_full_name}
Email: ${data.profile.email}
Phone: ${data.profile.phone}
Address: ${data.profile.full_address}

VERIFICATION STATUS
-------------------
Overall Status: ${data.verification_status}
Employee Type: ${data.employee_type}
Employment History Verified: ${data.is_employment_history_verified ? "Yes" : "No"}
Employment Reviewed: ${data.is_employment_reviewed ? "Yes" : "No"}

CARE HOME INFORMATION
---------------------
Name: ${data.care_home.name}

REVIEW INFORMATION
------------------
Reviewed By: ${data.employment_reviewed_by}
Reviewed At: ${data.employment_reviewed_at}

COMPLIANCE CHECKS
-----------------
${data.checks.map((c) => `- ${c.name.replace("_", " ")}: ${c.description}`).join("\n")}

TASK COMPLETION
---------------
${data.todo_items.map((t) => `- ${t.task_type.replace("_", " ")}: ${t.status}`).join("\n")}

PACKAGE CONTENTS
----------------
- ${pdfFilename}: Complete compliance report in PDF format
- attachments/: All supporting documents organized by category
  - cv/: Candidate's curriculum vitae
  - supporting_documents/: Supporting documents grouped by type
  - references/: Reference letters and attachments
  - identity_verification/: Identity verification details
  - dbs_check_details.txt: DBS check information
  - employment_history.txt: Complete employment history

DOWNLOAD STATISTICS
-------------------
Total files attempted: ${stats.total}
Successfully fetched: ${stats.fetched}
Failed to fetch: ${stats.failed}

${
  stats.failed > 0
    ? `\nNOTE: ${stats.failed} file(s) could not be downloaded due to network errors or missing URLs.\nThese files may need to be retrieved manually.`
    : ""
}
`

  zip.file("README.txt", metadata)

  console.log(
    `[Export] ZIP creation complete. Stats: ${stats.fetched}/${stats.total} files (${stats.failed} failed)`
  )

  // Generate and return ZIP blob
  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  })
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  console.log(`[Export] Downloaded: ${fileName}`)
}

/**
 * Main export function that orchestrates the entire process
 */
export async function exportComplianceReport(
  reportData: ComplianceReport,
  includeAttachments = true
): Promise<void> {
  const employeeName = reportData.data.profile.user_full_name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")

  try {
    console.log("[Export] Starting compliance report export...")

    // Generate PDF
    console.log("[Export] Generating PDF report...")
    const pdfBlob = await generatePdfReport(reportData)
    console.log("[Export] PDF generated successfully")

    if (includeAttachments) {
      // Create ZIP with PDF and all attachments
      console.log("[Export] Creating ZIP package with attachments...")
      const zipBlob = await createComplianceZip(pdfBlob, reportData, employeeName)
      console.log("[Export] ZIP package created successfully")

      // Download the ZIP
      downloadBlob(zipBlob, `${employeeName}_Compliance_Package.zip`)
    } else {
      // Download just the PDF
      downloadBlob(pdfBlob, `${employeeName}_Compliance_Report.pdf`)
    }

    console.log("[Export] Export completed successfully")
  } catch (error) {
    console.error("[Export] Export failed:", error)
    throw error
  }
}
