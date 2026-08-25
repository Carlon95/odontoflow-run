"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { SectionCard } from "@/src/clinic-ui";

import { useAppointmentsContext } from "../context/AppointmentsContext";
import { createAppointment } from "../services/client/appointmentApi";

import AppointmentFields, {
  AppointmentFormData,
} from "./AppointmentFields";

interface AppointmentFormProps {
  patientId?: string;
}

function buildDefaultValues(
  patientId?: string
): AppointmentFormData {
  return {
    patientId: patientId ?? "",
    professionalId: "",
    procedureId: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: "30",
    status: "Agendada",
    notes: "",
  };
}

export default function AppointmentForm({
  patientId,
}: AppointmentFormProps) {
  const [isSaving, setIsSaving] =
    useState(false);

  const { reload } =
    useAppointmentsContext();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues:
      buildDefaultValues(patientId),
  });

  async function onSubmit(
    data: AppointmentFormData
  ) {
    try {
      setIsSaving(true);

      const isoDate = new Date(
        `${data.date}T${data.time}:00`
      ).toISOString();

      await createAppointment({
        patientId:
          patientId ?? data.patientId,
        professionalId: data.professionalId || undefined,
        procedureId: data.procedureId || undefined,
        date: isoDate,
        duration: Number(data.duration),
        status: data.status,
        notes: data.notes || undefined,
      });

      await reload();

      toast.success(
        "Consulta agendada com sucesso."
      );

      reset(
        buildDefaultValues(patientId)
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao agendar consulta."
      );

    } finally {

      setIsSaving(false);

    }
  }

  return (
    <SectionCard
      title="Nova Consulta"
      description="Agende uma consulta."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <AppointmentFields
          register={register}
          control={control}
          errors={errors}
          showPatientSelect={!patientId}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? "Agendando..."
              : "Agendar Consulta"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
