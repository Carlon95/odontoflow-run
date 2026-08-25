"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import ProcedureForm from "./ProcedureForm";
import { Procedure } from "../types/procedure";

interface ProcedureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  procedure?: Procedure;
}

export default function ProcedureModal({
  open,
  onOpenChange,
  onSave,
  procedure,
}: ProcedureModalProps) {
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
            {procedure ? "Editar Procedimento" : "Novo Procedimento"}
          </DialogTitle>

          <DialogDescription>
            {procedure
              ? "Atualize as informações do procedimento."
              : "Cadastre um procedimento no catálogo da clínica."}
          </DialogDescription>
        </DialogHeader>

        <ProcedureForm
          procedure={procedure}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}
