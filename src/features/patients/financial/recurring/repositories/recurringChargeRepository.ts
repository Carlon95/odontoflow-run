import { prisma } from "@/src/lib/prisma";

export async function findByPatientId(
  patientId: string
) {
  return prisma.recurringCharge.findMany({
    where: {
      patientId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findAllActive() {
  return prisma.recurringCharge.findMany({
    where: {
      active: true,
    },
    include: {
      patient: true,
    },
  });
}

export async function findById(
  id: string
) {
  return prisma.recurringCharge.findUnique({
    where: {
      id,
    },
  });
}

export async function create(data: {
  patientId: string;
  description: string;
  amount: number;
  dayOfMonth: number;
}) {
  return prisma.recurringCharge.create({
    data,
  });
}

export async function update(
  id: string,
  data: {
    description: string;
    amount: number;
    dayOfMonth: number;
  }
) {
  return prisma.recurringCharge.update({
    where: {
      id,
    },
    data,
  });
}

export async function setActive(
  id: string,
  active: boolean
) {
  return prisma.recurringCharge.update({
    where: {
      id,
    },
    data: {
      active,
    },
  });
}

export async function remove(
  id: string
) {
  return prisma.recurringCharge.delete({
    where: {
      id,
    },
  });
}
