import { prisma } from "@/src/lib/prisma";
import { PatientFormData } from "../schemas/patientSchema";
import { Patient } from "../types/patient";

// ==============================
// Queries
// ==============================

export async function findAll(): Promise<Patient[]> {
  const patients = await prisma.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return patients.map(
    (patient: {
      id: string;
      name: string;
      birthDate: Date;
      gender: string;
      status: string;
      email: string | null;
      cpf: string | null;
      insurancePlan: string | null;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      ...patient,
      birthDate: patient.birthDate.toISOString(),
      gender: patient.gender as Patient["gender"],
      status: patient.status as Patient["status"],
    })
  );
}

export async function findById(
  id: string
): Promise<Patient | null> {
  const patient = await prisma.patient.findUnique({
    where: { id },
  });

  if (!patient) {
    return null;
  }

  return {
    ...patient,
    birthDate: patient.birthDate.toISOString(),
    gender: patient.gender as Patient["gender"],
    status: patient.status as Patient["status"],
  };
}

export async function count() {
  return prisma.patient.count();
}

export async function countWithoutAnamnesis() {
  return prisma.patient.count({
    where: {
      anamnesis: null,
    },
  });
}

export async function countByStatus() {
  return prisma.patient.groupBy({
    by: ["status"],
    _count: true,
  });
}

export async function countCreatedInRange(
  start: Date,
  end: Date
) {
  return prisma.patient.count({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });
}

// ==============================
// Commands
// ==============================

export async function create(
  data: PatientFormData
) {
  return prisma.patient.create({
    data: {
      ...data,
      birthDate: new Date(data.birthDate),
      status: "Novo",
    },
  });
}

export async function update(
  id: string,
  data: PatientFormData
) {
  return prisma.patient.update({
    where: { id },
    data: {
      ...data,
      birthDate: new Date(data.birthDate),
    },
  });
}