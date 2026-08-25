import MainLayout from "@/src/components/layout/MainLayout";
import PatientWorkspace from "@/src/features/patients/workspace/PatientWorkspace";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";

import { getPatientById } from "@/src/features/patients/services/server/patientService";
import { getAnamnesis } from "@/src/features/patients/anamnese/services/server/anamnesisService";
import { getEvolutions } from "@/src/features/patients/evolutions/services/server/evolutionService";
import { getAssessments } from "@/src/features/patients/assessments/services/server/assessmentService";
import { getFinancialEntries } from "@/src/features/patients/financial/services/server/financialEntryService";
import { getAppointmentsByPatient } from "@/src/features/patients/agenda/services/server/appointmentService";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientPage({
  params,
}: PageProps) {
  await requireAuthenticatedUser();

  const { id } = await params;

  const patient = await getPatientById(id);

  if (!patient) {
    return (
      <MainLayout>
        <div className="p-6">
          <h1 className="font-heading text-2xl font-bold">
            Paciente não encontrado
          </h1>
        </div>
      </MainLayout>
    );
  }

  const anamnesisResponse = await getAnamnesis(id);

  const anamnesis = anamnesisResponse
    ? {
        ...anamnesisResponse,
        chiefComplaint: anamnesisResponse.chiefComplaint ?? undefined,
        historyOfPresentIllness: anamnesisResponse.historyOfPresentIllness ?? undefined,
        familyHistory: anamnesisResponse.familyHistory ?? undefined,
        medications: anamnesisResponse.medications ?? undefined,
        allergies: anamnesisResponse.allergies ?? undefined,
        surgeries: anamnesisResponse.surgeries ?? undefined,
        lifestyle: anamnesisResponse.lifestyle ?? undefined,
        observations: anamnesisResponse.observations ?? undefined,
      }
    : null;

  const [
    evolutionsResponse,
    assessmentsResponse,
    financialEntriesResponse,
    appointmentsResponse,
  ] = await Promise.all([
    getEvolutions(id),
    getAssessments(id),
    getFinancialEntries(id),
    getAppointmentsByPatient(id),
  ]);

  const evolutions = evolutionsResponse.map(
    (evolution: {
      id: string;
      patientId: string;
      sessionDate: Date;
      content: string;
      nextSession: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      ...evolution,
      sessionDate:
        evolution.sessionDate.toISOString(),
      nextSession:
        evolution.nextSession?.toISOString() ??
        null,
      createdAt:
        evolution.createdAt.toISOString(),
      updatedAt:
        evolution.updatedAt.toISOString(),
    })
  );

  const assessments = assessmentsResponse.map(
    (assessment: {
      id: string;
      patientId: string;
      date: Date;
      type: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      ...assessment,
      date: assessment.date.toISOString(),
      createdAt:
        assessment.createdAt.toISOString(),
      updatedAt:
        assessment.updatedAt.toISOString(),
    })
  );

  const financialEntries =
    financialEntriesResponse.map((entry: {
      id: string;
      patientId: string;
      date: Date;
      description: string;
      amount: number;
      status: string;
      method: string | null;
      paidAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      ...entry,
      status: entry.status as
        | "Pago"
        | "Pendente"
        | "Atrasado",
      date: entry.date.toISOString(),
      paidAt:
        entry.paidAt?.toISOString() ?? null,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    }));

  const appointments = appointmentsResponse.map(
    (appointment: {
      id: string;
      patientId: string;
      date: Date;
      duration: number;
      status: string;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
    }) => ({
      ...appointment,
      status: appointment.status as
        | "Agendada"
        | "Realizada"
        | "Cancelada",
      date: appointment.date.toISOString(),
      createdAt:
        appointment.createdAt.toISOString(),
      updatedAt:
        appointment.updatedAt.toISOString(),
    })
  );

  return (
    <MainLayout>
      <PatientWorkspace
        patient={patient}
        anamnesis={anamnesis}
        evolutions={evolutions}
        assessments={assessments}
        financialEntries={financialEntries}
        appointments={appointments}
      />
    </MainLayout>
  );
}