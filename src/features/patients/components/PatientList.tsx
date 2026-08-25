"use client";

import EmptyState from "@/src/clinic-ui/feedback/EmptyState";

import { Patient } from "../types/patient";
import PatientListItem from "./PatientListItem";

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
}

export default function PatientList({
  patients,
  onEdit,
}: PatientListProps) {
  if (patients.length === 0) {
    return (
      <EmptyState
        icon="👤"
        title="Nenhum paciente encontrado"
        description="Cadastre seu primeiro paciente para começar."
      />
    );
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <PatientListItem
          key={patient.id}
          patient={patient}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}