import { Message } from "../../types/message";

export async function getMessages(
  patientId: string
) {
  const response = await fetch(
    `/api/messages/${patientId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar mensagens."
    );
  }

  return response.json() as Promise<Message[]>;
}

export async function sendMessage(
  patientId: string,
  content: string
) {
  const response = await fetch(
    `/api/messages/${patientId}`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Erro ao enviar mensagem."
    );
  }

  return response.json() as Promise<Message>;
}
