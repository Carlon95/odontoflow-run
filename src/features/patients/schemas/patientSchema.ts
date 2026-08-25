import { z } from "zod";

export const patientSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve possuir pelo menos 3 caracteres."),

  birthDate: z
    .string()
    .min(1, "A data de nascimento é obrigatória."),

  gender: z.enum(["Masculino", "Feminino"], {
    message: "Selecione o sexo.",
  }),

  phone: z
    .string()
    .optional(),

  email: z
    .string()
    .email("Digite um e-mail válido.")
    .optional()
    .or(z.literal("")),

  cpf: z
    .string()
    .optional(),

  insurancePlan: z
    .string()
    .optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
