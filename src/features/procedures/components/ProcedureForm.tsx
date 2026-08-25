"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  procedureSchema,
  ProcedureFormData,
} from "../schemas/procedureSchema";

import {
  createProcedure,
  updateProcedure,
} from "../services/procedureApi";

import {
  Procedure,
  PROCEDURE_CATEGORIES,
} from "../types/procedure";

import { FormField } from "@/src/clinic-ui";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import SectionCard from "@/src/clinic-ui/layout/SectionCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProcedureFormProps {
  onSave: () => void;
  procedure?: Procedure;
}

export default function ProcedureForm({
  onSave,
  procedure,
}: ProcedureFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ProcedureFormData>({
    resolver: zodResolver(procedureSchema),
    defaultValues: {
      name: "",
      category: "",
      defaultPrice: undefined,
      defaultDurationMinutes: undefined,
      active: true,
    },
  });

  useEffect(() => {
    if (procedure) {
      reset({
        name: procedure.name,
        category: procedure.category ?? "",
        defaultPrice: procedure.defaultPrice ?? undefined,
        defaultDurationMinutes:
          procedure.defaultDurationMinutes ?? undefined,
        active: procedure.active,
      });
    } else {
      reset({
        name: "",
        category: "",
        defaultPrice: undefined,
        defaultDurationMinutes: undefined,
        active: true,
      });
    }
  }, [procedure, reset]);

  async function handleSave(data: ProcedureFormData) {
    try {
      if (procedure) {
        await updateProcedure(procedure.id, data);

        toast.success("Procedimento atualizado com sucesso!");
      } else {
        await createProcedure(data);

        toast.success("Procedimento cadastrado com sucesso!");
      }

      onSave();
    } catch (error) {
      console.error(error);

      toast.error("Não foi possível salvar o procedimento.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSave)}
      className="space-y-6"
    >
      <SectionCard
        title="Dados do Procedimento"
        description="Informações usadas na agenda e no plano de tratamento."
      >
        <div className="space-y-5">
          <FormField
            id="name"
            label="Nome do Procedimento"
            required
            error={errors.name?.message}
          >
            <Input
              id="name"
              placeholder="Ex: Restauração em Resina"
              {...register("name")}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              label="Categoria"
              error={errors.category?.message}
            >
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>

                    <SelectContent>
                      {PROCEDURE_CATEGORIES.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Ativo"
              error={errors.active?.message}
            >
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <div className="flex h-9 items-center gap-2">
                    <Switch
                      id="active"
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="active" className="text-sm text-muted-foreground">
                      {field.value ?? true
                        ? "Disponível para novos agendamentos"
                        : "Inativo (oculto na agenda)"}
                    </Label>
                  </div>
                )}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              id="defaultPrice"
              label="Valor Padrão (R$)"
              error={errors.defaultPrice?.message}
            >
              <Input
                id="defaultPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register("defaultPrice", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
            </FormField>

            <FormField
              id="defaultDurationMinutes"
              label="Duração Padrão (minutos)"
              error={errors.defaultDurationMinutes?.message}
            >
              <Input
                id="defaultDurationMinutes"
                type="number"
                min="1"
                placeholder="Ex: 40"
                {...register("defaultDurationMinutes", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
            </FormField>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? procedure
              ? "Atualizando..."
              : "Salvando..."
            : procedure
            ? "Atualizar Procedimento"
            : "Salvar Procedimento"}
        </Button>
      </div>
    </form>
  );
}
