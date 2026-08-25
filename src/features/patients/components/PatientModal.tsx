"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import PatientForm from "./PatientForm";
import { Patient } from "../types/patient";

interface PatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  patient?: Patient;
}

export default function PatientModal({
  open,
  onOpenChange,
  onSave,
  patient,
}: PatientModalProps) {
  function handleSave() {
    onOpenChange(false);
    onSave();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
  <DialogTitle>
    {patient ? "Editar Paciente" : "Novo Paciente"}
  </DialogTitle>

  <DialogDescription>
    {patient
      ? "Atualize as informações do paciente."
      : "Preencha os dados para cadastrar um novo paciente."}
  </DialogDescription>
</DialogHeader>

        <PatientForm
          patient={patient}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}