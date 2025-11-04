import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 to-secondary/10 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-lg bg-primary text-primary-foreground">
            <span className="text-2xl font-bold">AMMA</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Employee Compliance Report System
          </h1>
          <p className="text-gray-600">
            Professional compliance documentation with efficient document
            handling
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">
              Parallel Document Loading
            </h3>
            <p className="text-gray-600 text-sm">
              All 16+ documents fetched simultaneously from private bucket, no
              sequential delays
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Organized Sections</h3>
            <p className="text-gray-600 text-sm">
              Employment history, pre-employment docs, qualifications,
              references, and supporting documents
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">PDF Export</h3>
            <p className="text-gray-600 text-sm">
              Generate downloadable PDFs with html2pdf library with
              print-optimized styling
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Professional Design</h3>
            <p className="text-gray-600 text-sm">
              Clean tables, lavender headers, blue accents matching your Figma
              design exactly
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/report/report_001"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            View Sample Report
          </Link>
        </div>

        {/* Architecture Info */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Architecture</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-primary mb-1">
                Document Service (`lib/document-service.ts`)
              </dt>
              <dd className="text-gray-600">
                Fetches all document URLs in parallel using Promise.all(),
                preventing bottlenecks
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary mb-1">
                API Routes (`app/api/documents/`)
              </dt>
              <dd className="text-gray-600">
                Mock endpoints for document URL retrieval and PDF generation
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary mb-1">
                Type System (`lib/types.ts`)
              </dt>
              <dd className="text-gray-600">
                Strong TypeScript interfaces for reports, documents, references,
                and employment records
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary mb-1">
                Component Structure
              </dt>
              <dd className="text-gray-600">
                Modular components for each section with collapsible document
                details
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
