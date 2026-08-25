"use client";

import { useMemo, useState } from "react";

import AssessmentCard from "./AssessmentCard";

import EditAssessmentDialog from "../dialogs/EditAssessmentDialog";
import DeleteAssessmentDialog from "../dialogs/DeleteAssessmentDialog";

import {
  useAssessmentsContext,
} from "../context/AssessmentsContext";

import { Assessment } from "../types/assessment";

import {
  ClinicTimeline,
  ClinicTimelineGroup,
  ClinicSearchInput,
  LoadingState,
  EmptyState,
} from "@/src/clinic-ui";

function groupByMonth(
  assessments: Assessment[]
) {
  return assessments.reduce(
    (groups, assessment) => {
      const date = new Date(
        assessment.date
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

      groups[key].push(assessment);

      return groups;
    },
    {} as Record<
      string,
      Assessment[]
    >
  );
}

export default function AssessmentList() {
  const {
    assessments,
    loading,
  } = useAssessmentsContext();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedAssessment,
    setSelectedAssessment,
  ] = useState<Assessment | null>(
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
    assessment: Assessment
  ) {
    setSelectedAssessment(
      assessment
    );

    setIsEditDialogOpen(true);
  }

  function handleDelete(
    assessment: Assessment
  ) {
    setSelectedAssessment(
      assessment
    );

    setIsDeleteDialogOpen(true);
  }

  const filteredAssessments =
    useMemo(() => {
      const term = search
        .trim()
        .toLowerCase();

      if (!term) {
        return assessments;
      }

      return assessments.filter(
        (assessment) =>
          assessment.type
            .toLowerCase()
            .includes(term) ||
          assessment.description
            .toLowerCase()
            .includes(term)
      );
    }, [
      assessments,
      search,
    ]);

  const groupedAssessments =
    useMemo(
      () =>
        groupByMonth(
          filteredAssessments
        ),
      [filteredAssessments]
    );

  if (loading) {
    return (
      <LoadingState
        title="Carregando avaliações..."
        description="Buscando as avaliações do paciente."
      />
    );
  }

  return (
    <>
      <ClinicSearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar avaliação..."
      />

      {filteredAssessments.length ===
      0 ? (
        <div className="mt-6">
          <EmptyState
            icon="🩺"
            title={
              search
                ? "Nenhuma avaliação encontrada"
                : "Nenhuma avaliação cadastrada"
            }
            description={
              search
                ? "Tente buscar por outro termo."
                : "Registre a primeira avaliação deste paciente."
            }
          />
        </div>
      ) : (
        <div className="mt-6">
          <ClinicTimeline>
            {Object.entries(
              groupedAssessments
            ).map(
              ([
                month,
                assessments,
              ]) => (
                <ClinicTimelineGroup
                  key={month}
                  title={month}
                >
                  {assessments.map(
                    (
                      assessment
                    ) => (
                      <AssessmentCard
                        key={
                          assessment.id
                        }
                        assessment={
                          assessment
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

      <EditAssessmentDialog
        open={isEditDialogOpen}
        onOpenChange={
          setIsEditDialogOpen
        }
        assessment={
          selectedAssessment
        }
      />

      <DeleteAssessmentDialog
        open={isDeleteDialogOpen}
        onOpenChange={
          setIsDeleteDialogOpen
        }
        assessment={
          selectedAssessment
        }
      />
    </>
  );
}
