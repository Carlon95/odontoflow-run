export type AppointmentStatus =
  | "Agendada"
  | "Realizada"
  | "Cancelada";

export interface Appointment {
  id: string;
  patientId: string;

  professionalId?: string | null;
  procedureId?: string | null;

  date: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string | null;

  createdAt: string;
  updatedAt: string;

  patient?: {
    id: string;
    name: string;
  };

  professional?: {
    id: string;
    name: string;
  } | null;

  procedure?: {
    id: string;
    name: string;
  } | null;
}
