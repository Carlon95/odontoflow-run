"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { SectionCard } from "@/src/clinic-ui";

import { useAssessmentsContext } from "../context/AssessmentsContext";

import {
  createAssessment,
} from "../services/client/assessmentApi";

import AssessmentFields, {
  AssessmentFormData,
} from "./AssessmentFields";

interface AssessmentFormProps {
  patientId: string;
}

export default function AssessmentForm({
  patientId,
}: AssessmentFormProps) {
  const [isSaving, setIsSaving] =
    useState(false);

  const { reload } =
    useAssessmentsContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    defaultValues: {
      date: new Date()
        .toISOString()
        .split("T")[0],
      type: "",
      description: "",
    },
  });

  async function onSubmit(
    data: AssessmentFormData
  ) {
    try {
      setIsSaving(true);

      await createAssessment(
        patientId,
        {
          date: data.date,
          type: data.type,
          description: data.description,
        }
      );

      await reload();

      toast.success(
        "Avaliação salva com sucesso."
      );

      reset({
        date: new Date()
          .toISOString()
          .split("T")[0],
        type: "",
        description: "",
      });

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao salvar avaliação."
      );

    } finally {

      setIsSaving(false);

    }
  }

  return (
    <SectionCard
      title="Nova Avaliação"
      description="Registre uma avaliação clínica do paciente."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <AssessmentFields
          register={register}
          errors={errors}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Salvando..."
              : "Salvar Avaliação"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
