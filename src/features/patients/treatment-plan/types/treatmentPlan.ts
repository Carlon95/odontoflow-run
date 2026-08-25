export interface TreatmentPlanItem {
  id: string;

  procedureId?: string | null;
  procedure?: {
    id: string;
    name: string;
    defaultPrice?: number | null;
  } | null;

  toothNumber?: string | null;
  toothFace?: string | null;

  description: string;
  status: string;
  estimatedCost?: number | null;
  notes?: string | null;
  order: number;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;

  generalNotes?: string | null;

  items: TreatmentPlanItem[];

  createdAt: Date;
  updatedAt: Date;
}

export type {
  TreatmentPlanFormData,
  TreatmentPlanItemFormData,
} from "../schemas/treatmentPlanSchema";
