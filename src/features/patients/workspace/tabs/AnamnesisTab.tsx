"use client";

import AnamnesisForm from "../../anamnese/components/AnamnesisForm";

interface AnamnesisTabProps {
  patientId: string;
}

export default function AnamnesisTab({
  patientId,
}: AnamnesisTabProps) {
  return (
    <AnamnesisForm
      patientId={patientId}
    />
  );
}