import {
  create,
  findById,
  findByPatientId,
  remove,
  update,
} from "../../repositories/assessmentRepository";

export async function getAssessments(
  patientId: string
) {
  return findByPatientId(patientId);
}

export async function getAssessment(
  id: string
) {
  return findById(id);
}

export async function createAssessment(data: {
  patientId: string;
  type: string;
  description: string;
  date?: Date;
}) {
  return create(data);
}

export async function updateAssessment(
  id: string,
  data: {
    type: string;
    description: string;
    date: Date;
  }
) {
  return update(id, data);
}

export async function deleteAssessment(
  id: string
) {
  return remove(id);
}
