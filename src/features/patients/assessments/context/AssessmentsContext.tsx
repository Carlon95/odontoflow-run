"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Assessment } from "../types/assessment";
import { getAssessments } from "../services/client/assessmentApi";

interface AssessmentsContextData {
  assessments: Assessment[];
  loading: boolean;
  reload: () => Promise<void>;
}

const AssessmentsContext =
  createContext<AssessmentsContextData | null>(
    null
  );

interface ProviderProps {
  patientId: string;
  children: ReactNode;
}

export function AssessmentsProvider({
  patientId,
  children,
}: ProviderProps) {
  const [assessments, setAssessments] =
    useState<Assessment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const reload = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await getAssessments(patientId);

      setAssessments(data);

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
    <AssessmentsContext.Provider
      value={{
        assessments,
        loading,
        reload,
      }}
    >
      {children}
    </AssessmentsContext.Provider>
  );
}

export function useAssessmentsContext() {
  const context =
    useContext(AssessmentsContext);

  if (!context) {
    throw new Error(
      "useAssessmentsContext deve ser utilizado dentro do AssessmentsProvider."
    );
  }

  return context;
}
