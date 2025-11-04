"use client"

import type { Reference } from "@/lib/types"

interface ReferencesSectionProps {
  references: Reference[]
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  return (
    <div className="page-break w-full bg-white p-12">
      <h2 className="mb-8 text-2xl font-bold">5. References</h2>

      {references.map((ref, idx) => (
        <div key={ref.id} className="mb-12">
          <h3 className="mb-6 text-lg font-bold text-primary">Reference {idx + 1}</h3>

          {/* Referee Details */}
          <div className="mb-8">
            <h4 className="mb-4 font-semibold text-gray-700">Referee Details</h4>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Referee</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Position</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Care Home</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Email</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Phone</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">{ref.name}</td>
                  <td className="border border-gray-300 p-3">{ref.position}</td>
                  <td className="border border-gray-300 p-3">{ref.careHome}</td>
                  <td className="border border-gray-300 p-3">{ref.email}</td>
                  <td className="border border-gray-300 p-3">{ref.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Reference Details */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="mb-3 font-semibold">Reference Details</h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-semibold">Date Received:</dt>
                <dd>{ref.dateReceived}</dd>
              </div>
              <div>
                <dt className="font-semibold">Reference Notes:</dt>
                <dd>{ref.referenceNotes}</dd>
              </div>
              <div>
                <dt className="font-semibold">Attachment Name:</dt>
                <dd>{ref.attachmentName}</dd>
              </div>
            </dl>
          </div>

          {/* Reference Verification */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-700">Reference Verification</h4>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Verification Outcome</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Verification Note</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Verified by Who (Company)</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Date Verified</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">{ref.verificationOutcome}</td>
                  <td className="border border-gray-300 p-3">{ref.verificationNote}</td>
                  <td className="border border-gray-300 p-3">{ref.verifiedBy}</td>
                  <td className="border border-gray-300 p-3">{ref.dateVerified}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="mt-12 border-t pt-4 text-right text-xs text-gray-600">
        <p>Report Produced by Safer Recruit</p>
        <p>Page 5</p>
      </div>
    </div>
  )
}
