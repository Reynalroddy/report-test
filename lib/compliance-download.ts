"use client"

import JSZip from "jszip"
import html2pdf from "html2pdf.js"
import type { ComplianceReport } from "./types"

export async function generateCompliancePdfReport(
  reportData: ComplianceReport,
  _includeMetadata = false,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const element = document.querySelector("[data-report-container]")

      if (!element) {
        reject(new Error("Report container not found. Make sure the report page is rendered."))
        return
      }

      const options = {
        margin: [10, 10, 10, 10],
        filename: `${reportData.data.profile.user_full_name}_Compliance_Report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      }

      html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get("pdf")
        .then((pdf: any) => {
          const pageCount = pdf.internal.pages.length - 1

          console.log("[v0] Generated PDF with", pageCount, "pages")

          pdf.save()

          // Convert to blob
          pdf.output("blob").then((blob: Blob) => {
            resolve(blob)
          })
        })
        .catch((error: any) => {
          reject(new Error(`PDF generation failed: ${error.message}`))
        })
    } catch (error) {
      reject(error)
    }
  })
}

async function fetchFileWithRetry(url: string, maxRetries = 2): Promise<Blob | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "*/*",
        },
        mode: "cors",
      })

      if (!response.ok) {
        console.warn(`[v0] File fetch returned status ${response.status}: ${url}`)
        continue
      }

      return await response.blob()
    } catch (error) {
      console.warn(`[v0] Attempt ${attempt + 1}/${maxRetries} failed for ${url}:`, error)
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
      }
    }
  }

  console.warn(`[v0] Failed to fetch file after ${maxRetries} attempts: ${url}`)
  return null
}

export async function createOrganizedZip(reportData: ComplianceReport, employeeName: string): Promise<Blob> {
  const zip = new JSZip()
  const profile = reportData.data

  const documentsFolder = zip.folder("documents")!
  const supportingFolder = documentsFolder.folder("supporting_documents")!
  const referencesFolder = documentsFolder.folder("references")!
  const identityFolder = documentsFolder.folder("identity_verification")!
  const employmentFolder = documentsFolder.folder("employment")!
  const healthFolder = documentsFolder.folder("health_documents")!

  if (!documentsFolder) {
    throw new Error("Failed to create ZIP structure")
  }

  if (profile.cv?.url) {
    try {
      console.log("[v0] Fetching CV from:", profile.cv.url)
      const cvBlob = await fetchFileWithRetry(profile.cv.url)
      if (cvBlob) {
        const fileName = profile.cv.file || "CV.pdf"
        documentsFolder.file(`cv/${fileName}`, cvBlob)
        console.log("[v0] Added CV:", fileName)
      }
    } catch (error) {
      console.warn("[v0] Failed to add CV:", error)
    }
  }

  if (profile.supporting_documents?.length) {
    for (const doc of profile.supporting_documents) {
      if (!doc.file_url) continue

      try {
        console.log("[v0] Fetching supporting document:", doc.document)
        const fileBlob = await fetchFileWithRetry(doc.file_url)
        if (fileBlob) {
          const docType = doc.document_type || "other"
          const typeFolder = supportingFolder.folder(docType) || supportingFolder
          typeFolder.file(doc.document, fileBlob)
          console.log("[v0] Added supporting document:", doc.document)
        }
      } catch (error) {
        console.warn(`[v0] Failed to add supporting document ${doc.document}:`, error)
      }
    }
  }

  if (profile.references?.length) {
    for (let i = 0; i < profile.references.length; i++) {
      const ref = profile.references[i]
      const refNumber = i + 1
      const refFolder = referencesFolder.folder(`Reference_${refNumber}_${ref.referee_name}`)!

      // Add reference details as text file
      const refDetails = `REFERENCE #${refNumber}
========================
Referee Name: ${ref.referee_name}
Position: ${ref.referee_role}
Company: ${ref.company_name}
Email: ${ref.referee_email}
Phone: ${ref.referee_phone_number}

Date Received: ${ref.reference_entry.date_received}
Reference Notes: ${ref.reference_entry.notes}

Verification Outcome: ${ref.verification_logs[0]?.verification_outcome || "Not verified"}
Verification Notes: ${ref.verification_logs[0]?.verification_notes || ""}
Verified By: ${ref.verification_logs[0]?.verified_by || "N/A"}
`

      refFolder.file("reference_details.txt", refDetails)

      // Add reference attachments
      if (ref.reference_entry.attachments?.length) {
        for (const attachment of ref.reference_entry.attachments) {
          try {
            console.log("[v0] Fetching reference attachment:", attachment.file)
            const attachBlob = await fetchFileWithRetry(attachment.url)
            if (attachBlob) {
              refFolder.file(attachment.file, attachBlob)
              console.log("[v0] Added reference attachment:", attachment.file)
            }
          } catch (error) {
            console.warn(`[v0] Failed to add reference attachment ${attachment.file}:`, error)
          }
        }
      }
    }
  }

  if (profile.dbs_information) {
    const dbs = profile.dbs_information
    const dbsInfo = `DBS CHECK INFORMATION
====================
Certificate Number: ${dbs.certificate_number}
Status: ${dbs.status}
Is Valid: ${dbs.is_valid}
Result Status: ${dbs.result.status}
Name: ${dbs.result.first_name} ${dbs.result.last_name}
Data Generated: ${dbs.result.data_generated}
Reviewed By: ${dbs.reviewed_by}
Reviewed At: ${dbs.reviewed_at}
`
    documentsFolder.file("DBS_Certificate_Details.txt", dbsInfo)
  }

  if (profile.onfido_results?.length) {
    for (let i = 0; i < profile.onfido_results.length; i++) {
      const result = profile.onfido_results[i]
      const identityInfo = `IDENTITY VERIFICATION #${i + 1}
============================
Document Type: ${result.document_type}
Status: ${result.status}
Document Number: ${result.document_number}
Issuing Country: ${result.issuing_country}
Issuing Date: ${result.issuing_date}
Expiry Date: ${result.expiry_date}
Verified By: ${result.reviewed_by}
Verified At: ${result.reviewed_at}
`
      identityFolder.file(`Identity_Verification_${i + 1}.txt`, identityInfo)
    }
  }

  if (profile.employment_histories?.length) {
    const empHistory = `EMPLOYMENT HISTORY
==================

${profile.employment_histories
  .map(
    (emp, idx) => `
${idx + 1}. ${emp.company_name}
   Role: ${emp.role}
   Start Date: ${emp.start_date}
   End Date: ${emp.end_date || "Present"}
   Verification Status: ${emp.verification_status}
   Is Current: ${emp.is_current ? "Yes" : "No"}
   Gap Explanation: ${emp.gap_explanation || "None"}
`,
  )
  .join("\n")}
`
    employmentFolder.file("Employment_History.txt", empHistory)
  }

  const metadata = `COMPLIANCE REPORT METADATA
==========================
Report ID: ${profile.id}
Employee Name: ${profile.profile.user_full_name}
Email: ${profile.profile.email}
Phone: ${profile.profile.phone}
Address: ${profile.profile.full_address}

Verification Status: ${profile.verification_status}
Employee Type: ${profile.employee_type}
Employment Reviewed: ${profile.is_employment_reviewed ? "Yes" : "No"}
Employment History Verified: ${profile.is_employment_history_verified ? "Yes" : "No"}

Generated: ${new Date().toLocaleString()}
Generated By: ${profile.employment_reviewed_by}

SUMMARY OF CHECKS:
${profile.checks.map((c) => `- ${c.name}: ${c.description}`).join("\n")}

COMPLETION STATUS:
${profile.todo_items.map((t) => `- ${t.task_type}: ${t.status}`).join("\n")}

DOCUMENT COUNTS:
- Supporting Documents: ${profile.supporting_documents?.length || 0}
- References: ${profile.references?.length || 0}
- Identity Verification Results: ${profile.onfido_results?.length || 0}
- Employment Records: ${profile.employment_histories?.length || 0}
`

  zip.file("README.txt", metadata)

  // Generate and return ZIP blob
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" })
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
