import { prisma } from "@/src/lib/prisma";

// ==============================
// Queries
// ==============================

export async function findByPatientId(
  patientId: string
) {
  return prisma.patientDocument.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findById(id: string) {
  return prisma.patientDocument.findUnique({
    where: { id },
  });
}

// ==============================
// Commands
// ==============================

export async function create(data: {
  patientId: string;
  name: string;
  category: string;
  url: string;
  blobPath: string;
  mimeType: string;
  size: number;
  uploadedById?: string;
}) {
  return prisma.patientDocument.create({
    data,
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function remove(id: string) {
  return prisma.patientDocument.delete({
    where: { id },
  });
}
