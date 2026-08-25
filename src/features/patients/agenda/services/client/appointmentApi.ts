import { Appointment } from "../../types/appointment";

export interface AppointmentPayload {
  patientId: string;
  professionalId?: string;
  procedureId?: string;
  date: string;
  duration: number;
  status: string;
  notes?: string;
}

export async function getUpcomingAppointments() {
  const response = await fetch(
    "/api/appointments"
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar agenda."
    );
  }

  return response.json() as Promise<
    Appointment[]
  >;
}

export async function getAllAppointments() {
  const response = await fetch(
    "/api/appointments?all=true"
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar agenda."
    );
  }

  return response.json() as Promise<
    Appointment[]
  >;
}

export async function getPatientAppointments(
  patientId: string
) {
  const response = await fetch(
    `/api/appointments/patient/${patientId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar consultas do paciente."
    );
  }

  return response.json() as Promise<
    Appointment[]
  >;
}

export async function createAppointment(
  data: AppointmentPayload
) {
  const response = await fetch(
    "/api/appointments",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao criar agendamento."
    );
  }

  return response.json() as Promise<Appointment>;
}

export async function updateAppointment(
  id: string,
  data: Omit<
    AppointmentPayload,
    "patientId"
  >
) {
  const response = await fetch(
    `/api/appointments/item/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao atualizar agendamento."
    );
  }

  return response.json() as Promise<Appointment>;
}

export async function deleteAppointment(
  id: string
) {
  const response = await fetch(
    `/api/appointments/item/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const message = await response.text();

    console.error(message);

    throw new Error(message);
  }
}
