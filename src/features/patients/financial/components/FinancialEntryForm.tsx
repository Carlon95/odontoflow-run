"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { SectionCard } from "@/src/clinic-ui";

import { useFinancialEntriesContext } from "../context/FinancialEntriesContext";
import { createFinancialEntry } from "../services/client/financialEntryApi";

import FinancialEntryFields, {
  FinancialEntryFormData,
} from "./FinancialEntryFields";

interface FinancialEntryFormProps {
  patientId: string;
}

const defaultValues: FinancialEntryFormData = {
  date: new Date().toISOString().split("T")[0],
  description: "",
  amount: "",
  method: "",
};

export default function FinancialEntryForm({
  patientId,
}: FinancialEntryFormProps) {
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
  } = useForm<FinancialEntryFormData>({
    defaultValues,
  });

  async function onSubmit(
    data: FinancialEntryFormData
  ) {
    try {
      setIsSaving(true);

      await createFinancialEntry(
        patientId,
        {
          date: data.date,
          description: data.description,
          amount: Number(data.amount),
          method: data.method || undefined,
        }
      );

      await reload();

      toast.success(
        "Lançamento salvo com sucesso."
      );

      reset({
        ...defaultValues,
        date: new Date()
          .toISOString()
          .split("T")[0],
      });

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao salvar lançamento."
      );

    } finally {

      setIsSaving(false);

    }
  }

  return (
    <SectionCard
      title="Nova Cobrança"
      description="Registre uma cobrança para o paciente. Ela começa como pendente — marque como paga quando o pagamento acontecer."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FinancialEntryFields
          register={register}
          control={control}
          errors={errors}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Salvando..."
              : "Salvar Lançamento"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
