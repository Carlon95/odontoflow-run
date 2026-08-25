import { request } from "@/src/lib/request";

import {
  Anamnesis,
  AnamnesisFormData,
} from "../types/anamnesis";

const BASE_URL = "/api/anamnesis";

export function getAnamnesis(
  patientId: string
) {
  return request<Anamnesis | null>(
    `${BASE_URL}/${patientId}`
  );
}

export function saveAnamnesis(
  data: AnamnesisFormData
) {
  return request<Anamnesis>(
    `${BASE_URL}/${data.patientId}`,
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