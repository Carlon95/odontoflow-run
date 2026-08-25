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

import {
  deleteEvolution,
} from "../services/client/evolutionApi";

import {
  useEvolutionsContext,
} from "../context/EvolutionsContext";

import { Evolution } from "../types/evolution";

interface DeleteEvolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evolution: Evolution | null;
}

export default function DeleteEvolutionDialog({
  open,
  onOpenChange,
  evolution,
}: DeleteEvolutionDialogProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const { reload } =
    useEvolutionsContext();

  async function handleDelete() {
    if (!evolution) return;

    try {
      setIsDeleting(true);

      await deleteEvolution(
        evolution.id
      );

      await reload();

      toast.success(
        "Evolução excluída com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao excluir evolução."
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
            Excluir evolução
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