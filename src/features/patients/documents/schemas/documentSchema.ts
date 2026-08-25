import { z } from "zod";

export const documentUploadSchema = z.object({
  name: z
    .string()
    .min(1, "Dê um nome para o arquivo."),

  category: z.enum([
    "Radiografia",
    "Foto",
    "Exame",
    "Documento",
  ]),
});

export type DocumentUploadFormData = z.infer<
  typeof documentUploadSchema
>;
