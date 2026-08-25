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

import AppointmentFields, {
  AppointmentFormData,
} from "../components/AppointmentFields";

import { Appointment } from "../types/appointment";

import { updateAppointment } from "../services/client/appointmentApi";

import { useAppointmentsContext } from "../context/AppointmentsContext";

interface EditAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export default function EditAppointmentDialog({
  open,
  onOpenChange,
  appointment,
}: EditAppointmentDialogProps) {
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
  } = useForm<AppointmentFormData>();

  useEffect(() => {
    if (!appointment) return;

    const dateObj = new Date(
      appointment.date
    );

    reset({
      patientId: appointment.patientId,
      professionalId: appointment.professionalId ?? "",
      procedureId: appointment.procedureId ?? "",
      date: dateObj
        .toISOString()
        .split("T")[0],
      time: dateObj
        .toISOString()
        .split("T")[1]
        .slice(0, 5),
      duration: String(
        appointment.duration
      ),
      status: appointment.status,
      notes: appointment.notes ?? "",
    });
  }, [appointment, reset]);

  async function onSubmit(
    data: AppointmentFormData
  ) {
    if (!appointment) return;

    try {
      setIsSaving(true);

      const isoDate = new Date(
        `${data.date}T${data.time}:00`
      ).toISOString();

      await updateAppointment(
        appointment.id,
        {
          professionalId: data.professionalId || undefined,
          procedureId: data.procedureId || undefined,
          date: isoDate,
          duration: Number(data.duration),
          status: data.status,
          notes: data.notes || undefined,
        }
      );

      await reload();

      toast.success(
        "Agendamento atualizado com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao atualizar agendamento."
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
            Editar Agendamento
          </DialogTitle>

          <DialogDescription>
            {appointment?.patient?.name &&
              `Paciente: ${appointment.patient.name}`}
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
                ? "Salvando..."
                : "Salvar Alterações"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
