"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { RotateCcw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PatientDueForRecall {
  id: string;
  name: string;
  phone: string | null;
  monthsSinceLastVisit: number;
}

interface RecallWidgetProps {
  patients: PatientDueForRecall[];
  totalCount: number;
}

export default function RecallWidget({
  patients,
  totalCount,
}: RecallWidgetProps) {
  const [sendingId, setSendingId] = useState<
    string | null
  >(null);
  const [sentIds, setSentIds] = useState<Set<string>>(
    new Set()
  );

  async function handleSend(patientId: string) {
    try {
      setSendingId(patientId);

      const response = await fetch(
        `/api/recall/${patientId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        const body = await response
          .json()
          .catch(() => null);

        throw new Error(
          body?.message ??
            "Erro ao enviar lembrete."
        );
      }

      toast.success("Lembrete de retorno enviado.");

      setSentIds(
        (prev) => new Set(prev).add(patientId)
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao enviar lembrete."
      );
    } finally {
      setSendingId(null);
    }
  }

  if (patients.length === 0) {
    return null;
  }

  return (
    <div className="shadow-elegant rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <RotateCcw className="h-4 w-4" />
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold">
            Pacientes para Retorno
          </h3>

          <p className="text-xs text-muted-foreground">
            {totalCount} paciente
            {totalCount === 1 ? "" : "s"} sem
            consulta recente
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {patients.map((patient) => {
          const alreadySent = sentIds.has(patient.id);

          return (
            <li
              key={patient.id}
              className="flex items-center justify-between gap-2 rounded-lg border bg-muted/20 px-3 py-2"
            >
              <div className="min-w-0">
                <Link
                  href={`/patients/${patient.id}`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {patient.name}
                </Link>

                <p className="text-xs text-muted-foreground">
                  Há {patient.monthsSinceLastVisit}{" "}
                  meses sem consulta
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={
                  !patient.phone ||
                  sendingId === patient.id ||
                  alreadySent
                }
                onClick={() =>
                  handleSend(patient.id)
                }
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {alreadySent
                  ? "Enviado"
                  : sendingId === patient.id
                  ? "Enviando..."
                  : "Lembrar"}
              </Button>
            </li>
          );
        })}
      </ul>

      {totalCount > patients.length && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          + {totalCount - patients.length} outro
          {totalCount - patients.length === 1
            ? ""
            : "s"}{" "}
          paciente
          {totalCount - patients.length === 1
            ? ""
            : "s"}
        </p>
      )}
    </div>
  );
}
