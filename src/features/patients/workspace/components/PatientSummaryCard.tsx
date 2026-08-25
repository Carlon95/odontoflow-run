import InfoCard from "@/src/clinic-ui/data-display/InfoCard";
import PatientInfoItem from "@/src/clinic-ui/data-display/PatientInfoItem";
import StatusBadge from "@/src/clinic-ui/feedback/StatusBadge";

import { Patient } from "../../types/patient";
import { calculateAge } from "../../utils/calculateAge";

interface PatientSummaryCardProps {
  patient: Patient;
}

export default function PatientSummaryCard({
  patient,
}: PatientSummaryCardProps) {
  return (
    <InfoCard
      title="Dados do Paciente"
      subtitle="Informações cadastrais"
    >
      <PatientInfoItem
        label="Nome"
        value={patient.name}
      />

      <PatientInfoItem
        label="Idade"
        value={`${calculateAge(patient.birthDate)} anos`}
      />

      <PatientInfoItem
        label="Sexo"
        value={patient.gender}
      />

      <PatientInfoItem
        label="Status"
        value={
          <StatusBadge
            status={patient.status}
          />
        }
      />
    </InfoCard>
  );
}