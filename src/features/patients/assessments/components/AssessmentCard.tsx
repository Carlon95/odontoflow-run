import {
  ClipboardCheck,
} from "lucide-react";

import {
  ClinicTimelineItem,
} from "@/src/clinic-ui";

import AssessmentActions from "./AssessmentActions";

import { Assessment } from "../types/assessment";

interface AssessmentCardProps {
  assessment: Assessment;
  onEdit?: (assessment: Assessment) => void;
  onDelete?: (assessment: Assessment) => void;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "pt-BR"
  );
}

export default function AssessmentCard({
  assessment,
  onEdit,
  onDelete,
}: AssessmentCardProps) {
  return (
    <ClinicTimelineItem
      icon={
        <ClipboardCheck className="h-4 w-4" />
      }
      title={assessment.type}
      subtitle={formatDate(assessment.date)}
      actions={
        <AssessmentActions
          onEdit={() =>
            onEdit?.(assessment)
          }
          onDelete={() =>
            onDelete?.(assessment)
          }
        />
      }
    >
      <p className="whitespace-pre-wrap leading-7">
        {assessment.description}
      </p>
    </ClinicTimelineItem>
  );
}
