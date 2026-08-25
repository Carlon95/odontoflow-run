import {
  create,
  findAll,
  findAllPending,
  findById,
  findByPatientId,
  findPaidSince,
  markAsPaid,
  markAsUnpaid,
  remove,
  update,
} from "../../repositories/financialEntryRepository";

export async function getFinancialEntries(
  patientId: string
) {
  return findByPatientId(patientId);
}

export async function getAllFinancialEntries() {
  return findAll();
}

export async function getAllPendingFinancialEntries() {
  return findAllPending();
}

export async function getPaidEntriesSince(
  since: Date
) {
  return findPaidSince(since);
}

export async function getFinancialEntry(
  id: string
) {
  return findById(id);
}

export async function createFinancialEntry(data: {
  patientId: string;
  description: string;
  amount: number;
  method?: string;
  date: Date;
  recurringChargeId?: string;
}) {
  return create(data);
}

export async function updateFinancialEntry(
  id: string,
  data: {
    description: string;
    amount: number;
    method?: string;
    date: Date;
  }
) {
  return update(id, data);
}

export async function markFinancialEntryAsPaid(
  id: string,
  method?: string
) {
  return markAsPaid(id, method);
}

export async function markFinancialEntryAsUnpaid(
  id: string
) {
  return markAsUnpaid(id);
}

export async function deleteFinancialEntry(
  id: string
) {
  return remove(id);
}
