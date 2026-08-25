-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMP(3),
  ADD COLUMN "resetTokenHash" TEXT,
  ADD COLUMN "resetTokenExpiresAt" TIMESTAMP(3);
