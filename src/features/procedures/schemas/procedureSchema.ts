import { z } from "zod";

export const procedureSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve possuir pelo menos 2 caracteres."),

  category: z.string().optional(),

  defaultPrice: z
    .number()
    .nonnegative("O valor não pode ser negativo.")
    .optional()
    .nullable(),

  defaultDurationMinutes: z
    .number()
    .int()
    .positive("A duração deve ser maior que zero.")
    .optional()
    .nullable(),

  active: z.boolean().optional(),
});

export type ProcedureFormData = z.infer<typeof procedureSchema>;
