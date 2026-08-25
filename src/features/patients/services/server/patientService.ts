import {
  count,
  countByStatus,
  countCreatedInRange,
  countWithoutAnamnesis,
  create,
  findAll,
  findById,
  update,
} from "../../repositories/patientRepository";

import { PatientFormData } from "../../schemas/patientSchema";

// ==============================
// Queries
// ==============================

export async function getPatients() {
  return findAll();
}

export async function getPatientById(id: string) {
  return findById(id);
}

export async function getPatientCount() {
  return count();
}

export async function getPatientsWithoutAnamnesisCount() {
  return countWithoutAnamnesis();
}

export async function getPatientsByStatusCount() {
  return countByStatus();
}

export async function getNewPatientsCount(
  start: Date,
  end: Date
) {
  return countCreatedInRange(start, end);
}
// ==============================
// Commands
// ==============================

export async function savePatient(
  data: PatientFormData
) {
  return create(data);
}


export async function editPatient(
  id: string,
  data: PatientFormData
) {
  return update(id, data);
}