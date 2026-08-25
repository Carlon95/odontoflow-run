"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ClinicTextarea,
  FormField,
  SectionCard,
  LoadingState,
  Odontogram,
} from "@/src/clinic-ui";

import { useTreatmentPlan } from "../hooks/useTreatmentPlan";
import { saveTreatmentPlan } from "../services/treatmentPlanApi";

import {
  TREATMENT_PLAN_ITEM_STATUSES,
} from "../schemas/treatmentPlanSchema";

import { TreatmentPlanFormData } from "../types/treatmentPlan";

import { getProcedures } from "@/src/features/procedures/services/procedureApi";
import { Procedure } from "@/src/features/procedures/types/procedure";

interface TreatmentPlanFormProps {
  patientId: string;
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) return "—";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function TreatmentPlanForm({
  patientId,
}: TreatmentPlanFormProps) {
  const { treatmentPlan, loading } =
    useTreatmentPlan(patientId);

  const [saving, setSaving] = useState(false);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [highlightedItemId, setHighlightedItemId] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm<TreatmentPlanFormData>({
    defaultValues: {
      patientId,
      generalNotes: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    getProcedures()
      .then((data) =>
        setProcedures(data.filter((procedure) => procedure.active))
      )
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!treatmentPlan) return;

    reset({
      patientId,
      generalNotes: treatmentPlan.generalNotes ?? "",
      items: treatmentPlan.items.map((item) => ({
        id: item.id,
        procedureId: item.procedureId ?? undefined,
        toothNumber: item.toothNumber ?? "",
        toothFace: item.toothFace ?? "",
        description: item.description,
        status: item.status as (typeof TREATMENT_PLAN_ITEM_STATUSES)[number],
        estimatedCost: item.estimatedCost ?? undefined,
        notes: item.notes ?? "",
      })),
    });
  }, [treatmentPlan, patientId, reset]);

  function handleAddItem() {
    append({
      procedureId: undefined,
      toothNumber: "",
      toothFace: "",
      description: "",
      status: "Planejado",
      estimatedCost: undefined,
      notes: "",
    });
  }

  function handleToothClick(toothNumber: string) {
    const currentItems = watch("items") ?? [];

    const existingIndex = currentItems.findIndex(
      (item) => item.toothNumber === toothNumber
    );

    if (existingIndex >= 0) {
      const fieldId = fields[existingIndex]?.id;

      if (fieldId) {
        setHighlightedItemId(fieldId);

        document
          .getElementById(`treatment-item-${fieldId}`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

        setTimeout(
          () => setHighlightedItemId(null),
          1600
        );
      }

      return;
    }

    append({
      procedureId: undefined,
      toothNumber,
      toothFace: "",
      description: "",
      status: "Planejado",
      estimatedCost: undefined,
      notes: "",
    });
  }

  function handleProcedureChange(
    index: number,
    procedureId: string | null
  ) {
    if (!procedureId) return;

    const procedure = procedures.find((p) => p.id === procedureId);

    setValue(`items.${index}.procedureId`, procedureId);

    if (procedure) {
      setValue(`items.${index}.description`, procedure.name);

      if (procedure.defaultPrice !== null && procedure.defaultPrice !== undefined) {
        setValue(`items.${index}.estimatedCost`, procedure.defaultPrice);
      }
    }
  }

  async function onSubmit(data: TreatmentPlanFormData) {
    try {
      setSaving(true);

      await saveTreatmentPlan({
        ...data,
        patientId,
      });

      toast.success("Plano de tratamento salvo com sucesso.");
    } catch (error) {
      console.error(error);

      toast.error("Erro ao salvar plano de tratamento.");
    } finally {
      setSaving(false);
    }
  }

  const items = watch("items");

  const totalEstimated = items?.reduce(
    (sum, item) => sum + (item.estimatedCost ?? 0),
    0
  ) ?? 0;

  if (loading) {
    return (
      <LoadingState
        title="Carregando plano de tratamento..."
        description="Buscando os dados do paciente."
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="font-heading text-2xl font-bold">
          Plano de Tratamento
        </h1>

        <p className="mt-2 text-muted-foreground">
          Liste os procedimentos planejados, o dente envolvido
          (quando aplicável) e o custo estimado.
        </p>

        {treatmentPlan?.updatedAt && (
          <p className="mt-4 text-sm text-muted-foreground">
            Última atualização:{" "}
            {new Date(treatmentPlan.updatedAt).toLocaleString(
              "pt-BR"
            )}
          </p>
        )}
      </div>

      <SectionCard
        title="🦷 Procedimentos Planejados"
        description="Clique em um dente no odontograma para adicionar ou localizar um procedimento, ou use o botão abaixo."
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <Odontogram
              teeth={(items ?? [])
                .filter((item) => item.toothNumber)
                .map((item) => ({
                  toothNumber: item.toothNumber as string,
                  status: item.status,
                }))}
              onToothClick={handleToothClick}
            />
          </div>

          <div className="space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum procedimento adicionado ainda.
            </p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              id={`treatment-item-${field.id}`}
              className={cn(
                "rounded-lg border p-4 transition-all duration-300",
                highlightedItemId === field.id &&
                  "border-primary ring-2 ring-primary/40"
              )}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-4">
                  <FormField label="Procedimento">
                    <Controller
                      control={control}
                      name={`items.${index}.procedureId`}
                      render={({ field: selectField }) => (
                        <Select
                          value={selectField.value || undefined}
                          onValueChange={(value) =>
                            handleProcedureChange(index, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>

                          <SelectContent>
                            {procedures.map((procedure) => (
                              <SelectItem
                                key={procedure.id}
                                value={procedure.id}
                              >
                                {procedure.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-3">
                  <FormField label="Descrição">
                    <Input
                      placeholder="Nome do procedimento"
                      {...register(`items.${index}.description`)}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-1">
                  <FormField label="Dente">
                    <Input
                      placeholder="Ex: 16"
                      {...register(`items.${index}.toothNumber`)}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-1">
                  <FormField label="Face">
                    <Input
                      placeholder="O, M..."
                      {...register(`items.${index}.toothFace`)}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Status">
                    <Controller
                      control={control}
                      name={`items.${index}.status`}
                      render={({ field: statusField }) => (
                        <Select
                          value={statusField.value}
                          onValueChange={statusField.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {TREATMENT_PLAN_ITEM_STATUSES.map(
                              (status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-1 flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-3">
                  <FormField label="Custo Estimado (R$)">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      {...register(`items.${index}.estimatedCost`, {
                        setValueAs: (value) =>
                          value === "" ? undefined : Number(value),
                      })}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-9">
                  <FormField label="Notas do item">
                    <Input
                      placeholder="Observações específicas deste procedimento"
                      {...register(`items.${index}.notes`)}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Procedimento
          </Button>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <span className="text-sm text-muted-foreground">
              Total estimado:
            </span>

            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary text-base"
            >
              {formatCurrency(totalEstimated)}
            </Badge>
          </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="📄 Observações Gerais"
        description="Notas gerais sobre a condução do tratamento."
      >
        <FormField label="Observações">
          <ClinicTextarea
            {...register("generalNotes")}
          />
        </FormField>
      </SectionCard>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Salvando..."
            : "Salvar Plano de Tratamento"}
        </Button>
      </div>
    </form>
  );
}
