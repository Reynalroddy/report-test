"use client";

import type React from "react";

import { useState, use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  FileCheck,
} from "lucide-react";
import { mockReportData } from "@/lib/mock-report-data";
import { DownloadComplianceDialog } from "@/components/compliance/download-compliance-dialog";
import { ComprehensiveReport } from "@/components/compliance-report/comprehensive-report";

type VerificationStatus =
  | "fully_compliant"
  | "partially_compliant"
  | "not_compliant"
  | "pending";

const statusConfig: Record<
  VerificationStatus,
  { color: string; icon: React.ReactNode; label: string }
> = {
  fully_compliant: {
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="w-6 h-6" />,
    label: "Fully Compliant",
  },
  partially_compliant: {
    color: "bg-yellow-100 text-yellow-800",
    icon: <AlertCircle className="w-6 h-6" />,
    label: "Partially Compliant",
  },
  not_compliant: {
    color: "bg-red-100 text-red-800",
    icon: <AlertCircle className="w-6 h-6" />,
    label: "Not Compliant",
  },
  pending: {
    color: "bg-gray-100 text-gray-800",
    icon: <Clock className="w-6 h-6" />,
    label: "Pending",
  },
};

export default function ComplianceResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const report = mockReportData;
  const status =
    (report.data.verification_status as VerificationStatus) || "pending";
  const profile = report.data.profile;
  const config = statusConfig[status];

  const completedTodos = report.data.todo_items.filter(
    (t) => t.status === "completed"
  ).length;
  const totalTodos = report.data.todo_items.length;
  const completionPercentage = Math.round((completedTodos / totalTodos) * 100);

  const totalDocuments =
    (report.data.supporting_documents?.length || 0) +
    (report.data.references?.length || 0) +
    (report.data.cv ? 1 : 0) +
    (report.data.dbs_information ? 1 : 0) +
    (report.data.onfido_results?.length || 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-secondary/10 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Compliance Check Result
              </h1>
              <p className="text-muted-foreground">
                Review and download compliance verification report
              </p>
            </div>
            <Button
              onClick={() => setIsDownloadOpen(true)}
              size="lg"
              className="gap-2"
            >
              <Download className="w-5 h-5" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <div
          className={`${config.color} rounded-lg p-8 mb-8 border-l-4 border-current`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1">{config.icon}</div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{config.label}</h2>
                <p className="text-sm opacity-90">
                  {status === "fully_compliant" &&
                    "All compliance checks have been completed and verified"}
                  {status === "partially_compliant" &&
                    "Some compliance checks are still pending review"}
                  {status === "not_compliant" &&
                    "There are concerns that need to be addressed"}
                  {status === "pending" &&
                    "Compliance verification is in progress"}
                </p>
              </div>
            </div>
            <Badge className="text-lg px-4 py-2">
              {completionPercentage}% Complete
            </Badge>
          </div>
        </div>

        {/* Employee Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Employee Name</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{profile.user_full_name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                ID: {report.data.id.slice(0, 8)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Employee Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize">
                {report.data.employee_type.replace("_", " ")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalDocuments}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Files attached to report
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">{profile.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Address</p>
              <p className="font-medium">{profile.full_address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Checks Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Compliance Checks</CardTitle>
            <CardDescription>
              Verification items completed for this employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.data.checks.map((check, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold capitalize">
                      {check.name.replace("_", " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {check.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Employment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">
                {report.data.is_employment_history_verified
                  ? "✓ Verified"
                  : "✗ Pending"}
              </p>
              <p className="text-sm text-muted-foreground">
                {report.data.employment_histories.length} employment records
                found
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Reviewed by: {report.data.employment_reviewed_by}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                DBS Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">
                {report.data.dbs_information.is_valid ? "✓ Valid" : "✗ Invalid"}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                Status: {report.data.dbs_information.status.replace("_", " ")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Cert: {report.data.dbs_information.certificate_number}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Document Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Document Summary</CardTitle>
            <CardDescription>
              Files included in downloadable report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="text-2xl font-bold text-primary">
                  {report.data.supporting_documents?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supporting Documents
                </p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="text-2xl font-bold text-primary">
                  {report.data.references?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">References</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="text-2xl font-bold text-primary">
                  {report.data.onfido_results?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Identity Verification
                </p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="text-2xl font-bold text-primary">1</p>
                <p className="text-xs text-muted-foreground mt-1">
                  DBS Certificate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Report Sections */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Compliance Report</CardTitle>
              <CardDescription>
                Complete report with all sections (ready for PDF export)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComprehensiveReport reportData={report} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Download Dialog */}
      <DownloadComplianceDialog
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        reportData={report}
      />
    </div>
  );
}
