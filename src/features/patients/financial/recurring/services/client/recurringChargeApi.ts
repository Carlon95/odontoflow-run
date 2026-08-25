import { RecurringCharge } from "../../types/recurringCharge";

export interface RecurringChargePayload {
  description: string;
  amount: number;
  dayOfMonth: number;
}

export async function getRecurringCharges(
  patientId: string
) {
  const response = await fetch(
    `/api/recurring-charges/${patientId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar cobranças recorrentes."
    );
  }

  return response.json() as Promise<
    RecurringCharge[]
  >;
}

export async function createRecurringCharge(
  patientId: string,
  data: RecurringChargePayload
) {
  const response = await fetch(
    `/api/recurring-charges/${patientId}`,
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
      "Erro ao criar cobrança recorrente."
    );
  }

  return response.json() as Promise<RecurringCharge>;
}

export async function toggleRecurringCharge(
  id: string,
  active: boolean
) {
  const response = await fetch(
    `/api/recurring-charges/item/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ active }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao atualizar cobrança recorrente."
    );
  }

  return response.json() as Promise<RecurringCharge>;
}

export async function deleteRecurringCharge(
  id: string
) {
  const response = await fetch(
    `/api/recurring-charges/item/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao excluir cobrança recorrente."
    );
  }
}
