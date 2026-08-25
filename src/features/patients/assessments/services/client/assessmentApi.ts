import { Assessment } from "../../types/assessment";

export interface AssessmentPayload {
  type: string;
  description: string;
  date: string;
}

export async function getAssessments(
  patientId: string
) {
  const response = await fetch(
    `/api/assessments/${patientId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar avaliações."
    );
  }

  return response.json() as Promise<Assessment[]>;
}

export async function createAssessment(
  patientId: string,
  data: AssessmentPayload
) {
  const response = await fetch(
    `/api/assessments/${patientId}`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao criar avaliação."
    );
  }

  return response.json() as Promise<Assessment>;
}

export async function updateAssessment(
  id: string,
  data: AssessmentPayload
) {
  const response = await fetch(
    `/api/assessments/item/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao atualizar avaliação."
    );
  }

  return response.json() as Promise<Assessment>;
}

export async function deleteAssessment(
  id: string
) {
  const response = await fetch(
    `/api/assessments/item/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const message = await response.text();

    console.error(message);

    throw new Error(message);
  }
}
