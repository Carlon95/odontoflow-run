export interface Evolution {
  id: string;
  patientId: string;

  sessionDate: string;
  content: string;

  nextSession: string | null;

  createdAt: string;
  updatedAt: string;
}