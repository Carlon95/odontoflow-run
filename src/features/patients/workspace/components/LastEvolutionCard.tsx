import InfoCard from "@/src/clinic-ui/data-display/InfoCard";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

import { Evolution } from "../../evolutions/types/evolution";

interface LastEvolutionCardProps {
  evolution: Evolution | null;
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export default function LastEvolutionCard({
  evolution,
}: LastEvolutionCardProps) {
  return (
    <InfoCard
      title="Última Evolução"
      subtitle="Prontuário"
    >
      <div className="space-y-4">

        {evolution ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {new Date(
                evolution.sessionDate
              ).toLocaleDateString("pt-BR")}
            </p>

            <p className="text-sm text-muted-foreground">
              {truncate(
                evolution.content,
                120
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma evolução registrada.
          </p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
        >
          <FileText className="mr-2 h-4 w-4" />
          Nova Evolução
        </Button>

      </div>
    </InfoCard>
  );
}
