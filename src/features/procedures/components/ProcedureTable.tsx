"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import EmptyState from "@/src/clinic-ui/feedback/EmptyState";

import { Procedure } from "../types/procedure";

interface ProcedureTableProps {
  procedures: Procedure[];
  onEdit: (procedure: Procedure) => void;
  onDelete: (procedure: Procedure) => void;
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) return "—";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ProcedureTable({
  procedures,
  onEdit,
  onDelete,
}: ProcedureTableProps) {
  if (procedures.length === 0) {
    return (
      <EmptyState
        icon="🦷"
        title="Nenhum procedimento cadastrado"
        description="Cadastre os procedimentos oferecidos pela clínica para usá-los na agenda e no plano de tratamento."
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
                Procedimento
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Categoria
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Valor Padrão
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Duração
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="w-24"></th>
            </tr>
          </thead>

          <tbody>
            {procedures.map((procedure) => (
              <tr
                key={procedure.id}
                className="border-b transition-colors hover:bg-muted/30 last:border-b-0"
              >
                <td className="px-6 py-4 font-medium">
                  {procedure.name}
                </td>

                <td className="px-6 text-sm text-muted-foreground">
                  {procedure.category ?? "—"}
                </td>

                <td className="px-6 text-sm">
                  {formatCurrency(procedure.defaultPrice)}
                </td>

                <td className="px-6 text-sm text-muted-foreground">
                  {procedure.defaultDurationMinutes
                    ? `${procedure.defaultDurationMinutes} min`
                    : "—"}
                </td>

                <td className="px-6">
                  <Badge
                    variant="secondary"
                    className={
                      procedure.active
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                    }
                  >
                    {procedure.active ? "Ativo" : "Inativo"}
                  </Badge>
                </td>

                <td className="px-6 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(procedure)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(procedure)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
