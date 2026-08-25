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

import EvolutionFields, {
  EvolutionFormData,
} from "../components/EvolutionFields";

import { Evolution } from "../types/evolution";

import {
  updateEvolution,
} from "../services/client/evolutionApi";

import {
  useEvolutionsContext,
} from "../context/EvolutionsContext";

interface EditEvolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evolution: Evolution | null;
}

export default function EditEvolutionDialog({
  open,
  onOpenChange,
  evolution,
}: EditEvolutionDialogProps) {
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
  } = useForm<EvolutionFormData>();

  useEffect(() => {
    if (!evolution) return;

    reset({
      sessionDate:
        evolution.sessionDate.split("T")[0],
      content: evolution.content,
      hasNextSession:
        !!evolution.nextSession,
      nextSession:
        evolution.nextSession
          ? evolution.nextSession.split("T")[0]
          : "",
    });
  }, [evolution, reset]);

  async function onSubmit(
    data: EvolutionFormData
  ) {
    if (!evolution) return;

    try {
      setIsSaving(true);

      await updateEvolution(
        evolution.id,
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
        "Evolução atualizada com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao atualizar evolução."
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
            Editar Evolução
          </DialogTitle>

          <DialogDescription>
            Atualize os dados da evolução clínica.
          </DialogDescription>

        </DialogHeader>

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