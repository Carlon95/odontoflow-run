"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteAppointment } from "../services/client/appointmentApi";

import { useAppointmentsContext } from "../context/AppointmentsContext";

import { Appointment } from "../types/appointment";

interface DeleteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export default function DeleteAppointmentDialog({
  open,
  onOpenChange,
  appointment,
}: DeleteAppointmentDialogProps) {
  const [isDeleting, setIsDeleting] =
    useState(false);

  const { reload } =
    useAppointmentsContext();

  async function handleDelete() {
    if (!appointment) return;

    try {
      setIsDeleting(true);

      await deleteAppointment(
        appointment.id
      );

      await reload();

      toast.success(
        "Agendamento excluído com sucesso."
      );

      onOpenChange(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao excluir agendamento."
      );

    } finally {

      setIsDeleting(false);

    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Excluir agendamento
          </AlertDialogTitle>

          <AlertDialogDescription>
            Esta ação é permanente e não poderá
            ser desfeita.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={isDeleting}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {isDeleting
              ? "Excluindo..."
              : "Excluir"}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}
