import { request } from "@/src/lib/request";

import { Procedure } from "../types/procedure";
import { ProcedureFormData } from "../schemas/procedureSchema";

const BASE_URL = "/api/procedures";

export function getProcedures() {
  return request<Procedure[]>(BASE_URL);
}

export function createProcedure(
  data: ProcedureFormData
) {
  return request<Procedure>(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function updateProcedure(
  id: string,
  data: ProcedureFormData
) {
  return request<Procedure>(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function deleteProcedure(id: string) {
  return request<void>(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
