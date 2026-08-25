export const DOCUMENT_CATEGORIES = [
  "Radiografia",
  "Foto",
  "Exame",
  "Documento",
] as const;

export type DocumentCategory =
  (typeof DOCUMENT_CATEGORIES)[number];

export interface PatientDocument {
  id: string;
  patientId: string;

  name: string;
  category: string;

  url: string;
  mimeType: string;
  size: number;

  uploadedBy?: {
    id: string;
    name: string;
  } | null;

  createdAt: string;
}
