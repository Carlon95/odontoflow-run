"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { FileText } from "lucide-react";

import {
  ClinicSearchInput,
  ClinicTimeline,
  ClinicTimelineGroup,
  EmptyState,
  LoadingState,
} from "@/src/clinic-ui";

interface GlobalEvolution {
  id: string;
  sessionDate: string;
  content: string;
  patient: {
    id: string;
    name: string;
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "pt-BR"
  );
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

function groupByMonth(
  evolutions: GlobalEvolution[]
) {
  return evolutions.reduce(
    (groups, evolution) => {
      const date = new Date(
        evolution.sessionDate
      );

      const key = date.toLocaleDateString(
        "pt-BR",
        {
          month: "long",
          year: "numeric",
        }
      );

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(evolution);

      return groups;
    },
    {} as Record<
      string,
      GlobalEvolution[]
    >
  );
}

export default function EvolutionsOverviewPage() {
  const [evolutions, setEvolutions] =
    useState<GlobalEvolution[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const load = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/evolutions"
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao carregar evoluções."
        );
      }

      const data = await response.json();

      setEvolutions(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }, []);

  useEffect(() => {
    // Busca única ao montar — padrão intencional de "carregar
    // dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const filteredEvolutions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return evolutions;

    return evolutions.filter(
      (evolution) =>
        evolution.patient.name
          .toLowerCase()
          .includes(term) ||
        evolution.content
          .toLowerCase()
          .includes(term)
    );
  }, [evolutions, search]);

  const grouped = useMemo(
    () => groupByMonth(filteredEvolutions),
    [filteredEvolutions]
  );

  if (loading) {
    return (
      <LoadingState
        title="Carregando evoluções..."
        description="Buscando as sessões de todos os pacientes."
      />
    );
  }

  return (
    <div className="space-y-6">

      <ClinicSearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por paciente ou conteúdo..."
      />

      {filteredEvolutions.length === 0 ? (
        <EmptyState
          icon="📝"
          title={
            search
              ? "Nenhuma evolução encontrada"
              : "Nenhuma evolução registrada"
          }
          description={
            search
              ? "Tente buscar por outro termo."
              : "As evoluções de todos os pacientes aparecem aqui."
          }
        />
      ) : (
        <ClinicTimeline>
          {Object.entries(grouped).map(
            ([month, items]) => (
              <ClinicTimelineGroup
                key={month}
                title={month}
              >
                {items.map((evolution) => (
                  <div
                    key={evolution.id}
                    className="rounded-lg border bg-card p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/patients/${evolution.patient.id}`}
                        className="flex items-center gap-2 font-medium text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        {
                          evolution.patient
                            .name
                        }
                      </Link>

                      <span className="text-xs text-muted-foreground">
                        {formatDate(
                          evolution.sessionDate
                        )}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {truncate(
                        evolution.content,
                        200
                      )}
                    </p>
                  </div>
                ))}
              </ClinicTimelineGroup>
            )
          )}
        </ClinicTimeline>
      )}
    </div>
  );
}
