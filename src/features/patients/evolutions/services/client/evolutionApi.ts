import { Evolution } from "../../types/evolution";

export interface EvolutionPayload {
  sessionDate: string;
  content: string;
  nextSession: string | null;
}

export async function getEvolutions(
  patientId: string
) {
  const response = await fetch(
    `/api/evolutions/${patientId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar evoluções."
    );
  }

  return response.json() as Promise<Evolution[]>;
}

export async function createEvolution(
  patientId: string,
  data: EvolutionPayload
) {
  const response = await fetch(
    `/api/evolutions/${patientId}`,
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
      "Erro ao criar evolução."
    );
  }

  return response.json() as Promise<Evolution>;
}

export async function updateEvolution(
  id: string,
  data: EvolutionPayload
) {
  const response = await fetch(
    `/api/evolutions/item/${id}`,
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
      "Erro ao atualizar evolução."
    );
  }

  return response.json() as Promise<Evolution>;
}

export async function deleteEvolution(
  id: string
) {
  const response = await fetch(
    `/api/evolutions/item/${id}`,
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