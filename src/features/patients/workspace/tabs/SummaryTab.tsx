import { Patient } from "../../types/patient";
import { Anamnesis } from "../../anamnese/types/anamnesis";
import { Evolution } from "../../evolutions/types/evolution";
import { FinancialEntry } from "../../financial/types/financialEntry";
import { Appointment } from "../../agenda/types/appointment";

import PatientOverview from "../components/PatientOverview";

interface SummaryTabProps {
  patient: Patient;
  anamnesis: Anamnesis | null;
  evolutions: Evolution[];
  financialEntries: FinancialEntry[];
  appointments: Appointment[];
}

export default function SummaryTab({
  patient,
  anamnesis,
  evolutions,
  financialEntries,
  appointments,
}: SummaryTabProps) {
  return (
    <PatientOverview
      patient={patient}
      anamnesis={anamnesis}
      evolutions={evolutions}
      financialEntries={financialEntries}
      appointments={appointments}
    />
  );
}
