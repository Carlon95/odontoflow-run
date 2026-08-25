"use client";

import {
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { StatCard } from "@/src/clinic-ui";

import { useFinancialEntriesContext } from "../context/FinancialEntriesContext";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FinancialSummary() {
  const { totals } =
    useFinancialEntriesContext();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

      <StatCard
        title="Recebido"
        value={formatCurrency(totals.paid)}
        icon={
          <CheckCircle2 className="h-4 w-4" />
        }
        subtitle="Pagamentos confirmados"
        subtitleClassName="text-green-600"
      />

      <StatCard
        title="Pendente"
        value={formatCurrency(
          totals.pending
        )}
        icon={<Clock className="h-4 w-4" />}
        subtitle="Aguardando pagamento"
        subtitleClassName="text-amber-600"
      />

      <StatCard
        title="Atrasado"
        value={formatCurrency(
          totals.overdue
        )}
        icon={
          <AlertCircle className="h-4 w-4" />
        }
        subtitle="Fora do prazo"
        subtitleClassName="text-red-600"
      />

    </div>
  );
}
