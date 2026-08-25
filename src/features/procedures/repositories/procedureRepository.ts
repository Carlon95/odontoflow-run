import { prisma } from "@/src/lib/prisma";
import { ProcedureFormData } from "../schemas/procedureSchema";

// ==============================
// Queries
// ==============================

export async function findAll() {
  return prisma.procedure.findMany({
    orderBy: [
      { active: "desc" },
      { name: "asc" },
    ],
  });
}

export async function findActive() {
  return prisma.procedure.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

export async function findById(id: string) {
  return prisma.procedure.findUnique({
    where: { id },
  });
}

// ==============================
// Commands
// ==============================

export async function create(
  data: ProcedureFormData
) {
  return prisma.procedure.create({
    data: {
      ...data,
      active: data.active ?? true,
    },
  });
}

export async function update(
  id: string,
  data: ProcedureFormData
) {
  return prisma.procedure.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  return prisma.procedure.delete({
    where: { id },
  });
}
