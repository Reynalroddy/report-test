"use client"

import type { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
  pageNumber?: number
}

export function PageLayout({ children, pageNumber }: PageLayoutProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-12 mb-8 page-break" style={{ minHeight: "1100px" }}>
      {children}
    </div>
  )
}
