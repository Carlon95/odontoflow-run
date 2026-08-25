"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Stethoscope } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  PageContainer,
  PageHeader,
  ClinicSearchInput,
} from "@/src/clinic-ui";

import ProcedureModal from "../components/ProcedureModal";
import ProcedureTable from "../components/ProcedureTable";

import { Procedure } from "../types/procedure";
import {
  getProcedures,
  deleteProcedure,
} from "../services/procedureApi";

export default function ProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure>();
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure>();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadProcedures = useCallback(async () => {
    try {
      const data = await getProcedures();
      setProcedures(data);
    } catch (error) {
      console.error("Erro ao carregar procedimentos:", error);
      toast.error("Não foi possível carregar os procedimentos.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProcedures();
  }, [loadProcedures]);

  const filteredProcedures = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return procedures;
    }

    return procedures.filter(
      (procedure) =>
        procedure.name.toLowerCase().includes(searchTerm) ||
        procedure.category?.toLowerCase().includes(searchTerm)
    );
  }, [procedures, search]);

  function handleNewProcedure() {
    setSelectedProcedure(undefined);
    setOpen(true);
  }

  function handleEditProcedure(procedure: Procedure) {
    setSelectedProcedure(procedure);
    setOpen(true);
  }

  async function handleSave() {
    await loadProcedures();
    setOpen(false);
  }

  async function handleConfirmDelete() {
    if (!procedureToDelete) return;

    try {
      setDeleting(true);

      await deleteProcedure(procedureToDelete.id);

      toast.success("Procedimento removido com sucesso.");

      setProcedureToDelete(undefined);
      await loadProcedures();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao remover procedimento."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Procedimentos"
        description="Catálogo de procedimentos oferecidos pela clínica, usado na agenda e no plano de tratamento."
        actions={
          <Button onClick={handleNewProcedure}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Procedimento
          </Button>
        }
      />

      <ProcedureModal
        open={open}
        onOpenChange={setOpen}
        procedure={selectedProcedure}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!procedureToDelete}
        onOpenChange={(value) => {
          if (!value) setProcedureToDelete(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remover {procedureToDelete?.name}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Planos de tratamento e consultas que já usam esse
              procedimento continuam intactos — ele só deixa de
              aparecer para novos agendamentos.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
            >
              {deleting ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ClinicSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou categoria..."
        />

        <div className="flex shrink-0 items-center gap-2 rounded-lg border bg-muted/30 px-4 py-2">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm text-muted-foreground">
            <strong>{procedures.length}</strong> procedimento(s)
          </span>
        </div>
      </div>

      <ProcedureTable
        procedures={filteredProcedures}
        onEdit={handleEditProcedure}
        onDelete={setProcedureToDelete}
      />
    </PageContainer>
  );
}
