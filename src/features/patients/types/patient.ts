export type PatientStatus =
  | "Novo"
  | "Anamnese"
  | "Avaliação"
  | "Em Tratamento"
  | "Alta";

export interface Patient {
  id: string;

  name: string;
  birthDate: string;
  gender: "Masculino" | "Feminino";

  status: PatientStatus;

  phone?: string | null;
  email?: string | null;
  cpf?: string | null;
  insurancePlan?: string | null;
  receiveReminders: boolean;

  createdAt: Date;
  updatedAt: Date;
}
