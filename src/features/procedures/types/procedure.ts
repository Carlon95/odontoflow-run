export const PROCEDURE_CATEGORIES = [
  "Diagnóstico",
  "Preventivo",
  "Restaurador",
  "Endodontia",
  "Cirurgia",
  "Estética",
  "Ortodontia",
  "Prótese",
  "Periodontia",
  "Outro",
] as const;

export type ProcedureCategory =
  (typeof PROCEDURE_CATEGORIES)[number];

export interface Procedure {
  id: string;

  name: string;
  category?: string | null;
  defaultPrice?: number | null;
  defaultDurationMinutes?: number | null;
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}
