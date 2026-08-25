import {
  create,
  findAll,
  findById,
  findByPatientId,
  remove,
  update,
} from "../../repositories/evolutionRepository";

export async function getEvolutions(
  patientId: string
) {
  return findByPatientId(patientId);
}

export async function getAllEvolutions() {
  return findAll();
}

export async function getEvolution(
  id: string
) {
  return findById(id);
}

export async function createEvolution(data: {
  patientId: string;
  content: string;
  sessionDate?: Date;
  nextSession?: Date | null;
}) {
  return create(data);
}

export async function updateEvolution(
  id: string,
  data: {
    content: string;
    sessionDate: Date;
    nextSession?: Date | null;
  }
) {
  return update(id, data);
}

export async function deleteEvolution(
  id: string
) {
  return remove(id);
}