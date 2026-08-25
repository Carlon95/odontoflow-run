"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Repeat, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  ClinicInput,
  FormField,
  SectionCard,
} from "@/src/clinic-ui";

import {
  createRecurringCharge,
  deleteRecurringCharge,
  getRecurringCharges,
  toggleRecurringCharge,
} from "../services/client/recurringChargeApi";

import { RecurringCharge } from "../types/recurringCharge";

interface RecurringChargesSectionProps {
  patientId: string;
}

interface FormData {
  description: string;
  amount: string;
  dayOfMonth: string;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function RecurringChargesSection({
  patientId,
}: RecurringChargesSectionProps) {
  const [charges, setCharges] = useState<
    RecurringCharge[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: "",
      amount: "",
      dayOfMonth: "5",
    },
  });

  const load = useCallback(async () => {
    try {
      const data =
        await getRecurringCharges(
          patientId
        );

      setCharges(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }, [patientId]);

  useEffect(() => {
    // Busca única ao montar — padrão intencional de "carregar
    // dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function onSubmit(data: FormData) {
    try {
      setIsSaving(true);

      await createRecurringCharge(
        patientId,
        {
          description: data.description,
          amount: Number(data.amount),
          dayOfMonth: Number(
            data.dayOfMonth
          ),
        }
      );

      toast.success(
        "Cobrança recorrente criada."
      );

      reset({
        description: "",
        amount: "",
        dayOfMonth: "5",
      });

      await load();

    } catch (error) {

      toast.error(
        "Erro ao criar cobrança recorrente."
      );

    } finally {

      setIsSaving(false);

    }
  }

  async function handleToggle(
    charge: RecurringCharge
  ) {
    try {
      await toggleRecurringCharge(
        charge.id,
        !charge.active
      );

      await load();

    } catch (error) {

      toast.error(
        "Erro ao atualizar cobrança."
      );

    }
  }

  async function handleDelete(
    charge: RecurringCharge
  ) {
    try {
      await deleteRecurringCharge(
        charge.id
      );

      toast.success(
        "Cobrança recorrente excluída."
      );

      await load();

    } catch (error) {

      toast.error(
        "Erro ao excluir cobrança."
      );

    }
  }

  return (
    <SectionCard
      title="Cobranças Recorrentes"
      description="Gera automaticamente uma nova cobrança todo mês, no dia escolhido."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-end"
      >
        <div className="sm:col-span-2">
          <FormField
            label="Descrição"
            required
          >
            <>
              <ClinicInput
                placeholder="Ex: Mensalidade"
                {...register(
                  "description",
                  {
                    required:
                      "Informe a descrição.",
                  }
                )}
              />

              {errors.description && (
                <p className="mt-1 text-sm text-destructive">
                  {
                    errors.description
                      .message
                  }
                </p>
              )}
            </>
          </FormField>
        </div>

        <FormField
          label="Valor (R$)"
          required
        >
          <ClinicInput
            type="number"
            step="0.01"
            min="0"
            {...register("amount", {
              required:
                "Informe o valor.",
            })}
          />
        </FormField>

        <FormField
          label="Dia do mês"
          required
        >
          <ClinicInput
            type="number"
            min="1"
            max="28"
            {...register("dayOfMonth", {
              required:
                "Informe o dia.",
            })}
          />
        </FormField>

        <div className="sm:col-span-4">
          <Button
            type="submit"
            disabled={isSaving}
          >
            <Repeat className="mr-2 h-4 w-4" />
            {isSaving
              ? "Criando..."
              : "Criar Cobrança Recorrente"}
          </Button>
        </div>
      </form>

      {!loading && charges.length > 0 && (
        <div className="space-y-2">
          {charges.map((charge) => (
            <div
              key={charge.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {charge.description}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatCurrency(
                    charge.amount
                  )}{" "}
                  · todo dia{" "}
                  {charge.dayOfMonth}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={charge.active}
                    onCheckedChange={() =>
                      handleToggle(charge)
                    }
                  />

                  <span className="text-xs text-muted-foreground">
                    {charge.active
                      ? "Ativa"
                      : "Pausada"}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDelete(charge)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
