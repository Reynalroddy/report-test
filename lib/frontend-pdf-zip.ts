import JSZip from "jszip";

// Function to create a ZIP file with attachments
export async function createAttachmentsZip(
  supportingDocs: Array<{
    document: string;
    file_url?: string;
    document_type: string;
  }>,
  references: Array<{
    reference_entry?: { attachments: Array<{ file: string; url: string }> };
  }>,
  cvUrl?: string,
  employeeName?: string
): Promise<Blob> {
  const zip = new JSZip();
  const documentsFolder = zip.folder("documents")!;

  if (!documentsFolder) {
    throw new Error("Failed to create documents folder");
  }

  // Add CV
  if (cvUrl) {
    try {
      const cvFile = await fetch(cvUrl).then((r) => r.blob());
      const cvFileName = cvUrl.split("/").pop() || "CV.pdf";
      documentsFolder.file("cv/" + cvFileName, cvFile);
    } catch (error) {
      console.error("[v0] Failed to fetch CV:", error);
    }
  }

  // Add supporting documents
  if (supportingDocs && supportingDocs.length > 0) {
    for (const doc of supportingDocs) {
      if (doc.file_url) {
        // Only process if file_url exists
        try {
          const file = await fetch(doc.file_url).then((r) => r.blob());
          const fileName = doc.file_url.split("/").pop() || doc.document;
          const docType = doc.document_type || "other";
          documentsFolder.file(`supporting/${docType}/${fileName}`, file);
        } catch (error) {
          console.error(
            `[v0] Failed to fetch document ${doc.document}:`,
            error
          );
        }
      }
    }
  }

  // Add reference attachments
  if (references && references.length > 0) {
    for (let i = 0; i < references.length; i++) {
      const ref = references[i];
      if (ref.reference_entry?.attachments) {
        for (const attachment of ref.reference_entry.attachments) {
          try {
            const file = await fetch(attachment.url).then((r) => r.blob());
            const fileName = attachment.url.split("/").pop() || attachment.file;
            documentsFolder.file(
              `references/reference_${i + 1}/${fileName}`,
              file
            );
          } catch (error) {
            console.error(
              `[v0] Failed to fetch attachment ${attachment.file}:`,
              error
            );
          }
        }
      }
    }
  }

  // Add metadata
  const metadata = `SUPPORTING DOCUMENTS ARCHIVE
Generated: ${new Date().toISOString()}
Employee: ${employeeName || "Unknown"}

Contents:
- cv/: Employee CV and credentials
- supporting/: All supporting documents organized by type
- references/: Reference letter attachments

Total Files: ${
    supportingDocs?.filter((doc) => doc.file_url).length || 0
  } supporting documents`;

  documentsFolder.file("METADATA.txt", metadata);

  return zip.generateAsync({ type: "blob" });
}

// Function to download a Blob as a file
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper function to load html2pdf library
async function loadHtml2pdf(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).html2pdf) {
      resolve((window as any).html2pdf);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
      resolve((window as any).html2pdf);
    };
    script.onerror = () => {
      reject(new Error("Failed to load html2pdf library"));
    };
    document.head.appendChild(script);
  });
}
