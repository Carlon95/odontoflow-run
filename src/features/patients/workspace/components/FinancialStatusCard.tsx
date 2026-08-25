import InfoCard from "@/src/clinic-ui/data-display/InfoCard";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

import { FinancialEntry } from "../../financial/types/financialEntry";

interface FinancialStatusCardProps {
  entries: FinancialEntry[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FinancialStatusCard({
  entries,
}: FinancialStatusCardProps) {
  const pending = entries.filter(
    (entry) => entry.status === "Pendente"
  );

  const overdue = entries.filter(
    (entry) => entry.status === "Atrasado"
  );

  const pendingTotal = [
    ...pending,
    ...overdue,
  ].reduce(
    (total, entry) => total + entry.amount,
    0
  );

  const hasPending =
    pending.length > 0 || overdue.length > 0;

  return (
    <InfoCard
      title="Financeiro"
      subtitle="Situação financeira"
    >
      <div className="space-y-4">

        {hasPending ? (
          <div className="space-y-1">
            <p
              className={
                overdue.length > 0
                  ? "text-sm font-medium text-red-600"
                  : "text-sm font-medium text-amber-600"
              }
            >
              {formatCurrency(pendingTotal)} em
              aberto
            </p>

            <p className="text-xs text-muted-foreground">
              {overdue.length > 0
                ? `${overdue.length} lançamento${overdue.length === 1 ? "" : "s"} atrasado${overdue.length === 1 ? "" : "s"}`
                : `${pending.length} lançamento${pending.length === 1 ? "" : "s"} pendente${pending.length === 1 ? "" : "s"}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-green-600">
            Nenhuma pendência financeira.
          </p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Abrir Financeiro
        </Button>

      </div>
    </InfoCard>
  );
}
