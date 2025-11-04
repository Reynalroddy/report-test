"use client"

interface SectionHeaderProps {
  number: string
  title: string
  subtitle?: string
}

export function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-2">
        <img
          src="/placeholder-logo.png"
          alt="AMMA Logo"
          className="h-8"
        />
        <span className="text-xs text-gray-600">AMMA Child Care.</span>
      </div>
      <h1 className="text-2xl font-bold mb-4">Employee Compliance Report.</h1>
      {number && (
        <h2 className="text-lg font-semibold mb-2">
          {number}. {title}
        </h2>
      )}
      {subtitle && <h3 className="text-base font-semibold text-gray-700">{subtitle}</h3>}
    </div>
  )
}
