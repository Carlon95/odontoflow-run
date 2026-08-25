import { z } from "zod";

export const recurringChargeSchema = z.object({
  description: z
    .string()
    .min(
      2,
      "Informe a descrição da cobrança."
    ),

  amount: z.coerce
    .number()
    .positive(
      "O valor deve ser maior que zero."
    ),

  dayOfMonth: z.coerce
    .number()
    .int()
    .min(1, "O dia deve ser entre 1 e 28.")
    .max(28, "O dia deve ser entre 1 e 28."),
});

export type RecurringChargeFormData =
  z.infer<typeof recurringChargeSchema>;
