import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";

import { TreatmentPlanFormData } from "../schemas/treatmentPlanSchema";

// ==============================
// Queries
// ==============================

export async function findByPatientId(
  patientId: string
) {
  return prisma.treatmentPlan.findUnique({
    where: {
      patientId,
    },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: {
          procedure: {
            select: {
              id: true,
              name: true,
              defaultPrice: true,
            },
          },
        },
      },
    },
  });
}

// ==============================
// Commands
// ==============================

// Salva o cabeçalho do plano e sincroniza os itens (cria os novos,
// atualiza os existentes e remove os que não vieram mais na lista)
// em uma única transação.
export async function save(
  data: TreatmentPlanFormData
) {
  const { patientId, generalNotes, items } = data;

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const treatmentPlan = await tx.treatmentPlan.upsert({
      where: { patientId },
      update: { generalNotes },
      create: { patientId, generalNotes },
    });

    const existingItems = await tx.treatmentPlanItem.findMany({
      where: { treatmentPlanId: treatmentPlan.id },
      select: { id: true },
    });

    const existingIds = existingItems.map(
      (item: { id: string }) => item.id
    );

    const incomingIds = items
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    const idsToDelete = existingIds.filter(
      (id: string) => !incomingIds.includes(id)
    );

    if (idsToDelete.length > 0) {
      await tx.treatmentPlanItem.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    for (const [index, item] of items.entries()) {
      const payload = {
        treatmentPlanId: treatmentPlan.id,
        procedureId: item.procedureId || null,
        toothNumber: item.toothNumber || null,
        toothFace: item.toothFace || null,
        description: item.description,
        status: item.status,
        estimatedCost: item.estimatedCost ?? null,
        notes: item.notes || null,
        order: index,
      };

      if (item.id && existingIds.includes(item.id)) {
        await tx.treatmentPlanItem.update({
          where: { id: item.id },
          data: payload,
        });
      } else {
        await tx.treatmentPlanItem.create({
          data: payload,
        });
      }
    }

    return tx.treatmentPlan.findUniqueOrThrow({
      where: { id: treatmentPlan.id },
      include: {
        items: {
          orderBy: { order: "asc" },
          include: {
            procedure: {
              select: {
                id: true,
                name: true,
                defaultPrice: true,
              },
            },
          },
        },
      },
    });
  });
}
