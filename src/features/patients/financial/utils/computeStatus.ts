export type ComputedFinancialStatus =
  | "Pago"
  | "Pendente"
  | "Atrasado";

interface EntryLike {
  status: string;
  date: Date;
  paidAt: Date | null;
}

/**
 * O banco só guarda "Pago" ou "Pendente" de verdade. "Atrasado"
 * nunca é armazenado — é sempre calculado comparando o vencimento
 * com a data de hoje. Isso evita depender de um cron pra "virar"
 * o status: o cálculo está sempre correto, na hora, sem atraso.
 */
export function computeFinancialStatus(
  entry: EntryLike
): ComputedFinancialStatus {
  if (entry.status === "Pago" || entry.paidAt) {
    return "Pago";
  }

  const isOverdue =
    entry.date.getTime() < Date.now();

  return isOverdue ? "Atrasado" : "Pendente";
}

export function withComputedStatus<
  T extends EntryLike
>(entry: T): T & { status: ComputedFinancialStatus } {
  return {
    ...entry,
    status: computeFinancialStatus(entry),
  };
}
