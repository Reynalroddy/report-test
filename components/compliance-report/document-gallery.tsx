"use client"

import type { Document } from "@/lib/types"

interface DocumentGalleryProps {
  documents: Document[]
}

export function DocumentGallery({ documents }: DocumentGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {documents.map((doc) => (
        <div key={doc.id} className="border-4 border-gray-800 rounded-lg overflow-hidden bg-gray-200">
          <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            {/* Placeholder for actual document images */}
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-sm font-semibold text-gray-700">{doc.name}</p>
              <p className="text-xs text-gray-600 mt-2">
                {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(2)} KB` : "Document"}
              </p>
            </div>
          </div>
          <div className="bg-white p-2 text-center text-xs font-semibold">
            {doc.name === "Passport Front" ? "Front View" : "Back View"}
          </div>
        </div>
      ))}
    </div>
  )
}
