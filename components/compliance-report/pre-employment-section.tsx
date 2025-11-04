"use client"

interface PreEmploymentSectionProps {
  title: string
  category: string
}

export function PreEmploymentSection({ title, category }: PreEmploymentSectionProps) {
  return (
    <div className="page-break w-full bg-white p-12">
      <h2 className="mb-4 text-2xl font-bold">2. Pre-Employment</h2>
      <h3 className="mb-8 text-lg font-semibold text-gray-700">{title}</h3>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-secondary">
            <th className="border border-gray-300 p-3 text-left font-semibold">Document Checked</th>
            <th className="border border-gray-300 p-3 text-left font-semibold">Details</th>
            <th className="border border-gray-300 p-3 text-left font-semibold">Verified by Who</th>
            <th className="border border-gray-300 p-3 text-left font-semibold">Date Verified</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-3">Right_to_work.pdf</td>
            <td className="border border-gray-300 p-3">Share Code: PSB7ZXX2XX</td>
            <td className="border border-gray-300 p-3">Benjamin Wise</td>
            <td className="border border-gray-300 p-3">28/4/2023</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-3">HealthCare Pro Certificate.pdf</td>
            <td className="border border-gray-300 p-3"></td>
            <td className="border border-gray-300 p-3">Benjamin Wise</td>
            <td className="border border-gray-300 p-3">28/4/2023</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-12 border-t pt-4 text-right text-xs text-gray-600">
        <p>Report Produced by Safer Recruit</p>
        <p>Page 3</p>
      </div>
    </div>
  )
}
