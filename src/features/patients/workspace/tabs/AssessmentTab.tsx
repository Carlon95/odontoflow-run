"use client";

import AssessmentsTab from "../../assessments/components/AssessmentsTab";

interface AssessmentTabProps {
  patientId: string;
}

export default function AssessmentTab({
  patientId,
}: AssessmentTabProps) {
  return (
    <AssessmentsTab
      patientId={patientId}
    />
  );
}
