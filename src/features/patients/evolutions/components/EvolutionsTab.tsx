"use client";

import EvolutionForm from "./EvolutionForm";
import EvolutionList from "./EvolutionList";

import { EvolutionsProvider } from "../context/EvolutionsContext";

interface EvolutionsTabProps {
  patientId: string;
}

export default function EvolutionsTab({
  patientId,
}: EvolutionsTabProps) {
  return (
    <EvolutionsProvider patientId={patientId}>
      <div className="space-y-6">

        <EvolutionForm
          patientId={patientId}
        />

        <EvolutionList />

      </div>
    </EvolutionsProvider>
  );
}