import { type NextRequest, NextResponse } from "next/server"

// Mock endpoint - replace with your actual private bucket logic
// This could fetch from Vercel Blob, AWS S3, or any private storage
export async function GET(request: NextRequest) {
  const documentId = request.nextUrl.searchParams.get("id")

  if (!documentId) {
    return NextResponse.json({ error: "Document ID required" }, { status: 400 })
  }

  // Mock database of documents stored in private bucket
  // In production, this would query your database and generate signed URLs
  const mockDocuments: Record<string, string> = {
    doc_001: "https://example.com/documents/passport-front.jpg",
    doc_002: "https://example.com/documents/passport-back.jpg",
    doc_003: "https://example.com/documents/right-to-work.pdf",
    doc_004: "https://example.com/documents/healthcare-certificate.pdf",
    doc_005: "https://example.com/documents/health-declaration.pdf",
    doc_006: "https://example.com/documents/police-check.pdf",
    doc_007: "https://example.com/documents/covid-test.jpg",
    doc_008: "https://example.com/documents/utility-bill.pdf",
    doc_009: "https://example.com/documents/bank-statement.pdf",
    doc_010: "https://example.com/documents/dbs-certificate.pdf",
    doc_011: "https://example.com/documents/reference-1.pdf",
    doc_012: "https://example.com/documents/reference-2.pdf",
  }

  const url = mockDocuments[documentId]

  if (!url) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  return NextResponse.json({ url })
}
