import { prisma } from "@/src/lib/prisma";

import { AnamnesisFormData } from "../types/anamnesis";

// ==============================
// Queries
// ==============================

export async function findByPatientId(
  patientId: string
) {
  return prisma.anamnesis.findUnique({
    where: {
      patientId,
    },
  });
}

// ==============================
// Commands
// ==============================

export async function save(
  data: AnamnesisFormData
) {
  const { patientId, lastDentalVisit, ...anamnesis } = data;

  const payload = {
    ...anamnesis,
    lastDentalVisit: lastDentalVisit
      ? new Date(lastDentalVisit)
      : null,
  };

  return prisma.anamnesis.upsert({
    where: {
      patientId,
    },

    update: payload,

    create: {
      patientId,
      ...payload,
    },
  });
}