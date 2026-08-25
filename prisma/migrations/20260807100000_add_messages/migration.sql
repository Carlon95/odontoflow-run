-- AlterTable
ALTER TABLE "Patient"
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "receiveReminders" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Appointment"
  ADD COLUMN "reminderSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Livre',
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Enviado',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
