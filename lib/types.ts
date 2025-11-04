export interface EmploymentHistory {
  id: string
  company_name: string
  start_date: string
  end_date: string | null
  gap_explanation: string
  role: string
  is_declared: boolean
  is_current: boolean
  verification_status: "verified" | "not_verified"
  alerts: unknown[]
  insights: unknown[]
}

export interface SupportingDocument {
  id: string
  document: string
  document_type: string
  document_size: number
  description: string
  is_reviewed: boolean
  reviewed_by: string
  reviewed_at: string
  file_url?: string
}

export interface ReferenceAttachment {
  id: string
  file: string
  url: string
  file_size: number
}

export interface ReferenceEntry {
  id: string
  date_received: string
  notes: string
  attachments: ReferenceAttachment[]
  added_by: string
}

export interface VerificationLog {
  id: string
  date_contacted: string
  verification_notes: string
  additional_notes: string
  verification_outcome: string
  verified_by: string
}

export interface Reference {
  id: string
  is_for_latest_employment: boolean
  referee_name: string
  company_name: string
  referee_role: string
  referee_email: string
  reference_type: string
  referee_phone_number: string
  is_reviewed: boolean
  reviewed_by: string
  reviewed_at: string
  reference_entry: ReferenceEntry
  verification_logs: VerificationLog[]
}

export interface DBSInformation {
  id: string
  certificate_number: string
  status: string
  is_valid: boolean
  result: {
    status: string
    last_name: string
    first_name: string
    data_generated: string
  }
  file_uploads: unknown[]
  is_reviewed: boolean
  reviewed_by: string
  reviewed_at: string
}

export interface OnfidoResult {
  id: string
  reviewed_at: string
  reviewed_by: string
  is_reviewed: boolean
  verification_type: string
  first_name: string
  last_name: string
  expiry_date: string
  issuing_date: string
  document_type: string
  document_number: string
  issuing_country: string
  completed_at: string
  status: string
  document_photos: string[][]
}

export interface CV {
  id: string
  file: string
  file_size: number
  url: string
}

export interface CareHome {
  id: string
  name: string
  address: string
  regulatory_body: string
  care_home_type: string
  website: string
  services_offered: string
}

export interface Profile {
  user_full_name: string
  email: string
  full_address: string
  phone: string
}

export interface ComplianceReport {
  status: string
  message: string
  code: string
  data: {
    id: string
    employee_type: string
    verification_status: string
    is_employment_reviewed: boolean
    employment_reviewed_by: string
    employment_reviewed_at: string
    konfir_verification_id: string
    checks: Array<{ name: string; description: string }>
    is_employment_history_verified: boolean
    package: unknown
    todo_items: Array<{ task_type: string; status: string }>
    care_home: CareHome
    profile: Profile
    cv: CV
    supporting_documents: SupportingDocument[]
    employment_histories: EmploymentHistory[]
    references: Reference[]
    dbs_information: DBSInformation
    onfido_results: OnfidoResult[]
  }
}
