"use client";

import { useState } from "react";

import InfoCard from "@/src/clinic-ui/data-display/InfoCard";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

import ScheduleSessionDialog from "../../agenda/dialogs/ScheduleSessionDialog";
import { Appointment } from "../../agenda/types/appointment";

interface NextSessionCardProps {
  patientId: string;
  nextAppointment: Appointment | null;
}

export default function NextSessionCard({
  patientId,
  nextAppointment,
}: NextSessionCardProps) {
  const [isDialogOpen, setIsDialogOpen] =
    useState(false);

  return (
    <InfoCard
      title="Próxima Consulta"
      subtitle="Agenda"
    >
      <div className="space-y-4">

        {nextAppointment ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {new Date(
                nextAppointment.date
              ).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
              {" às "}
              {new Date(
                nextAppointment.date
              ).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="text-sm text-muted-foreground">
              {nextAppointment.duration} minutos
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma consulta agendada.
          </p>
        )}

        <Button
          size="sm"
          className="w-full"
          onClick={() =>
            setIsDialogOpen(true)
          }
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Agendar consulta
        </Button>

      </div>

      <ScheduleSessionDialog
        patientId={patientId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </InfoCard>
  );
}
