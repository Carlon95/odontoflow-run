import {
  Activity,
  ClipboardList,
  FileText,
  Wallet,
} from "lucide-react";

import { StatCard } from "@/src/clinic-ui";

import { calculateAnamnesisProgress } from "@/src/features/patients/anamnese/utils/calculateAnamnesisProgress";
import { getAnamnesisStatus } from "@/src/features/patients/anamnese/utils/getAnamnesisStatus";

import { Anamnesis } from "@/src/features/patients/anamnese/types/anamnesis";
import { Evolution } from "../../evolutions/types/evolution";
import { Assessment } from "../../assessments/types/assessment";
import { FinancialEntry } from "../../financial/types/financialEntry";
import { Patient } from "../../types/patient";

interface PatientQuickStatsProps {
  patient: Patient;
  anamnesis: Anamnesis | null;
  evolutions: Evolution[];
  assessments: Assessment[];
  financialEntries: FinancialEntry[];
}

export default function PatientQuickStats({
  patient,
  anamnesis,
  evolutions,
  assessments,
  financialEntries,
}: PatientQuickStatsProps) {
  const progress =
    calculateAnamnesisProgress(anamnesis);

  const status =
    getAnamnesisStatus(progress);

  const lastUpdate = anamnesis?.updatedAt
    ? new Date(anamnesis.updatedAt).toLocaleString("pt-BR")
    : "Ainda não atualizada";

  const pendingAmount = financialEntries
    .filter(
      (entry) =>
        entry.status === "Pendente" ||
        entry.status === "Atrasado"
    )
    .reduce(
      (total, entry) => total + entry.amount,
      0
    );

  const hasOverdue = financialEntries.some(
    (entry) => entry.status === "Atrasado"
  );

  const financialValue =
    pendingAmount > 0
      ? pendingAmount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "Em dia";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Anamnese"
        value={`${progress}% preenchida`}
        subtitle={status.label}
        subtitleClassName={status.color}
        footer={`Última atualização: ${lastUpdate}`}
        icon={
          <ClipboardList className="h-5 w-5" />
        }
        progress={progress}
      />

      <StatCard
        title="Avaliações"
        value={`${assessments.length} registro${assessments.length === 1 ? "" : "s"}`}
        icon={
          <Activity className="h-5 w-5" />
        }
      />

      <StatCard
        title="Evoluções"
        value={`${evolutions.length} registro${evolutions.length === 1 ? "" : "s"}`}
        icon={
          <FileText className="h-5 w-5" />
        }
      />

      <StatCard
        title="Financeiro"
        value={financialValue}
        subtitle={
          hasOverdue
            ? "Há pendências atrasadas"
            : undefined
        }
        subtitleClassName="text-red-600"
        icon={
          <Wallet className="h-5 w-5" />
        }
      />

    </div>
  );
}
