-- AlterTable
ALTER TABLE "FinancialEntry"
  ADD COLUMN "paidAt" TIMESTAMP(3),
  ADD COLUMN "recurringChargeId" TEXT;

-- CreateTable
CREATE TABLE "RecurringCharge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dayOfMonth" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RecurringCharge_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AddForeignKey
ALTER TABLE "FinancialEntry"
  ADD CONSTRAINT "FinancialEntry_recurringChargeId_fkey"
  FOREIGN KEY ("recurringChargeId") REFERENCES "RecurringCharge" ("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Marca como pagas as cobranças que já estavam com status "Pago",
-- preenchendo paidAt com a data já registrada (não tínhamos essa
-- informação separada antes).
UPDATE "FinancialEntry" SET "paidAt" = "date" WHERE "status" = 'Pago';
