import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  AvatarInitials,
  PageSection,
  StatusBadge,
} from "@/src/clinic-ui";

import { Patient } from "../../types/patient";
import { calculateAge } from "../../utils/calculateAge";

interface PatientWorkspaceHeaderProps {
  patient: Patient;
}

export default function PatientWorkspaceHeader({
  patient,
}: PatientWorkspaceHeaderProps) {
  return (
    <PageSection title="Paciente">
      <Link href="/patients">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para pacientes
        </Button>
      </Link>

      <div className="rounded-xl border bg-card p-6 shadow-sm">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4 sm:gap-5">

            <AvatarInitials
              name={patient.name}
              className="h-14 w-14 shrink-0 text-lg sm:h-20 sm:w-20 sm:text-2xl"
            />

            <div className="min-w-0">

              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">

                <h1 className="font-heading truncate text-xl font-bold sm:text-3xl">
                  {patient.name}
                </h1>

                <StatusBadge
                  status={patient.status}
                />

              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground sm:gap-5">

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    {calculateAge(patient.birthDate)} anos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{patient.gender}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Cadastro em{" "}
                    {new Date(
                      patient.createdAt
                    ).toLocaleDateString("pt-BR")}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </PageSection>
  );
}