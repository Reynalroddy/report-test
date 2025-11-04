import type { Document } from "./types"

// Service to fetch document URLs from private bucket in parallel
// This prevents the "messiness" of sequential calls
export async function fetchDocumentUrls(documentIds: string[]): Promise<Map<string, string>> {
  if (!documentIds.length) return new Map()

  // Fetch all document URLs in parallel using Promise.all
  const urlPromises = documentIds.map((id) =>
    fetch(`/api/documents/get-url?id=${id}`)
      .then((res) => res.json())
      .then((data) => [id, data.url] as [string, string])
      .catch((err) => {
        console.error(`Failed to fetch document ${id}:`, err)
        return [id, ""] as [string, string]
      }),
  )

  const results = await Promise.all(urlPromises)
  return new Map(results.filter(([, url]) => url))
}

// Batch fetch with optional lazy loading
export async function fetchDocumentsForSection(documents: Document[], lazy = false): Promise<Document[]> {
  if (!lazy) {
    // Eager load all at once
    const ids = documents.map((d) => d.id)
    const urls = await fetchDocumentUrls(ids)

    return documents.map((doc) => ({
      ...doc,
      fileUrl: urls.get(doc.id) || doc.fileUrl,
    }))
  }

  // Lazy load on demand
  return documents
}

// Cache to avoid refetching
const urlCache = new Map<string, string>()

export async function getDocumentUrl(documentId: string): Promise<string> {
  if (urlCache.has(documentId)) {
    return urlCache.get(documentId) || ""
  }

  const response = await fetch(`/api/documents/get-url?id=${documentId}`)
  const data = await response.json()

  if (data.url) {
    urlCache.set(documentId, data.url)
  }

  return data.url || ""
}
