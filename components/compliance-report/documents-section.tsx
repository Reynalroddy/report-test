"use client"

import { useState } from "react"
import type { Document } from "@/lib/types"

interface DocumentsSectionProps {
  title: string
  documents: Document[]
}

export function DocumentsSection({ title, documents }: DocumentsSectionProps) {
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set())

  const toggleExpand = (docId: string) => {
    const newSet = new Set(expandedDocs)
    if (newSet.has(docId)) {
      newSet.delete(docId)
    } else {
      newSet.add(docId)
    }
    setExpandedDocs(newSet)
  }

  return (
    <div className="w-full bg-white p-6 mb-6">
      <h3 className="mb-4 text-xl font-bold">{title}</h3>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleExpand(doc.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 transition-transform ${expandedDocs.has(doc.id) ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium">{doc.name}</span>
              </div>
              <span className="text-sm text-gray-500">{doc.category}</span>
            </button>

            {expandedDocs.has(doc.id) && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="font-semibold py-2 pr-4">Document Checked</td>
                      <td>{doc.name}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 pr-4">Verified by Who</td>
                      <td>{doc.verifiedBy || "-"}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold py-2 pr-4">Date Verified</td>
                      <td>{doc.dateVerified || "-"}</td>
                    </tr>
                    {doc.fileUrl && (
                      <tr>
                        <td colSpan={2} className="py-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Document
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
