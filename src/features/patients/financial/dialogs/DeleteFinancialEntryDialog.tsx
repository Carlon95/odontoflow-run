"use client";

import { useState } from "react";
import { toast } from "sonner";

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

import { deleteFinancialEntry } from "../services/client/financialEntryApi";

import { useFinancialEntriesContext } from "../context/FinancialEntriesContext";

import { FinancialEntry } from "../types/financialEntry";

interface DeleteFinancialEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: FinancialEntry | null;
}

export default function DeleteFinancialEntryDialog({
  open,
  onOpenChange,
  entry,
}: DeleteFinancialEntryDialogProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const { reload } =
    useFinancialEntriesContext();

  async function handleDelete() {
    if (!entry) return;

    try {
      setIsDeleting(true);

      await deleteFinancialEntry(entry.id);

      await reload();

      toast.success(
        "Lançamento excluído com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao excluir lançamento."
      );

    } finally {

      setIsDeleting(false);

    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Excluir lançamento
          </AlertDialogTitle>

          <AlertDialogDescription>
            Esta ação é permanente e não poderá
            ser desfeita.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={isDeleting}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {isDeleting
              ? "Excluindo..."
              : "Excluir"}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}
