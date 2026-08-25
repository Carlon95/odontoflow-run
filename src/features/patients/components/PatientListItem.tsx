"use client";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import StatusBadge from "@/src/clinic-ui/feedback/StatusBadge";
import AvatarInitials from "@/src/clinic-ui/data-display/AvatarInitials";

import { Patient } from "../types/patient";

interface PatientListItemProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
}

function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return "-";
  }

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const month = today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

export default function PatientListItem({
  patient,
  onEdit,
}: PatientListItemProps) {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-xl border bg-card
        px-6 py-5
        transition-all duration-200
        hover:border-primary/30
        hover:shadow-sm
      "
    >
      <button
        onClick={() => onEdit(patient)}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <AvatarInitials
          name={patient.name}
          className="h-12 w-12 shrink-0"
        />

        <div className="min-w-0 space-y-1">
          <h3 className="truncate font-semibold">
            {patient.name}
          </h3>

          <p className="truncate text-sm text-muted-foreground">
            {calculateAge(patient.birthDate)} anos •{" "}
            {patient.gender}
          </p>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-4">
        <StatusBadge status={patient.status} />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(patient)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}