import {
  findByPatientId,
  save,
} from "../../repositories/anamnesisRepository";

import {
  AnamnesisFormData,
} from "../../types/anamnesis";

// ==============================
// Queries
// ==============================

export async function getAnamnesis(
  patientId: string
) {
  return findByPatientId(patientId);
}

// ==============================
// Commands
// ==============================

export async function saveAnamnesis(
  data: AnamnesisFormData
) {
  return save(data);
}