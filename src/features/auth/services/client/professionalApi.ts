import { request } from "@/src/lib/request";

export interface Professional {
  id: string;
  name: string;
  role: string;
  specialty?: string | null;
}

export function getProfessionals() {
  return request<Professional[]>("/api/professionals");
}
