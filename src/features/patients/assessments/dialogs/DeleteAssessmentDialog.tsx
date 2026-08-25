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
  deleteAssessment,
} from "../services/client/assessmentApi";

import {
  useAssessmentsContext,
} from "../context/AssessmentsContext";

import { Assessment } from "../types/assessment";

interface DeleteAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: Assessment | null;
}

export default function DeleteAssessmentDialog({
  open,
  onOpenChange,
  assessment,
}: DeleteAssessmentDialogProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const { reload } =
    useAssessmentsContext();

  async function handleDelete() {
    if (!assessment) return;

    try {
      setIsDeleting(true);

      await deleteAssessment(
        assessment.id
      );

      await reload();

      toast.success(
        "Avaliação excluída com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao excluir avaliação."
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
            Excluir avaliação
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
