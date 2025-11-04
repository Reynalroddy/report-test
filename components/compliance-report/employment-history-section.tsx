"use client"

import type { EmploymentRecord } from "@/lib/types"

interface EmploymentHistorySectionProps {
  records: EmploymentRecord[]
}

export function EmploymentHistorySection({ records }: EmploymentHistorySectionProps) {
  const safeRecords = records || []

  return (
    <div className="page-break w-full bg-white p-12">
      <h2 className="mb-8 text-2xl font-bold">1. Employment History & Gaps (most recent to last)</h2>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-secondary">
            <th className="border border-gray-300 p-3 text-left font-semibold">
              Employment History & Gaps (most recent to last)
            </th>
            <th className="border border-gray-300 p-3 text-left font-semibold">Date Started</th>
            <th className="border border-gray-300 p-3 text-left font-semibold">Date Ended</th>
            <th className="border border-gray-300 p-3 text-left font-semibold">Verified by Who</th>
            <th className="border border-gray-300 p-3 text-left font-semibold">Date Verified</th>
          </tr>
        </thead>
        <tbody>
          {safeRecords.map((record, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 p-3">{record.employer}</td>
              <td className="border border-gray-300 p-3">{record.dateStarted}</td>
              <td className="border border-gray-300 p-3">{record.dateEnded}</td>
              <td className="border border-gray-300 p-3">{record.verifiedBy}</td>
              <td className="border border-gray-300 p-3">{record.dateVerified}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12 border-t pt-4 text-right text-xs text-gray-600">
        <p>Report Produced by Safer Recruit</p>
        <p>Page 2</p>
      </div>
    </div>
  )
}
