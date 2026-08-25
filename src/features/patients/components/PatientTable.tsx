"use client";

import {
  MoreHorizontal,
  Pencil,
  EyeOff,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EmptyState from "@/src/clinic-ui/feedback/EmptyState";
import StatusBadge from "@/src/clinic-ui/feedback/StatusBadge";

import { Patient } from "../types/patient";

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
}

export default function PatientTable({
  patients,
  onEdit,
}: PatientTableProps) {

  const router = useRouter();
  
  function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return "-";
  }

    const today = new Date();

    let age =
      today.getFullYear() - birth.getFullYear();

    const month =
      today.getMonth() - birth.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        icon="👤"
        title="Nenhum paciente encontrado"
        description="Cadastre seu primeiro paciente para começar."
      />
    );
  }

  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px]">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Paciente
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Idade
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="w-16"></th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b transition-colors hover:bg-muted/30 last:border-b-0"
              >
                <td className="px-6 py-5">
                  <button
  onClick={() => router.push(`/patients/${patient.id}`)}
  className="flex items-center gap-4 text-left w-full"
>
                    <Avatar className="h-11 w-11">
                      <AvatarFallback>
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">
                        {patient.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
  Abrir prontuário
</p>
                    </div>
                  </button>
                </td>

                <td className="px-6">
                  <span className="font-medium">
                    {calculateAge(patient.birthDate)}
                  </span>{" "}
                  anos
                </td>

                <td className="px-6">
                  <StatusBadge
                    status={patient.status}
                  />
                </td>

                
   <td className="px-6 text-right">
  <Button
    variant="ghost"
    size="icon"
    onClick={() => onEdit(patient)}
  >
    <Pencil className="h-4 w-4" />
  </Button>
</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}