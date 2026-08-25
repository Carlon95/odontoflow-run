import { prisma } from "@/src/lib/prisma";

export async function findByPatientId(
  patientId: string
) {
  return prisma.message.findMany({
    where: {
      patientId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function create(data: {
  patientId: string;
  type: string;
  content: string;
  status: string;
  errorMessage?: string;
}) {
  return prisma.message.create({
    data,
  });
}
