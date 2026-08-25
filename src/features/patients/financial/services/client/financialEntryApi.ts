import { FinancialEntry } from "../../types/financialEntry";

export interface FinancialEntryPayload {
  description: string;
  amount: number;
  method?: string;
  date: string;
}

export async function getFinancialEntries(
  patientId: string
) {
  const response = await fetch(
    `/api/financial/${patientId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar lançamentos financeiros."
    );
  }

  return response.json() as Promise<
    FinancialEntry[]
  >;
}

export async function createFinancialEntry(
  patientId: string,
  data: FinancialEntryPayload
) {
  const response = await fetch(
    `/api/financial/${patientId}`,
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
      "Erro ao criar lançamento financeiro."
    );
  }

  return response.json() as Promise<FinancialEntry>;
}

export async function updateFinancialEntry(
  id: string,
  data: FinancialEntryPayload
) {
  const response = await fetch(
    `/api/financial/item/${id}`,
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
      "Erro ao atualizar lançamento financeiro."
    );
  }

  return response.json() as Promise<FinancialEntry>;
}

export async function markFinancialEntryPaid(
  id: string,
  method?: string
) {
  const response = await fetch(
    `/api/financial/item/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        paid: true,
        method,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao marcar como pago."
    );
  }

  return response.json() as Promise<FinancialEntry>;
}

export async function markFinancialEntryUnpaid(
  id: string
) {
  const response = await fetch(
    `/api/financial/item/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        paid: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao desmarcar pagamento."
    );
  }

  return response.json() as Promise<FinancialEntry>;
}

export async function deleteFinancialEntry(
  id: string
) {
  const response = await fetch(
    `/api/financial/item/${id}`,
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
