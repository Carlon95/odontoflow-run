-- Migração: transforma o domínio da aplicação (antes voltado a uma
-- clínica de terapia) em um SaaS de atendimento odontológico.
-- Instância única por clínica (sem multi-tenant nesta etapa).

-- ============================================================
-- Patient: novos campos de identificação/convênio
-- ============================================================
ALTER TABLE "Patient"
  ADD COLUMN "email" TEXT,
  ADD COLUMN "cpf" TEXT,
  ADD COLUMN "insurancePlan" TEXT;

-- "Em Terapia" não existe mais como status de paciente.
UPDATE "Patient" SET "status" = 'Em Tratamento' WHERE "status" = 'Em Terapia';

-- ============================================================
-- Anamnesis: campos adaptados para avaliação odontológica
-- ============================================================
ALTER TABLE "Anamnesis"
  DROP COLUMN "historyOfPresentIllness",
  DROP COLUMN "familyHistory",
  DROP COLUMN "surgeries",
  DROP COLUMN "lifestyle",
  ADD COLUMN "medicalConditions" TEXT,
  ADD COLUMN "previousSurgeries" TEXT,
  ADD COLUMN "isPregnant" BOOLEAN,
  ADD COLUMN "isSmoker" BOOLEAN,
  ADD COLUMN "hasBruxism" BOOLEAN,
  ADD COLUMN "lastDentalVisit" TIMESTAMP(3),
  ADD COLUMN "dentalHistory" TEXT,
  ADD COLUMN "oralHygieneHabits" TEXT;

-- ============================================================
-- Procedure: catálogo de procedimentos odontológicos
-- ============================================================
CREATE TABLE "Procedure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "defaultPrice" DOUBLE PRECISION,
    "defaultDurationMinutes" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================================
-- TreatmentPlan: vira um "cabeçalho" com itens (procedimentos
-- planejados) em vez de campos de plano terapêutico
-- ============================================================
ALTER TABLE "TreatmentPlan"
  DROP COLUMN "approach",
  DROP COLUMN "mainGoal",
  DROP COLUMN "goals",
  DROP COLUMN "frequency",
  DROP COLUMN "interventionPlan",
  DROP COLUMN "dischargeCriteria";

ALTER TABLE "TreatmentPlan" RENAME COLUMN "notes" TO "generalNotes";

CREATE TABLE "TreatmentPlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "treatmentPlanId" TEXT NOT NULL,
    "procedureId" TEXT,
    "toothNumber" TEXT,
    "toothFace" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Planejado',
    "estimatedCost" DOUBLE PRECISION,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TreatmentPlanItem_treatmentPlanId_fkey" FOREIGN KEY ("treatmentPlanId") REFERENCES "TreatmentPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TreatmentPlanItem_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================================
-- Appointment: profissional (dentista) e procedimento vinculados
-- ============================================================
ALTER TABLE "Appointment"
  ADD COLUMN "professionalId" TEXT,
  ADD COLUMN "procedureId" TEXT;

ALTER TABLE "Appointment" ALTER COLUMN "duration" SET DEFAULT 30;

ALTER TABLE "Appointment"
  ADD CONSTRAINT "Appointment_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "Appointment_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- Message: lembrete de sessão -> lembrete de consulta
-- ============================================================
UPDATE "Message" SET "type" = 'LembreteConsulta' WHERE "type" = 'LembreteSessao';

-- ============================================================
-- User: papel padrão vira "Dentista" + dados profissionais (CRO)
-- ============================================================
ALTER TABLE "User"
  ADD COLUMN "croNumber" TEXT,
  ADD COLUMN "specialty" TEXT;

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Dentista';

UPDATE "User" SET "role" = 'Dentista' WHERE "role" = 'Terapeuta';
