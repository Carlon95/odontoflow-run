"use client";

import { PageContainer, PageHeader } from "@/src/clinic-ui";

import { AppointmentsProvider } from "../context/AppointmentsContext";

import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";

export default function AgendaPage() {
  return (
    <AppointmentsProvider>
      <PageContainer>
        <PageHeader
          title="Agenda"
          description="Próximas sessões da clínica."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="lg:col-span-1">
            <AppointmentForm />
          </div>

          <div className="lg:col-span-2">
            <AppointmentList showPatientName />
          </div>

        </div>
      </PageContainer>
    </AppointmentsProvider>
  );
}
