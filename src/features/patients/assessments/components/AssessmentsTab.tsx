"use client";

import AssessmentForm from "./AssessmentForm";
import AssessmentList from "./AssessmentList";

import { AssessmentsProvider } from "../context/AssessmentsContext";

interface AssessmentsTabProps {
  patientId: string;
}

export default function AssessmentsTab({
  patientId,
}: AssessmentsTabProps) {
  return (
    <AssessmentsProvider patientId={patientId}>
      <div className="space-y-6">

        <AssessmentForm
          patientId={patientId}
        />

        <AssessmentList />

      </div>
    </AssessmentsProvider>
  );
}
