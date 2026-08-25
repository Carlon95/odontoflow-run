import Link from "next/link";
import { Wallet } from "lucide-react";

import { StatusBadge } from "@/src/clinic-ui";

interface FinancialSummaryProps {
  entries: {
    id: string;
    description: string;
    amount: number;
    status: string;
    patient?: {
      id: string;
      name: string;
    };
  }[];
  pendingTotal: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FinancialSummary({
  entries,
  pendingTotal,
}: FinancialSummaryProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          Pendências Financeiras
        </h2>

        <span className="text-sm font-semibold text-amber-600">
          {formatCurrency(pendingTotal)}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma pendência financeira. 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={
                entry.patient
                  ? `/patients/${entry.patient.id}`
                  : "#"
              }
              className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {entry.patient?.name ??
                      "Paciente"}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {entry.description}
                    {" · "}
                    {formatCurrency(entry.amount)}
                  </p>
                </div>
              </div>

              <StatusBadge
                status={entry.status}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
