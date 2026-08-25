"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CalendarCheck,
  TrendingUp,
  UserPlus,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LoadingState, StatCard } from "@/src/clinic-ui";

import {
  getReportsData,
  ReportsData,
} from "../services/client/reportsApi";

import RevenueChart from "./RevenueChart";
import PatientStatusChart from "./PatientStatusChart";

const PERIOD_LABELS: Record<string, string> = {
  "this-month": "Este mês",
  "last-month": "Mês passado",
  "last-3-months": "Últimos 3 meses",
  "this-year": "Este ano",
  "all-time": "Desde o início",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ReportsPage() {
  const [period, setPeriod] = useState(
    "this-month"
  );

  const [data, setData] =
    useState<ReportsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getReportsData(
        period
      );

      setData(result);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }, [period]);

  useEffect(() => {
    // Recarrega ao montar e sempre que o período muda —
    // padrão intencional de "carregar dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="space-y-6">

      <div className="flex justify-end">
        <Select
          value={period}
          onValueChange={(value) =>
            value && setPeriod(value)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {Object.entries(
              PERIOD_LABELS
            ).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading || !data ? (
        <LoadingState
          title="Carregando relatórios..."
          description="Calculando os números da clínica."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Recebido no Período"
              value={formatCurrency(
                data.financial.totalReceived
              )}
              icon={
                <TrendingUp className="h-5 w-5" />
              }
            />

            <StatCard
              title="Em Aberto (Atual)"
              value={formatCurrency(
                data.financial.totalPending +
                  data.financial.totalOverdue
              )}
              subtitle={
                data.financial.totalOverdue > 0
                  ? `${formatCurrency(data.financial.totalOverdue)} atrasado`
                  : undefined
              }
              subtitleClassName="text-red-600"
              icon={
                <Wallet className="h-5 w-5" />
              }
            />

            <StatCard
              title="Consultas Realizadas"
              value={String(
                data.operational
                  .appointmentsByStatus
                  .Realizada ?? 0
              )}
              subtitle={
                data.operational
                  .appointmentsByStatus
                  .Cancelada
                  ? `${data.operational.appointmentsByStatus.Cancelada} canceladas`
                  : undefined
              }
              icon={
                <CalendarCheck className="h-5 w-5" />
              }
            />

            <StatCard
              title="Novos Pacientes"
              value={String(
                data.operational.newPatients
              )}
              subtitle={`${data.operational.totalPatients} no total`}
              icon={
                <UserPlus className="h-5 w-5" />
              }
            />

          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RevenueChart
              data={
                data.financial.monthlyRevenue
              }
            />

            <PatientStatusChart
              data={
                data.operational
                  .patientsByStatus
              }
            />
          </div>

          {data.operational.appointmentsByStatus
            .Cancelada > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <XCircle className="h-5 w-5 shrink-0" />
              <p>
                {
                  data.operational
                    .appointmentsByStatus
                    .Cancelada
                }{" "}
                consulta(s) cancelada(s) no
                período selecionado.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
