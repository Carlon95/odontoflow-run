-- Migração: arquivos do paciente (radiografias, fotos, documentos)
-- via Vercel Blob, e campo de controle para retorno/recall
-- automático.

-- ============================================================
-- Patient: controle de último lembrete de retorno enviado
-- ============================================================
ALTER TABLE "Patient"
  ADD COLUMN "lastRecallSentAt" TIMESTAMP(3);

-- ============================================================
-- PatientDocument: arquivos anexados ao paciente
-- ============================================================
CREATE TABLE "PatientDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Documento',
    "url" TEXT NOT NULL,
    "blobPath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PatientDocument_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PatientDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "PatientDocument_patientId_idx" ON "PatientDocument" ("patientId");
