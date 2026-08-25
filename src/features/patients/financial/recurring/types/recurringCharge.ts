export interface RecurringCharge {
  id: string;
  patientId: string;

  description: string;
  amount: number;
  dayOfMonth: number;
  active: boolean;

  createdAt: string;
  updatedAt: string;
}
