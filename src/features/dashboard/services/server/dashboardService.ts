import { getPatients, getPatientCount, getPatientsWithoutAnamnesisCount } from "@/src/features/patients/services/server/patientService";
import { getUpcomingAppointments } from "@/src/features/patients/agenda/services/server/appointmentService";
import { getAllPendingFinancialEntries } from "@/src/features/patients/financial/services/server/financialEntryService";
import { getPatientsDueForRecall } from "@/src/features/recall/services/server/recallService";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function getDashboardData() {
  const [
    patientCount,
    patientsWithoutAnamnesis,
    recentPatients,
    upcomingAppointments,
    pendingFinancialEntries,
    patientsDueForRecall,
  ] = await Promise.all([
    getPatientCount(),
    getPatientsWithoutAnamnesisCount(),
    getPatients(),
    getUpcomingAppointments(),
    getAllPendingFinancialEntries(),
    getPatientsDueForRecall(),
  ]);

  const today = new Date();

  const todayAppointments = upcomingAppointments.filter(
    (appointment: { date: Date }) =>
      isSameDay(appointment.date, today)
  );

  const pendingTotal = pendingFinancialEntries.reduce(
    (
      total: number,
      entry: { amount: number }
    ) => total + entry.amount,
    0
  );

  const overdueCount = pendingFinancialEntries.filter(
    (entry: { status: string }) =>
      entry.status === "Atrasado"
  ).length;

  return {
    patientCount,
    patientsWithoutAnamnesis,
    recentPatients: recentPatients.slice(0, 5),
    todayAppointments,
    pendingFinancialEntries: pendingFinancialEntries.slice(0, 5),
    pendingTotal,
    overdueCount,
    patientsDueForRecall: patientsDueForRecall.slice(0, 5),
    patientsDueForRecallCount: patientsDueForRecall.length,
  };
}
