import {
  findAll,
  findActive,
  findById,
  create,
  update,
  remove,
} from "../../repositories/procedureRepository";

import { ProcedureFormData } from "../../schemas/procedureSchema";

// ==============================
// Queries
// ==============================

export async function getProcedures() {
  return findAll();
}

export async function getActiveProcedures() {
  return findActive();
}

export async function getProcedureById(id: string) {
  return findById(id);
}

// ==============================
// Commands
// ==============================

export async function createProcedure(
  data: ProcedureFormData
) {
  return create(data);
}

export async function editProcedure(
  id: string,
  data: ProcedureFormData
) {
  return update(id, data);
}

export async function deleteProcedure(id: string) {
  return remove(id);
}
