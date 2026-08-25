import { Patient } from "../../types/patient";
import { Anamnesis } from "../../anamnese/types/anamnesis";
import { Evolution } from "../../evolutions/types/evolution";
import { FinancialEntry } from "../../financial/types/financialEntry";
import { Appointment } from "../../agenda/types/appointment";

import PatientSummaryCard from "./PatientSummaryCard";
import NextSessionCard from "./NextSessionCard";
import FinancialStatusCard from "./FinancialStatusCard";
import LastEvolutionCard from "./LastEvolutionCard";
import PatientTimeline from "./PatientTimeline";

interface PatientOverviewProps {
  patient: Patient;
  anamnesis: Anamnesis | null;
  evolutions: Evolution[];
  financialEntries: FinancialEntry[];
  appointments: Appointment[];
}

export default function PatientOverview({
  patient,
  anamnesis,
  evolutions,
  financialEntries,
  appointments,
}: PatientOverviewProps) {
  // Componente de servidor: "now" é calculado uma vez por
  // requisição para filtrar a próxima consulta, não em re-render
  // de cliente — a preocupação de "impureza" do React aqui não
  // se aplica da mesma forma.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const nextAppointment =
    appointments.find(
      (appointment) =>
        appointment.status === "Agendada" &&
        new Date(appointment.date).getTime() >=
          now
    ) ?? null;

  const firstAppointment =
    appointments[0] ?? null;

  return (
    <div className="space-y-6">

      <div className="grid gap-6 lg:grid-cols-2">

        <PatientSummaryCard patient={patient} />

        <NextSessionCard
          patientId={patient.id}
          nextAppointment={nextAppointment}
        />

        <FinancialStatusCard
          entries={financialEntries}
        />

        <LastEvolutionCard
          evolution={evolutions[0] ?? null}
        />

      </div>

      <PatientTimeline
        patient={patient}
        anamnesis={anamnesis}
        lastEvolution={evolutions[0] ?? null}
        firstAppointment={firstAppointment}
      />

    </div>
  );
}
