import { z } from "zod";

export const financialEntrySchema = z.object({
  description: z
    .string()
    .min(
      2,
      "Informe a descrição do lançamento."
    ),

  amount: z.coerce
    .number()
    .positive(
      "O valor deve ser maior que zero."
    ),

  method: z
    .string()
    .optional(),

  date: z
    .string()
    .min(1, "Informe o vencimento."),
});

export type FinancialEntryFormData =
  z.infer<typeof financialEntrySchema>;
