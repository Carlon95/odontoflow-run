"use client";

import { useState } from "react";

import {
  CheckCircle2,
  Pencil,
  Receipt,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  DataTable,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  ClinicSearchInput,
  LoadingState,
  EmptyState,
} from "@/src/clinic-ui";

import EditFinancialEntryDialog from "../dialogs/EditFinancialEntryDialog";
import DeleteFinancialEntryDialog from "../dialogs/DeleteFinancialEntryDialog";

import { useFinancialEntriesContext } from "../context/FinancialEntriesContext";
import { FinancialEntry } from "../types/financialEntry";

import {
  markFinancialEntryPaid,
  markFinancialEntryUnpaid,
} from "../services/client/financialEntryApi";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "pt-BR"
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function FinancialEntryList() {
  const { entries, loading, reload } =
    useFinancialEntriesContext();

  const [search, setSearch] =
    useState("");

  const [
    selectedEntry,
    setSelectedEntry,
  ] = useState<FinancialEntry | null>(
    null
  );

  const [
    isEditDialogOpen,
    setIsEditDialogOpen,
  ] = useState(false);

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false);

  const [
    togglingId,
    setTogglingId,
  ] = useState<string | null>(null);

  function handleEdit(
    entry: FinancialEntry
  ) {
    setSelectedEntry(entry);
    setIsEditDialogOpen(true);
  }

  function handleDelete(
    entry: FinancialEntry
  ) {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  }

  async function handleTogglePaid(
    entry: FinancialEntry
  ) {
    try {
      setTogglingId(entry.id);

      if (entry.status === "Pago") {
        await markFinancialEntryUnpaid(
          entry.id
        );

        toast.success(
          "Pagamento desfeito."
        );

      } else {

        await markFinancialEntryPaid(
          entry.id
        );

        toast.success(
          "Lançamento marcado como pago."
        );

      }

      await reload();

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar pagamento."
      );

    } finally {

      setTogglingId(null);

    }
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.description
        .toLowerCase()
        .includes(
          search.trim().toLowerCase()
        )
  );

  if (loading) {
    return (
      <LoadingState
        title="Carregando lançamentos..."
        description="Buscando o histórico financeiro."
      />
    );
  }

  return (
    <>
      <ClinicSearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar lançamento..."
      />

      {filteredEntries.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon="💰"
            title={
              search
                ? "Nenhum lançamento encontrado"
                : "Nenhum lançamento financeiro cadastrado"
            }
            description={
              search
                ? "Tente buscar por outro termo."
                : "Registre a primeira cobrança deste paciente."
            }
          />
        </div>
      ) : (
        <div className="mt-6">
          <DataTable
            columns={
              <TableRow>
                <TableHeader>
                  Vencimento
                </TableHeader>
                <TableHeader>
                  Descrição
                </TableHeader>
                <TableHeader>
                  Valor
                </TableHeader>
                <TableHeader>
                  Status
                </TableHeader>
                <TableHeader>
                  Forma
                </TableHeader>
                <TableHeader
                  className="text-right"
                >
                  Ações
                </TableHeader>
              </TableRow>
            }
          >
            {filteredEntries.map(
              (entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {formatDate(entry.date)}
                  </TableCell>

                  <TableCell>
                    {entry.description}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(
                      entry.amount
                    )}
                  </TableCell>

                  <TableCell>
                    <StatusBadge
                      status={entry.status}
                    />
                  </TableCell>

                  <TableCell>
                    {entry.method || "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={
                          togglingId ===
                          entry.id
                        }
                        title={
                          entry.status ===
                          "Pago"
                            ? "Desfazer pagamento"
                            : "Marcar como pago"
                        }
                        onClick={() =>
                          handleTogglePaid(
                            entry
                          )
                        }
                      >
                        {entry.status ===
                        "Pago" ? (
                          <RotateCcw className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </Button>

                      {entry.status ===
                        "Pago" && (
                        <a
                          href={`/api/financial/item/${entry.id}/receipt`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Baixar recibo"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </a>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEdit(entry)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDelete(entry)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </DataTable>
        </div>
      )}

      <EditFinancialEntryDialog
        open={isEditDialogOpen}
        onOpenChange={
          setIsEditDialogOpen
        }
        entry={selectedEntry}
      />

      <DeleteFinancialEntryDialog
        open={isDeleteDialogOpen}
        onOpenChange={
          setIsDeleteDialogOpen
        }
        entry={selectedEntry}
      />
    </>
  );
}
