"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  CheckCircle2,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DataTable,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  ClinicSearchInput,
  LoadingState,
  EmptyState,
  StatCard,
} from "@/src/clinic-ui";

import {
  markFinancialEntryPaid,
  markFinancialEntryUnpaid,
} from "../services/client/financialEntryApi";

interface GlobalFinancialEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Pago" | "Pendente" | "Atrasado";
  method: string | null;
  patient: {
    id: string;
    name: string;
  };
}

const STATUS_FILTERS = [
  "Todos",
  "Pendente",
  "Atrasado",
  "Pago",
] as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "pt-BR"
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FinancialOverviewPage() {
  const [entries, setEntries] = useState<
    GlobalFinancialEntry[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      (typeof STATUS_FILTERS)[number]
    >("Todos");

  const [
    togglingId,
    setTogglingId,
  ] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/financial"
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao carregar lançamentos."
        );
      }

      const data = await response.json();

      setEntries(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }, []);

  useEffect(() => {
    // Busca única ao montar — padrão intencional de "carregar
    // dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        if (entry.status === "Pago") {
          acc.paid += entry.amount;
        } else if (
          entry.status === "Atrasado"
        ) {
          acc.overdue += entry.amount;
        } else {
          acc.pending += entry.amount;
        }

        return acc;
      },
      { paid: 0, pending: 0, overdue: 0 }
    );
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesStatus =
        statusFilter === "Todos" ||
        entry.status === statusFilter;

      const term = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        !term ||
        entry.patient.name
          .toLowerCase()
          .includes(term) ||
        entry.description
          .toLowerCase()
          .includes(term);

      return (
        matchesStatus && matchesSearch
      );
    });
  }, [entries, search, statusFilter]);

  async function handleTogglePaid(
    entry: GlobalFinancialEntry
  ) {
    try {
      setTogglingId(entry.id);

      if (entry.status === "Pago") {
        await markFinancialEntryUnpaid(
          entry.id
        );
      } else {
        await markFinancialEntryPaid(
          entry.id
        );
      }

      toast.success(
        "Lançamento atualizado."
      );

      await load();

    } catch (error) {

      toast.error(
        "Erro ao atualizar lançamento."
      );

    } finally {

      setTogglingId(null);

    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Carregando financeiro..."
        description="Buscando os lançamentos de todos os pacientes."
      />
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <StatCard
          title="Recebido"
          value={formatCurrency(
            totals.paid
          )}
          icon={
            <TrendingUp className="h-5 w-5" />
          }
        />

        <StatCard
          title="Pendente"
          value={formatCurrency(
            totals.pending
          )}
          icon={
            <Wallet className="h-5 w-5" />
          }
        />

        <StatCard
          title="Atrasado"
          value={formatCurrency(
            totals.overdue
          )}
          subtitleClassName="text-red-600"
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
        />

      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ClinicSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por paciente ou descrição..."
        />

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={status}
              type="button"
              variant={
                statusFilter === status
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setStatusFilter(status)
              }
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <EmptyState
          icon="💰"
          title="Nenhum lançamento encontrado"
          description="Os lançamentos financeiros de todos os pacientes aparecem aqui."
        />
      ) : (
        <DataTable
          columns={
            <TableRow>
              <TableHeader>
                Paciente
              </TableHeader>
              <TableHeader>
                Descrição
              </TableHeader>
              <TableHeader>
                Vencimento
              </TableHeader>
              <TableHeader>
                Valor
              </TableHeader>
              <TableHeader>
                Status
              </TableHeader>
              <TableHeader
                className="text-right"
              >
                Ações
              </TableHeader>
            </TableRow>
          }
        >
          {filteredEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <Link
                  href={`/patients/${entry.patient.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {entry.patient.name}
                </Link>
              </TableCell>

              <TableCell>
                {entry.description}
              </TableCell>

              <TableCell>
                {formatDate(entry.date)}
              </TableCell>

              <TableCell>
                {formatCurrency(
                  entry.amount
                )}
              </TableCell>

              <TableCell>
                <StatusBadge
                  status={entry.status}
                />
              </TableCell>

              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={
                    togglingId === entry.id
                  }
                  onClick={() =>
                    handleTogglePaid(entry)
                  }
                >
                  {entry.status === "Pago"
                    ? "Desfazer"
                    : "Marcar pago"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </DataTable>
      )}
    </div>
  );
}
