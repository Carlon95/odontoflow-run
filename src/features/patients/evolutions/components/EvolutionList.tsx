"use client";

import { useMemo, useState } from "react";

import EvolutionCard from "./EvolutionCard";

import EditEvolutionDialog from "../dialogs/EditEvolutionDialog";
import DeleteEvolutionDialog from "../dialogs/DeleteEvolutionDialog";

import {
  useEvolutionsContext,
} from "../context/EvolutionsContext";

import { Evolution } from "../types/evolution";

import {
  ClinicTimeline,
  ClinicTimelineGroup,
  ClinicSearchInput,
  LoadingState,
  EmptyState,
} from "@/src/clinic-ui";

function groupByMonth(
  evolutions: Evolution[]
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
      Evolution[]
    >
  );
}

export default function EvolutionList() {
  const {
    evolutions,
    loading,
  } = useEvolutionsContext();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedEvolution,
    setSelectedEvolution,
  ] = useState<Evolution | null>(
    null
  );

  const [
    isEditDialogOpen,
    setIsEditDialogOpen,
  ] = useState(false);

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false);

  function handleEdit(
    evolution: Evolution
  ) {
    setSelectedEvolution(
      evolution
    );

    setIsEditDialogOpen(true);
  }

  function handleDelete(
    evolution: Evolution
  ) {
    setSelectedEvolution(
      evolution
    );

    setIsDeleteDialogOpen(true);
  }

  const filteredEvolutions =
    useMemo(() => {
      const term = search
        .trim()
        .toLowerCase();

      if (!term) {
        return evolutions;
      }

      return evolutions.filter(
        (evolution) =>
          evolution.content
            .toLowerCase()
            .includes(term)
      );
    }, [
      evolutions,
      search,
    ]);

  const groupedEvolutions =
    useMemo(
      () =>
        groupByMonth(
          filteredEvolutions
        ),
      [filteredEvolutions]
    );

 if (loading) {
  return (
    <LoadingState
      title="Carregando evoluções..."
      description="Buscando o histórico de sessões."
    />
  );
}

  return (
    <>
      <ClinicSearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar evolução..."
      />

      {filteredEvolutions.length ===
      0 ? (
        <div className="mt-6">
          <EmptyState
            icon="📝"
            title={
              search
                ? "Nenhuma evolução encontrada"
                : "Nenhuma evolução cadastrada"
            }
            description={
              search
                ? "Tente buscar por outro termo."
                : "Registre a primeira evolução deste paciente."
            }
          />
        </div>
      ) : (
        <div className="mt-6">
          <ClinicTimeline>
            {Object.entries(
              groupedEvolutions
            ).map(
              ([
                month,
                evolutions,
              ]) => (
                <ClinicTimelineGroup
                  key={month}
                  title={month}
                >
                  {evolutions.map(
                    (
                      evolution
                    ) => (
                      <EvolutionCard
                        key={
                          evolution.id
                        }
                        evolution={
                          evolution
                        }
                        onEdit={
                          handleEdit
                        }
                        onDelete={
                          handleDelete
                        }
                      />
                    )
                  )}
                </ClinicTimelineGroup>
              )
            )}
          </ClinicTimeline>
        </div>
      )}

      <EditEvolutionDialog
        open={isEditDialogOpen}
        onOpenChange={
          setIsEditDialogOpen
        }
        evolution={
          selectedEvolution
        }
      />

      <DeleteEvolutionDialog
        open={isDeleteDialogOpen}
        onOpenChange={
          setIsDeleteDialogOpen
        }
        evolution={
          selectedEvolution
        }
      />
    </>
  );
}