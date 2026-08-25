"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

import AppointmentFields, {
  AppointmentFormData,
} from "../components/AppointmentFields";

import { createAppointment } from "../services/client/appointmentApi";

interface ScheduleSessionDialogProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleSessionDialog({
  patientId,
  open,
  onOpenChange,
}: ScheduleSessionDialogProps) {
  const router = useRouter();

  const [isSaving, setIsSaving] =
    useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: {
      patientId,
      professionalId: "",
      procedureId: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
      time: "09:00",
      duration: "30",
      status: "Agendada",
      notes: "",
    },
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
        patientId,
        professionalId: data.professionalId || undefined,
        procedureId: data.procedureId || undefined,
        date: isoDate,
        duration: Number(data.duration),
        status: data.status,
        notes: data.notes || undefined,
      });

      toast.success(
        "Consulta agendada com sucesso."
      );

      onOpenChange(false);

      reset();

      router.refresh();

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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">

        <DialogHeader>

          <DialogTitle>
            Agendar Consulta
          </DialogTitle>

          <DialogDescription>
            Marque a próxima consulta deste paciente.
          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <AppointmentFields
            register={register}
            control={control}
            errors={errors}
            showPatientSelect={false}
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
                ? "Agendando..."
                : "Agendar"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
