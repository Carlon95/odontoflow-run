"use client";

import TreatmentPlanForm from "../../treatment-plan/components/TreatmentPlanForm";

interface TreatmentPlanTabProps {
  patientId: string;
}

export default function TreatmentPlanTab({
  patientId,
}: TreatmentPlanTabProps) {
  return (
    <TreatmentPlanForm
      patientId={patientId}
    />
  );
}
