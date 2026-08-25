import { z } from "zod";

export const anamnesisSchema = z.object({
  patientId: z.string(),

  chiefComplaint: z.string().optional(),

  medicalConditions: z.string().optional(),

  medications: z.string().optional(),

  allergies: z.string().optional(),

  previousSurgeries: z.string().optional(),

  isPregnant: z.boolean().nullable().optional(),

  isSmoker: z.boolean().nullable().optional(),

  hasBruxism: z.boolean().nullable().optional(),

  lastDentalVisit: z.string().nullable().optional(),

  dentalHistory: z.string().optional(),

  oralHygieneHabits: z.string().optional(),

  observations: z.string().optional(),
});

export type AnamnesisFormData =
  z.infer<typeof anamnesisSchema>;
