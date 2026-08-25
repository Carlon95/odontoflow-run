export type FinancialStatus =
  | "Pago"
  | "Pendente"
  | "Atrasado";

export interface FinancialEntry {
  id: string;
  patientId: string;

  date: string;
  description: string;
  amount: number;
  status: FinancialStatus;
  method?: string | null;
  paidAt?: string | null;

  createdAt: string;
  updatedAt: string;
}
