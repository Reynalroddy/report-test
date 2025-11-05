"use client"

import type { ComplianceReport } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface ComprehensiveReportProps {
  reportData: ComplianceReport
}

export function ComprehensiveReport({ reportData }: ComprehensiveReportProps) {
  const data = reportData.data

  return (
    <div data-report-container className="space-y-8">
      {/* Cover Page */}
      <div data-page="cover" className="bg-white p-12 rounded-lg shadow-sm page-break">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Compliance Verification Report</h1>
          <div className="h-1 w-32 bg-primary mx-auto mb-6"></div>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-600">Candidate Name</p>
              <p className="text-lg">{data.profile.user_full_name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Report ID</p>
              {/* Show first 13 characters of UUID for readability */}
              <p className="text-lg">{data.id.slice(0, 13)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Verification Status</p>
              <Badge className="capitalize">{data.verification_status.replace("_", " ")}</Badge>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Employee Type</p>
              <p className="capitalize">{data.employee_type.replace("_", " ")}</p>
            </div>
          </div>

          <div className="border-t pt-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Email:</span> {data.profile.email}</p>
              <p><span className="font-semibold">Phone:</span> {data.profile.phone}</p>
              <p><span className="font-semibold">Address:</span> {data.profile.full_address}</p>
            </div>
          </div>

          <div className="border-t pt-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Care Home</h2>
            <p className="text-lg">{data.care_home.name}</p>
          </div>

          <div className="border-t pt-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Review Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Reviewed By:</span> {data.employment_reviewed_by}</p>
              <p><span className="font-semibold">Reviewed At:</span> {data.employment_reviewed_at}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-center text-xs text-gray-500">
          <p>Report Generated: {new Date().toLocaleDateString()}</p>
          <p className="mt-1">Page 1</p>
        </div>
      </div>

      {/* Employment History */}
      <div data-page="employment-history" className="bg-white p-12 rounded-lg shadow-sm page-break">
        <h2 className="text-2xl font-bold mb-6">Employment History</h2>
        
        <div className="mb-4">
          <Badge variant={data.is_employment_history_verified ? "default" : "secondary"}>
            {data.is_employment_history_verified ? "Verified" : "Not Verified"}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Company</th>
                <th className="border border-gray-300 p-3 text-left">Role</th>
                <th className="border border-gray-300 p-3 text-left">Start Date</th>
                <th className="border border-gray-300 p-3 text-left">End Date</th>
                <th className="border border-gray-300 p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.employment_histories.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{emp.company_name}</td>
                  <td className="border border-gray-300 p-3">{emp.role}</td>
                  <td className="border border-gray-300 p-3">{emp.start_date}</td>
                  <td className="border border-gray-300 p-3">{emp.end_date || "Present"}</td>
                  <td className="border border-gray-300 p-3">
                    <Badge variant={emp.verification_status === "verified" ? "default" : "secondary"}>
                      {emp.verification_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 pt-6 border-t text-right text-xs text-gray-500">
          <p>Report Produced by {data.care_home.name}</p>
          <p className="mt-1">Page 2</p>
        </div>
      </div>

      {/* DBS Information */}
      <div data-page="dbs-information" className="bg-white p-12 rounded-lg shadow-sm page-break">
        <h2 className="text-2xl font-bold mb-6">DBS Check Information</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Certificate Number</p>
              <p className="text-lg">{data.dbs_information.certificate_number}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Status</p>
              <Badge variant={data.dbs_information.is_valid ? "default" : "destructive"}>
                {data.dbs_information.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Valid</p>
              <div className="flex items-center gap-2">
                {data.dbs_information.is_valid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span>{data.dbs_information.is_valid ? "Yes" : "No"}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Data Generated</p>
              <p>{data.dbs_information.result.data_generated}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">Result Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Name</p>
                <p>{data.dbs_information.result.first_name} {data.dbs_information.result.last_name}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Result Status</p>
                <p>{data.dbs_information.result.status}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">Review Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Reviewed By</p>
                <p>{data.dbs_information.reviewed_by}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Reviewed At</p>
                <p>{data.dbs_information.reviewed_at}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-right text-xs text-gray-500">
          <p>Report Produced by {data.care_home.name}</p>
          <p className="mt-1">Page 3</p>
        </div>
      </div>

      {/* Identity Verification */}
      <div data-page="identity-verification" className="bg-white p-12 rounded-lg shadow-sm page-break">
        <h2 className="text-2xl font-bold mb-6">Identity Verification (Onfido)</h2>

        {data.onfido_results.map((result, idx) => (
          <div key={result.id} className="mb-8 pb-8 border-b last:border-0">
            <h3 className="text-lg font-bold mb-4">Verification #{idx + 1}</h3>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-gray-600 mb-1">Name</p>
                <p>{result.first_name} {result.last_name}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Status</p>
                <Badge variant={result.status === "approved" ? "default" : "secondary"}>
                  {result.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Document Type</p>
                <p className="capitalize">{result.document_type}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Document Number</p>
                <p>{result.document_number}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Issuing Country</p>
                <p>{result.issuing_country}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Issuing Date</p>
                <p>{result.issuing_date}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Expiry Date</p>
                <p>{result.expiry_date}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Completed At</p>
                <p>{new Date(result.completed_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Reviewed By</p>
                <p>{result.reviewed_by}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600 mb-1">Reviewed At</p>
                <p>{result.reviewed_at}</p>
              </div>
            </div>

            {result.document_photos && result.document_photos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Document Photos: {result.document_photos.length}</p>
              </div>
            )}
          </div>
        ))}

        <div className="mt-12 pt-6 border-t text-right text-xs text-gray-500">
          <p>Report Produced by {data.care_home.name}</p>
          <p className="mt-1">Page 4</p>
        </div>
      </div>

      {/* References */}
      <div data-page="references" className="bg-white p-12 rounded-lg shadow-sm page-break">
        <h2 className="text-2xl font-bold mb-6">References</h2>

        {data.references.map((ref, idx) => (
          <div key={ref.id} className="mb-8 pb-8 border-b last:border-0">
            <h3 className="text-lg font-bold mb-4 text-primary">Reference #{idx + 1}</h3>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Referee Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-600">Name</p>
                  <p>{ref.referee_name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Role</p>
                  <p>{ref.referee_role}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Company</p>
                  <p>{ref.company_name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Email</p>
                  <p>{ref.referee_email}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Phone</p>
                  <p>{ref.referee_phone_number}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Reference Type</p>
                  <p className="capitalize">{ref.reference_type.replace("_", " ")}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-3">Reference Entry</h4>
              <div className="text-sm space-y-2">
                <div>
                  <p className="font-semibold text-gray-600">Date Received</p>
                  <p>{ref.reference_entry.date_received}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Notes</p>
                  <p className="whitespace-pre-wrap">{ref.reference_entry.notes}</p>
                </div>
                {ref.reference_entry.attachments && ref.reference_entry.attachments.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-600">Attachments</p>
                    <ul className="list-disc list-inside">
                      {ref.reference_entry.attachments.map((att) => (
                        <li key={att.id}>{att.file} ({(att.file_size / 1024).toFixed(1)} KB)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {ref.verification_logs && ref.verification_logs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Verification</h4>
                {ref.verification_logs.map((log) => (
                  <div key={log.id} className="text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-600">Outcome</p>
                        <p>{log.verification_outcome}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Date Contacted</p>
                        <p>{log.date_contacted}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-semibold text-gray-600">Verification Notes</p>
                        <p className="whitespace-pre-wrap">{log.verification_notes}</p>
                      </div>
                      {log.additional_notes && (
                        <div className="col-span-2">
                          <p className="font-semibold text-gray-600">Additional Notes</p>
                          <p className="whitespace-pre-wrap">{log.additional_notes}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-600">Verified By</p>
                        <p>{log.verified_by}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-12 pt-6 border-t text-right text-xs text-gray-500">
          <p>Report Produced by {data.care_home.name}</p>
          <p className="mt-1">Page 5</p>
        </div>
      </div>

      {/* Supporting Documents */}
      <div data-page="supporting-documents" className="bg-white p-12 rounded-lg shadow-sm page-break">
        <h2 className="text-2xl font-bold mb-6">Supporting Documents</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Document Name</th>
                <th className="border border-gray-300 p-3 text-left">Type</th>
                <th className="border border-gray-300 p-3 text-left">Size</th>
                <th className="border border-gray-300 p-3 text-left">Reviewed</th>
                <th className="border border-gray-300 p-3 text-left">Reviewed By</th>
              </tr>
            </thead>
            <tbody>
              {data.supporting_documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{doc.document}</td>
                  <td className="border border-gray-300 p-3 capitalize">{doc.document_type.replace("_", " ")}</td>
                  <td className="border border-gray-300 p-3">{(doc.document_size / 1024).toFixed(1)} KB</td>
                  <td className="border border-gray-300 p-3">
                    {doc.is_reviewed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                  </td>
                  <td className="border border-gray-300 p-3">{doc.reviewed_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.cv && (
          <div className="mt-8 p-4 bg-gray-50 rounded">
            <h3 className="font-bold mb-3">Curriculum Vitae (CV)</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">File:</span> {data.cv.file}</p>
              <p><span className="font-semibold">Size:</span> {(data.cv.file_size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t text-right text-xs text-gray-500">
          <p>Report Produced by {data.care_home.name}</p>
          <p className="mt-1">Page 6</p>
        </div>
      </div>

      {/* Compliance Checks Summary */}
      <div data-page="checks-summary" className="bg-white p-12 rounded-lg shadow-sm page-break">
        <h2 className="text-2xl font-bold mb-6">Compliance Checks Summary</h2>

        <div className="space-y-6">
          {data.checks.map((check, idx) => (
            <div key={idx} className="border-l-4 border-primary pl-4">
              <h3 className="font-bold capitalize mb-2">{check.name.replace("_", " ")}</h3>
              <p className="text-sm text-gray-700">{check.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="font-bold mb-4">Task Completion Status</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.todo_items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                {item.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
                <span className="capitalize">{item.task_type.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t text-right text-xs text-gray-500">
          <p>Report Produced by {data.care_home.name}</p>
          <p className="mt-1">Page 7</p>
        </div>
      </div>
    </div>
  )
}
