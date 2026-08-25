import Link from "next/link";
import { UserRound } from "lucide-react";

import { StatusBadge } from "@/src/clinic-ui";

import { Patient } from "../../patients/types/patient";

interface RecentPatientsProps {
  patients: Patient[];
}

export default function RecentPatients({
  patients,
}: RecentPatientsProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          Pacientes Recentes
        </h2>

        <Link
          href="/patients"
          className="text-sm text-primary hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {patients.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum paciente cadastrado ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/patients/${patient.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-4 w-4" />
                </div>

                <p className="truncate text-sm font-medium">
                  {patient.name}
                </p>
              </div>

              <StatusBadge
                status={patient.status}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
