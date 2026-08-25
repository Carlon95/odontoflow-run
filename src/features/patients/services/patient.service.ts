import { request } from "@/src/lib/request";

import { Patient } from "../types/patient";
import { PatientFormData } from "../schemas/patientSchema";

const BASE_URL = "/api/patients";

export function getPatients() {
  return request<Patient[]>(BASE_URL);
}

export function createPatient(
  data: PatientFormData
) {
  return request<Patient>(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function updatePatient(
  id: string,
  data: PatientFormData
) {
  return request<Patient>(
    `${BASE_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}

export function getPatientById(
  id: string
) {
  return request<Patient>(
    `${BASE_URL}/${id}`
  );
}
