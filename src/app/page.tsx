import Link from "next/link";

import MainLayout from "@/src/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  PageContainer,
  PageHeader,
  StatCard,
} from "@/src/clinic-ui";

import { CalendarClock, Users, Wallet, ClipboardList } from "lucide-react";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";
import { getDashboardData } from "@/src/features/dashboard/services/server/dashboardService";

import WelcomeCard from "@/src/features/dashboard/components/WelcomeCard";
import AppointmentList from "@/src/features/dashboard/components/AppointmentList";
import FinancialSummary from "@/src/features/dashboard/components/FinancialSummary";
import TaskList from "@/src/features/dashboard/components/TaskList";
import RecentPatients from "@/src/features/dashboard/components/RecentPatients";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function Home() {
  const user = await requireAuthenticatedUser();

  const dashboard = await getDashboardData();

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Visão geral da clínica"
          actions={
            <Link href="/patients">
              <Button>Novo Paciente</Button>
            </Link>
          }
        />

        <div className="space-y-6">

          <WelcomeCard
            userName={user?.name ?? "Dentista"}
            todayAppointmentsCount={
              dashboard.todayAppointments.length
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total de Pacientes"
              value={String(dashboard.patientCount)}
              icon={<Users className="h-5 w-5" />}
              accent="primary"
            />

            <StatCard
              title="Consultas Hoje"
              value={String(
                dashboard.todayAppointments.length
              )}
              icon={
                <CalendarClock className="h-5 w-5" />
              }
              accent="cyan"
            />

            <StatCard
              title="Financeiro Pendente"
              value={formatCurrency(
                dashboard.pendingTotal
              )}
              subtitle={
                dashboard.overdueCount > 0
                  ? `${dashboard.overdueCount} atrasado${dashboard.overdueCount === 1 ? "" : "s"}`
                  : undefined
              }
              subtitleClassName="text-red-600"
              icon={<Wallet className="h-5 w-5" />}
              accent={
                dashboard.overdueCount > 0
                  ? "rose"
                  : "amber"
              }
            />

            <StatCard
              title="Sem Anamnese"
              value={String(
                dashboard.patientsWithoutAnamnesis
              )}
              icon={
                <ClipboardList className="h-5 w-5" />
              }
              accent="muted"
            />

          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AppointmentList
              appointments={
                dashboard.todayAppointments
              }
            />

            <FinancialSummary
              entries={
                dashboard.pendingFinancialEntries
              }
              pendingTotal={dashboard.pendingTotal}
            />

            <TaskList
              patientsWithoutAnamnesis={
                dashboard.patientsWithoutAnamnesis
              }
              overdueCount={dashboard.overdueCount}
            />

            <RecentPatients
              patients={dashboard.recentPatients}
            />
          </div>

        </div>
      </PageContainer>
    </MainLayout>
  );
}
