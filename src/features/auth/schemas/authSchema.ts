import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Informe um e-mail válido."),

  password: z
    .string()
    .min(1, "Informe a senha."),
});

export type LoginFormData = z.infer<
  typeof loginSchema
>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Informe o nome completo."),

  email: z
    .string()
    .email("Informe um e-mail válido."),

  password: z
    .string()
    .min(
      8,
      "A senha deve ter pelo menos 8 caracteres."
    ),

  role: z
    .enum(["Admin", "Dentista"])
    .default("Dentista"),
});

export type RegisterFormData = z.infer<
  typeof registerSchema
>;
