"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Appointment } from "../types/appointment";

import {
  getAllAppointments,
  getPatientAppointments,
} from "../services/client/appointmentApi";

interface AppointmentsContextData {
  appointments: Appointment[];
  loading: boolean;
  reload: () => Promise<void>;
}

const AppointmentsContext =
  createContext<AppointmentsContextData | null>(
    null
  );

interface ProviderProps {
  patientId?: string;
  children: ReactNode;
}

export function AppointmentsProvider({
  patientId,
  children,
}: ProviderProps) {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const reload = useCallback(async () => {
    try {
      setLoading(true);

      const data = patientId
        ? await getPatientAppointments(
            patientId
          )
        : await getAllAppointments();

      setAppointments(data);

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
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        reload,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointmentsContext() {
  const context = useContext(
    AppointmentsContext
  );

  if (!context) {
    throw new Error(
      "useAppointmentsContext deve ser utilizado dentro do AppointmentsProvider."
    );
  }

  return context;
}
