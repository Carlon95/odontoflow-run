"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { SectionCard } from "@/src/clinic-ui";

import { useEvolutionsContext } from "../context/EvolutionsContext";

import {
  createEvolution,
} from "../services/client/evolutionApi";

import EvolutionFields, {
  EvolutionFormData,
} from "./EvolutionFields";

interface EvolutionFormProps {
  patientId: string;
}

export default function EvolutionForm({
  patientId,
}: EvolutionFormProps) {
  const [isSaving, setIsSaving] =
    useState(false);

  const { reload } =
    useEvolutionsContext();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EvolutionFormData>({
    defaultValues: {
      sessionDate: new Date()
        .toISOString()
        .split("T")[0],
      content: "",
      hasNextSession: true,
      nextSession: "",
    },
  });

  async function onSubmit(
    data: EvolutionFormData
  ) {
    try {
      setIsSaving(true);

      await createEvolution(
        patientId,
        {
          sessionDate:
            data.sessionDate,
          content:
            data.content,
          nextSession:
            data.hasNextSession
              ? data.nextSession
              : null,
        }
      );

      await reload();

      toast.success(
        "Evolução salva com sucesso."
      );

      reset({
        sessionDate: new Date()
          .toISOString()
          .split("T")[0],
        content: "",
        hasNextSession: true,
        nextSession: "",
      });

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao salvar evolução."
      );

    } finally {

      setIsSaving(false);

    }
  }

  return (
    <SectionCard
      title="Nova Evolução"
      description="Registre a evolução clínica do paciente."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <EvolutionFields
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Salvando..."
              : "Salvar Evolução"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}