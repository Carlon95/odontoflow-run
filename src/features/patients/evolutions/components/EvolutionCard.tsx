import {
  CalendarDays,
  FileText,
} from "lucide-react";

import {
  ClinicTimelineItem,
} from "@/src/clinic-ui";

import EvolutionActions from "./EvolutionActions";

import { Evolution } from "../types/evolution";

interface EvolutionCardProps {
  evolution: Evolution;
  onEdit?: (evolution: Evolution) => void;
  onDelete?: (evolution: Evolution) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "pt-BR"
  );
}

export default function EvolutionCard({
  evolution,
  onEdit,
  onDelete,
}: EvolutionCardProps) {
  return (
    <ClinicTimelineItem
      icon={
        <FileText className="h-4 w-4" />
      }
      title={formatDate(
        evolution.sessionDate
      )}
      subtitle={
        evolution.nextSession
          ? `Próximo retorno: ${formatDate(
              evolution.nextSession
            )}`
          : undefined
      }
      actions={
        <EvolutionActions
          onEdit={() =>
            onEdit?.(evolution)
          }
          onDelete={() =>
            onDelete?.(evolution)
          }
        />
      }
    >
      <div className="space-y-5">

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />

          Atendimento realizado em{" "}
          {formatDate(
            evolution.sessionDate
          )}
        </div>

        <p className="whitespace-pre-wrap leading-7">
          {evolution.content}
        </p>

      </div>
    </ClinicTimelineItem>
  );
}