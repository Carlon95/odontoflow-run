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

import FinancialEntryFields, {
  FinancialEntryFormData,
} from "../components/FinancialEntryFields";

import { FinancialEntry } from "../types/financialEntry";

import { updateFinancialEntry } from "../services/client/financialEntryApi";

import { useFinancialEntriesContext } from "../context/FinancialEntriesContext";

interface EditFinancialEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: FinancialEntry | null;
}

export default function EditFinancialEntryDialog({
  open,
  onOpenChange,
  entry,
}: EditFinancialEntryDialogProps) {
  const [isSaving, setIsSaving] =
    useState(false);

  const { reload } =
    useFinancialEntriesContext();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinancialEntryFormData>();

  useEffect(() => {
    if (!entry) return;

    reset({
      date: entry.date.split("T")[0],
      description: entry.description,
      amount: String(entry.amount),
      method: entry.method ?? "",
    });
  }, [entry, reset]);

  async function onSubmit(
    data: FinancialEntryFormData
  ) {
    if (!entry) return;

    try {
      setIsSaving(true);

      await updateFinancialEntry(
        entry.id,
        {
          date: data.date,
          description: data.description,
          amount: Number(data.amount),
          method: data.method || undefined,
        }
      );

      await reload();

      toast.success(
        "Lançamento atualizado com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao atualizar lançamento."
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
      <DialogContent className="sm:max-w-2xl">

        <DialogHeader>

          <DialogTitle>
            Editar Lançamento
          </DialogTitle>

          <DialogDescription>
            Atualize os dados do lançamento financeiro.
          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FinancialEntryFields
            register={register}
            control={control}
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
