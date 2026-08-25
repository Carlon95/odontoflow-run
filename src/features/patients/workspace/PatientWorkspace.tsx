import PatientTabs from "./PatientTabs";
import PatientWorkspaceHeader from "./components/PatientWorkspaceHeader";
import PatientQuickStats from "./components/PatientQuickStats";

import { Patient } from "../types/patient";
import { Anamnesis } from "../anamnese/types/anamnesis";
import { Evolution } from "../evolutions/types/evolution";
import { Assessment } from "../assessments/types/assessment";
import { FinancialEntry } from "../financial/types/financialEntry";
import { Appointment } from "../agenda/types/appointment";

interface PatientWorkspaceProps {
  patient: Patient;
  anamnesis: Anamnesis | null;
  evolutions: Evolution[];
  assessments: Assessment[];
  financialEntries: FinancialEntry[];
  appointments: Appointment[];
}

export default function PatientWorkspace({
  patient,
  anamnesis,
  evolutions,
  assessments,
  financialEntries,
  appointments,
}: PatientWorkspaceProps) {
  return (
    <div className="space-y-8">

      <PatientWorkspaceHeader
        patient={patient}
      />

      <PatientQuickStats
        patient={patient}
        anamnesis={anamnesis}
        evolutions={evolutions}
        assessments={assessments}
        financialEntries={financialEntries}
      />

      <PatientTabs
        patient={patient}
        anamnesis={anamnesis}
        evolutions={evolutions}
        financialEntries={financialEntries}
        appointments={appointments}
      />

    </div>
  );
}
