"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FinancialEntry } from "../types/financialEntry";
import { getFinancialEntries } from "../services/client/financialEntryApi";

interface FinancialTotals {
  paid: number;
  pending: number;
  overdue: number;
}

interface FinancialEntriesContextData {
  entries: FinancialEntry[];
  loading: boolean;
  totals: FinancialTotals;
  reload: () => Promise<void>;
}

const FinancialEntriesContext =
  createContext<FinancialEntriesContextData | null>(
    null
  );

interface ProviderProps {
  patientId: string;
  children: ReactNode;
}

export function FinancialEntriesProvider({
  patientId,
  children,
}: ProviderProps) {
  const [entries, setEntries] =
    useState<FinancialEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const reload = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await getFinancialEntries(patientId);

      setEntries(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }, [patientId]);

  useEffect(() => {
    // Busca única ao montar (ou quando patientId muda), não um
    // ciclo de atualização em cascata — padrão intencional de
    // "carregar dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        if (entry.status === "Pago") {
          acc.paid += entry.amount;
        } else if (
          entry.status === "Atrasado"
        ) {
          acc.overdue += entry.amount;
        } else {
          acc.pending += entry.amount;
        }

        return acc;
      },
      { paid: 0, pending: 0, overdue: 0 }
    );
  }, [entries]);

  return (
    <FinancialEntriesContext.Provider
      value={{
        entries,
        loading,
        totals,
        reload,
      }}
    >
      {children}
    </FinancialEntriesContext.Provider>
  );
}

export function useFinancialEntriesContext() {
  const context = useContext(
    FinancialEntriesContext
  );

  if (!context) {
    throw new Error(
      "useFinancialEntriesContext deve ser utilizado dentro do FinancialEntriesProvider."
    );
  }

  return context;
}
