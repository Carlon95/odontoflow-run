export interface Anamnesis {
  id: string;

  patientId: string;

  chiefComplaint?: string;
  medicalConditions?: string;
  medications?: string;
  allergies?: string;
  previousSurgeries?: string;

  isPregnant?: boolean | null;
  isSmoker?: boolean | null;
  hasBruxism?: boolean | null;

  lastDentalVisit?: string | null;
  dentalHistory?: string;
  oralHygieneHabits?: string;

  observations?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type AnamnesisFormData = Omit<
  Anamnesis,
  "id" | "createdAt" | "updatedAt"
>;
