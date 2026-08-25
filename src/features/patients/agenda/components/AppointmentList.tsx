"use client";

import { useMemo, useState } from "react";

import { Pencil, Trash2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  StatusBadge,
  LoadingState,
  EmptyState,
} from "@/src/clinic-ui";

import EditAppointmentDialog from "../dialogs/EditAppointmentDialog";
import DeleteAppointmentDialog from "../dialogs/DeleteAppointmentDialog";

import { useAppointmentsContext } from "../context/AppointmentsContext";
import { Appointment } from "../types/appointment";

interface AppointmentListProps {
  showPatientName?: boolean;
}

function formatDayLabel(date: string) {
  const d = new Date(date);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const sameDay = (
    a: Date,
    b: Date
  ) =>
    a.toDateString() === b.toDateString();

  if (sameDay(d, today)) return "Hoje";
  if (sameDay(d, tomorrow))
    return "Amanhã";

  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function groupByDay(
  appointments: Appointment[]
) {
  return appointments.reduce(
    (groups, appointment) => {
      const key = new Date(
        appointment.date
      ).toDateString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(appointment);

      return groups;
    },
    {} as Record<string, Appointment[]>
  );
}

export default function AppointmentList({
  showPatientName = false,
}: AppointmentListProps) {
  const { appointments, loading } =
    useAppointmentsContext();

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState<Appointment | null>(null);

  const [
    isEditDialogOpen,
    setIsEditDialogOpen,
  ] = useState(false);

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false);

  function handleEdit(
    appointment: Appointment
  ) {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  }

  function handleDelete(
    appointment: Appointment
  ) {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  }

  const grouped = useMemo(
    () => groupByDay(appointments),
    [appointments]
  );

  if (loading) {
    return (
      <LoadingState
        title="Carregando agenda..."
        description="Buscando as próximas consultas."
      />
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="Nenhuma consulta agendada"
        description="Agende a primeira consulta usando o formulário ao lado."
      />
    );
  }

  return (
    <>
      <div className="space-y-8">
        {Object.entries(grouped).map(
          ([day, items]) => (
            <div key={day}>
              <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
                {formatDayLabel(
                  items[0].date
                )}
              </h3>

              <div className="space-y-2">
                {items.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {formatTime(
                          appointment.date
                        )}
                        <span className="text-muted-foreground">
                          ({appointment.duration}min)
                        </span>
                      </div>

                      {showPatientName &&
                        appointment.patient && (
                          <span className="font-medium">
                            {
                              appointment
                                .patient
                                .name
                            }
                          </span>
                        )}

                      {appointment.procedure && (
                        <span className="text-sm text-muted-foreground">
                          {appointment.procedure.name}
                        </span>
                      )}

                      {appointment.professional && (
                        <span className="text-sm text-muted-foreground">
                          Dr(a). {appointment.professional.name}
                        </span>
                      )}

                      <StatusBadge
                        status={
                          appointment.status
                        }
                      />

                      {appointment.notes && (
                        <span className="text-sm text-muted-foreground">
                          {appointment.notes}
                        </span>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEdit(
                            appointment
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            appointment
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <EditAppointmentDialog
        open={isEditDialogOpen}
        onOpenChange={
          setIsEditDialogOpen
        }
        appointment={selectedAppointment}
      />

      <DeleteAppointmentDialog
        open={isDeleteDialogOpen}
        onOpenChange={
          setIsDeleteDialogOpen
        }
        appointment={selectedAppointment}
      />
    </>
  );
}
