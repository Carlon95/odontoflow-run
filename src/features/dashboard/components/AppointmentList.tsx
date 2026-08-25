import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { StatusBadge } from "@/src/clinic-ui";

interface AppointmentListProps {
  appointments: {
    id: string;
    date: Date;
    duration: number;
    status: string;
    patient?: {
      id: string;
      name: string;
    };
  }[];
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppointmentList({
  appointments,
}: AppointmentListProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          Consultas de Hoje
        </h2>

        <Link
          href="/agenda"
          className="text-sm text-primary hover:underline"
        >
          Ver agenda
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma consulta agendada para hoje.
        </p>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {appointment.patient?.name ??
                      "Paciente"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatTime(appointment.date)}
                    {" · "}
                    {appointment.duration}min
                  </p>
                </div>
              </div>

              <StatusBadge
                status={appointment.status}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
