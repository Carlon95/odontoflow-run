import { prisma } from "@/src/lib/prisma";

export async function findAll() {
  return prisma.evolution.findMany({
    orderBy: {
      sessionDate: "desc",
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findByPatientId(
  patientId: string
) {
  return prisma.evolution.findMany({
    where: {
      patientId,
    },
    orderBy: {
      sessionDate: "desc",
    },
  });
}

export async function findById(
  id: string
) {
  return prisma.evolution.findUnique({
    where: {
      id,
    },
  });
}

export async function create(data: {
  patientId: string;
  content: string;
  sessionDate?: Date;
  nextSession?: Date | null;
}) {
  return prisma.evolution.create({
    data: {
      patientId: data.patientId,
      content: data.content,
      sessionDate:
        data.sessionDate ?? new Date(),
      nextSession:
        data.nextSession,
    },
  });
}

export async function update(
  id: string,
  data: {
    content: string;
    sessionDate: Date;
    nextSession?: Date | null;
  }
) {
  return prisma.evolution.update({
    where: {
      id,
    },
    data: {
      content: data.content,
      sessionDate: data.sessionDate,
      nextSession: data.nextSession,
    },
  });
}

export async function remove(
  id: string
) {
  return prisma.evolution.delete({
    where: {
      id,
    },
  });
}