import {
  countByStatusInRange,
  create,
  findAll,
  findById,
  findByPatientId,
  findNeedingReminder,
  findUpcoming,
  markReminderSent,
  remove,
  update,
} from "../../repositories/appointmentRepository";

export async function getAppointmentsByPatient(
  patientId: string
) {
  return findByPatientId(patientId);
}

export async function getUpcomingAppointments() {
  return findUpcoming();
}

export async function getAllAppointments() {
  return findAll();
}

export async function getAppointmentCountsByStatus(
  start: Date,
  end: Date
) {
  return countByStatusInRange(start, end);
}

export async function getAppointment(
  id: string
) {
  return findById(id);
}

export async function createAppointment(data: {
  patientId: string;
  professionalId?: string | null;
  procedureId?: string | null;
  date: Date;
  duration?: number;
  status?: string;
  notes?: string;
}) {
  return create(data);
}

export async function updateAppointment(
  id: string,
  data: {
    professionalId?: string | null;
    procedureId?: string | null;
    date: Date;
    duration: number;
    status: string;
    notes?: string;
  }
) {
  return update(id, data);
}

export async function deleteAppointment(
  id: string
) {
  return remove(id);
}

export async function getAppointmentsNeedingReminder(
  windowStart: Date,
  windowEnd: Date
) {
  return findNeedingReminder(
    windowStart,
    windowEnd
  );
}

export async function markAppointmentReminderSent(
  id: string
) {
  return markReminderSent(id);
}
