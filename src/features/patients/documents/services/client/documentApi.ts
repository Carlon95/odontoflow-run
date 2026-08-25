import { PatientDocument } from "../../types/document";

const BASE_URL = (patientId: string) =>
  `/api/patients/${patientId}/documents`;

export async function getDocuments(
  patientId: string
): Promise<PatientDocument[]> {
  const response = await fetch(BASE_URL(patientId));

  if (!response.ok) {
    throw new Error("Erro ao carregar arquivos.");
  }

  return response.json();
}

export async function uploadDocument(
  patientId: string,
  file: File,
  name: string,
  category: string
): Promise<PatientDocument> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("name", name);
  formData.append("category", category);

  const response = await fetch(BASE_URL(patientId), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => null);

    throw new Error(
      body?.message ?? "Erro ao enviar arquivo."
    );
  }

  return response.json();
}

export async function deleteDocument(
  patientId: string,
  documentId: string
): Promise<void> {
  const response = await fetch(
    `${BASE_URL(patientId)}/${documentId}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    throw new Error("Erro ao excluir arquivo.");
  }
}
