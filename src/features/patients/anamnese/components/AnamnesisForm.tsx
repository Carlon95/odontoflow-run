"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  ClinicTextarea,
  FormField,
  SectionCard,
  LoadingState,
} from "@/src/clinic-ui";

import { useAnamnesis } from "../hooks/useAnamnesis";
import { saveAnamnesis } from "../services/anamnesisApi";
import { AnamnesisFormData } from "../types/anamnesis";

interface AnamnesisFormProps {
  patientId: string;
}

type FormData = Omit<AnamnesisFormData, "patientId">;

export default function AnamnesisForm({
  patientId,
}: AnamnesisFormProps) {
  const { anamnesis, loading } =
    useAnamnesis(patientId);

  const [saving, setSaving] =
    useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      chiefComplaint: "",
      medicalConditions: "",
      medications: "",
      allergies: "",
      previousSurgeries: "",
      isPregnant: false,
      isSmoker: false,
      hasBruxism: false,
      lastDentalVisit: "",
      dentalHistory: "",
      oralHygieneHabits: "",
      observations: "",
    },
  });

  useEffect(() => {
    if (!anamnesis) return;

    reset({
      chiefComplaint:
        anamnesis.chiefComplaint ?? "",
      medicalConditions:
        anamnesis.medicalConditions ?? "",
      medications:
        anamnesis.medications ?? "",
      allergies:
        anamnesis.allergies ?? "",
      previousSurgeries:
        anamnesis.previousSurgeries ?? "",
      isPregnant:
        anamnesis.isPregnant ?? false,
      isSmoker:
        anamnesis.isSmoker ?? false,
      hasBruxism:
        anamnesis.hasBruxism ?? false,
      lastDentalVisit: anamnesis.lastDentalVisit
        ? new Date(anamnesis.lastDentalVisit)
            .toISOString()
            .split("T")[0]
        : "",
      dentalHistory:
        anamnesis.dentalHistory ?? "",
      oralHygieneHabits:
        anamnesis.oralHygieneHabits ?? "",
      observations:
        anamnesis.observations ?? "",
    });
  }, [anamnesis, reset]);

  async function onSubmit(
    data: FormData
  ) {
    try {
      setSaving(true);

      await saveAnamnesis({
        patientId,
        ...data,
      });

    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Carregando anamnese..."
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
          Anamnese
        </h1>

        <p className="mt-2 text-muted-foreground">
          Registre as informações clínicas
          iniciais do paciente.
        </p>

        {anamnesis?.updatedAt && (
          <p className="mt-4 text-sm text-muted-foreground">
            Última atualização:{" "}
            {new Date(
              anamnesis.updatedAt
            ).toLocaleString("pt-BR")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

  <SectionCard
    title="📝 Queixa Principal"
    description="Motivo da consulta / principal demanda do paciente."
  >
    <FormField
      label="Queixa Principal"
      required
    >
      <ClinicTextarea
        {...register("chiefComplaint")}
      />
    </FormField>
  </SectionCard>

  <SectionCard
    title="❤️ Condições de Saúde"
    description="Condições sistêmicas relevantes (diabetes, hipertensão, cardiopatias etc.)."
  >
    <div className="space-y-4">
      <FormField
        label="Condições de Saúde"
      >
        <ClinicTextarea
          {...register("medicalConditions")}
        />
      </FormField>

      <FormField label="Cirurgias Prévias">
        <ClinicTextarea
          {...register("previousSurgeries")}
        />
      </FormField>

      <div className="flex flex-wrap gap-6">
        <Controller
          control={control}
          name="isPregnant"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPregnant"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="isPregnant" className="text-sm font-normal">
                Gestante
              </Label>
            </div>
          )}
        />

        <Controller
          control={control}
          name="isSmoker"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="isSmoker"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="isSmoker" className="text-sm font-normal">
                Fumante
              </Label>
            </div>
          )}
        />
      </div>
    </div>
  </SectionCard>

  <SectionCard
    title="💊 Medicamentos e Alergias"
  >
    <div className="space-y-4">
      <FormField
        label="Medicamentos em uso"
      >
        <ClinicTextarea
          {...register("medications")}
        />
      </FormField>

      <FormField
        label="Alergias (medicamentos, anestésicos, látex...)"
      >
        <ClinicTextarea
          {...register("allergies")}
        />
      </FormField>
    </div>
  </SectionCard>

  <SectionCard
    title="🦷 Histórico Odontológico"
  >
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Última Visita ao Dentista">
          <Input
            type="date"
            {...register("lastDentalVisit")}
          />
        </FormField>

        <Controller
          control={control}
          name="hasBruxism"
          render={({ field }) => (
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="hasBruxism"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="hasBruxism" className="text-sm font-normal">
                Bruxismo
              </Label>
            </div>
          )}
        />
      </div>

      <FormField label="Tratamentos Odontológicos Anteriores">
        <ClinicTextarea
          {...register("dentalHistory")}
        />
      </FormField>
    </div>
  </SectionCard>

  <SectionCard
    title="🪥 Higiene Bucal"
    description="Frequência de escovação, uso de fio dental, etc."
  >
    <FormField label="Hábitos de Higiene Bucal">
      <ClinicTextarea
        {...register("oralHygieneHabits")}
      />
    </FormField>
  </SectionCard>

  <SectionCard
    title="📄 Observações"
  >
    <FormField
      label="Observações"
    >
      <ClinicTextarea
        {...register("observations")}
      />
    </FormField>
  </SectionCard>

</div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Salvando..."
            : "Salvar Anamnese"}
        </Button>
      </div>
    </form>
  );
}
