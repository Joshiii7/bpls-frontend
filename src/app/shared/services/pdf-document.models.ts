// Structured input contract for PdfGeneratorService. Any page that wants a PDF just
// builds one of these from its already-loaded data, no page-specific logic lives in
// the generator itself, so the same service/interfaces can back other detail pages later.

export interface PdfKeyValue {
  label: string;
  value: string;
}

export interface PdfSection {
  heading: string;
  rows: PdfKeyValue[];
}

export interface PdfDocumentImage {
  label: string;
  /** Any browser-renderable image src: data URI (png/jpg/webp/svg) or same-origin URL. */
  url: string;
}

export interface PdfApprovalRow {
  department: string;
  status: string;
  notes?: string | null;
}

export interface PdfSignatureBlock {
  name: string;
  role: string;
  imageUrl?: string | null;
}

export interface ApplicationPdfData {
  documentTitle: string;
  subtitle?: string;
  logoUrl?: string;
  trackingNumber?: string;
  businessIdNumber?: string;
  statusLabel?: string;
  generatedAt?: Date;
  /** Key/value grid sections, business info, operation info, etc. */
  sections: PdfSection[];
  documents?: PdfDocumentImage[];
  approvals?: PdfApprovalRow[];
  signatures?: PdfSignatureBlock[];
  declaration?: string;
}
