"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Evolution } from "../types/evolution";
import { getEvolutions } from "../services/client/evolutionApi";

interface EvolutionsContextData {
  evolutions: Evolution[];
  loading: boolean;
  reload: () => Promise<void>;
}

const EvolutionsContext =
  createContext<EvolutionsContextData | null>(
    null
  );

interface ProviderProps {
  patientId: string;
  children: ReactNode;
}

export function EvolutionsProvider({
  patientId,
  children,
}: ProviderProps) {
  const [evolutions, setEvolutions] =
    useState<Evolution[]>([]);

  const [loading, setLoading] =
    useState(true);

  const reload = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await getEvolutions(patientId);

      setEvolutions(data);

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

  return (
    <EvolutionsContext.Provider
      value={{
        evolutions,
        loading,
        reload,
      }}
    >
      {children}
    </EvolutionsContext.Provider>
  );
}

export function useEvolutionsContext() {
  const context =
    useContext(EvolutionsContext);

  if (!context) {
    throw new Error(
      "useEvolutionsContext deve ser utilizado dentro do EvolutionsProvider."
    );
  }

  return context;
}