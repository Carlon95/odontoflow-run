"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import AssessmentFields, {
  AssessmentFormData,
} from "../components/AssessmentFields";

import { Assessment } from "../types/assessment";

import {
  updateAssessment,
} from "../services/client/assessmentApi";

import {
  useAssessmentsContext,
} from "../context/AssessmentsContext";

interface EditAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: Assessment | null;
}

export default function EditAssessmentDialog({
  open,
  onOpenChange,
  assessment,
}: EditAssessmentDialogProps) {
  const [isSaving, setIsSaving] =
    useState(false);

  const { reload } =
    useAssessmentsContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssessmentFormData>();

  useEffect(() => {
    if (!assessment) return;

    reset({
      date:
        assessment.date.split("T")[0],
      type: assessment.type,
      description: assessment.description,
    });
  }, [assessment, reset]);

  async function onSubmit(
    data: AssessmentFormData
  ) {
    if (!assessment) return;

    try {
      setIsSaving(true);

      await updateAssessment(
        assessment.id,
        {
          date: data.date,
          type: data.type,
          description: data.description,
        }
      );

      await reload();

      toast.success(
        "Avaliação atualizada com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao atualizar avaliação."
      );

    } finally {

      setIsSaving(false);

    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-3xl">

        <DialogHeader>

          <DialogTitle>
            Editar Avaliação
          </DialogTitle>

          <DialogDescription>
            Atualize os dados da avaliação clínica.
          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <AssessmentFields
            register={register}
            errors={errors}
          />

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Salvando..."
                : "Salvar Alterações"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
