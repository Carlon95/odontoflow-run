import InfoCard from "@/src/clinic-ui/data-display/InfoCard";
import { Calendar, ClipboardList, FileText, UserPlus } from "lucide-react";

import { Patient } from "../../types/patient";
import { Anamnesis } from "../../anamnese/types/anamnesis";
import { Evolution } from "../../evolutions/types/evolution";
import { Appointment } from "../../agenda/types/appointment";

import { calculateAnamnesisProgress } from "../../anamnese/utils/calculateAnamnesisProgress";
import { getAnamnesisStatus } from "../../anamnese/utils/getAnamnesisStatus";

interface PatientTimelineProps {
  patient: Patient;
  anamnesis: Anamnesis | null;
  lastEvolution: Evolution | null;
  firstAppointment: Appointment | null;
}

export default function PatientTimeline({
  patient,
  anamnesis,
  lastEvolution,
  firstAppointment,
}: PatientTimelineProps) {
  const anamnesisProgress =
    calculateAnamnesisProgress(anamnesis);

  const anamnesisStatus = getAnamnesisStatus(
    anamnesisProgress
  );

  return (
    <InfoCard
      title="Histórico do Paciente"
      subtitle="Linha do tempo"
    >
      <div className="space-y-6">

        <TimelineItem
          icon={<UserPlus className="h-4 w-4 text-green-600" />}
          title="Paciente cadastrado"
          description={new Date(
            patient.createdAt
          ).toLocaleDateString("pt-BR")}
        />

        <TimelineItem
          icon={<Calendar className="h-4 w-4 text-primary" />}
          title="Primeira consulta"
          description={
            firstAppointment
              ? new Date(
                  firstAppointment.date
                ).toLocaleDateString("pt-BR")
              : "Nenhuma consulta agendada"
          }
        />

        <TimelineItem
          icon={<ClipboardList className="h-4 w-4 text-orange-600" />}
          title="Anamnese"
          description={anamnesisStatus.label}
        />

        <TimelineItem
          icon={<FileText className="h-4 w-4 text-purple-600" />}
          title="Última evolução"
          description={
            lastEvolution
              ? new Date(
                  lastEvolution.sessionDate
                ).toLocaleDateString("pt-BR")
              : "Nenhuma evolução registrada"
          }
        />

      </div>
    </InfoCard>
  );
}

interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TimelineItem({
  icon,
  title,
  description,
}: TimelineItemProps) {
  return (
    <div className="flex gap-4">

      <div className="mt-1">
        {icon}
      </div>

      <div>

        <p className="font-medium">
          {title}
        </p>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

      </div>

    </div>
  );
}
