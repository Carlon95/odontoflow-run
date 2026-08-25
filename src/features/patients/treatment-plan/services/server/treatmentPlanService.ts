import {
  findByPatientId,
  save,
} from "../../repositories/treatmentPlanRepository";

import {
  TreatmentPlanFormData,
} from "../../types/treatmentPlan";

// ==============================
// Queries
// ==============================

export async function getTreatmentPlan(
  patientId: string
) {
  return findByPatientId(patientId);
}

// ==============================
// Commands
// ==============================

export async function saveTreatmentPlan(
  data: TreatmentPlanFormData
) {
  return save(data);
}
