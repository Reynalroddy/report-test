"use client"

interface ReportHeaderProps {
  employeeName: string
  email: string
  phone: string
  address: string
  nationality: string
  dateOfBirth: string
}

export function ReportHeader({ employeeName, email, phone, address, nationality, dateOfBirth }: ReportHeaderProps) {
  return (
    <div className="page-break w-full bg-white p-12">
      {/* Logo and Header */}
      <div className="mb-12 flex flex-col items-center gap-2">
        <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl">
          AMMA
        </div>
        <h1 className="text-4xl font-bold text-center">Employee Compliance Report.</h1>
      </div>

      {/* Employee Information */}
      <div className="space-y-4 text-base">
        <div className="flex gap-4">
          <span className="font-semibold">Employee Name:</span>
          <span className="font-bold">{employeeName}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-semibold">Email address:</span>
          <span>{email}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-semibold">Phone number:</span>
          <span>{phone}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-semibold">Address:</span>
          <span>{address}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-semibold">Nationality:</span>
          <span>{nationality}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-semibold">Date of Birth:</span>
          <span>{dateOfBirth}</span>
        </div>
      </div>

      {/* Note */}
      <div className="mt-12 rounded-lg bg-red-100 p-4 text-center text-sm font-semibold">
        Please Note: All documents checked are downloaded alongside this report.
      </div>

      {/* Footer */}
      <div className="mt-12 border-t pt-4 text-right text-xs text-gray-600">
        <p>Report Produced by Safer Recruit</p>
        <p>Page 1</p>
      </div>
    </div>
  )
}
