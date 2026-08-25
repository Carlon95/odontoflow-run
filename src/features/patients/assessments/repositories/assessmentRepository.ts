import { prisma } from "@/src/lib/prisma";

export async function findByPatientId(
  patientId: string
) {
  return prisma.assessment.findMany({
    where: {
      patientId,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function findById(
  id: string
) {
  return prisma.assessment.findUnique({
    where: {
      id,
    },
  });
}

export async function create(data: {
  patientId: string;
  type: string;
  description: string;
  date?: Date;
}) {
  return prisma.assessment.create({
    data: {
      patientId: data.patientId,
      type: data.type,
      description: data.description,
      date: data.date ?? new Date(),
    },
  });
}

export async function update(
  id: string,
  data: {
    type: string;
    description: string;
    date: Date;
  }
) {
  return prisma.assessment.update({
    where: {
      id,
    },
    data: {
      type: data.type,
      description: data.description,
      date: data.date,
    },
  });
}

export async function remove(
  id: string
) {
  return prisma.assessment.delete({
    where: {
      id,
    },
  });
}
