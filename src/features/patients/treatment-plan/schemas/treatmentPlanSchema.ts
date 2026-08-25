import { z } from "zod";

export const TREATMENT_PLAN_ITEM_STATUSES = [
  "Planejado",
  "Em Andamento",
  "Concluído",
  "Cancelado",
] as const;

export const treatmentPlanItemSchema = z.object({
  id: z.string().optional(),

  procedureId: z.string().optional().nullable(),

  // Notação FDI (ex: "16", "26", "36", "48"). Vazio = procedimento
  // que não se refere a um dente específico.
  toothNumber: z.string().optional().nullable(),
  toothFace: z.string().optional().nullable(),

  description: z
    .string()
    .min(1, "Descreva o procedimento."),

  status: z
    .enum(TREATMENT_PLAN_ITEM_STATUSES)
    .default("Planejado"),

  estimatedCost: z
    .number()
    .nonnegative("O valor não pode ser negativo.")
    .optional()
    .nullable(),

  notes: z.string().optional().nullable(),
});

export const treatmentPlanSchema = z.object({
  patientId: z.string(),

  generalNotes: z.string().optional(),

  items: z.array(treatmentPlanItemSchema).default([]),
});

export type TreatmentPlanItemFormData = z.infer<
  typeof treatmentPlanItemSchema
>;

export type TreatmentPlanFormData = z.infer<
  typeof treatmentPlanSchema
>;
