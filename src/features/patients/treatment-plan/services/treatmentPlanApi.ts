import { request } from "@/src/lib/request";

import {
  TreatmentPlan,
  TreatmentPlanFormData,
} from "../types/treatmentPlan";

const BASE_URL = "/api/treatment-plan";

export function getTreatmentPlan(
  patientId: string
) {
  return request<TreatmentPlan | null>(
    `${BASE_URL}/${patientId}`
  );
}

export function saveTreatmentPlan(
  data: TreatmentPlanFormData
) {
  return request<TreatmentPlan>(
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
