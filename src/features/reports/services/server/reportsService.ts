import { getPaidEntriesSince, getAllPendingFinancialEntries } from "@/src/features/patients/financial/services/server/financialEntryService";
import { getAppointmentCountsByStatus } from "@/src/features/patients/agenda/services/server/appointmentService";
import {
  getPatientCount,
  getPatientsByStatusCount,
  getNewPatientsCount,
} from "@/src/features/patients/services/server/patientService";

export type ReportPeriod =
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "this-year"
  | "all-time";

function getPeriodRange(
  period: ReportPeriod
): { start: Date; end: Date } {
  const now = new Date();

  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  switch (period) {
    case "this-month":
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        ),
        end,
      };

    case "last-month":
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        ),
        end: new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59
        ),
      };

    case "last-3-months":
      return {
        start: new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          1
        ),
        end,
      };

    case "this-year":
      return {
        start: new Date(
          now.getFullYear(),
          0,
          1
        ),
        end,
      };

    case "all-time":
      return {
        start: new Date(2000, 0, 1),
        end,
      };
  }
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  });
}

function buildMonthlyRevenue(
  paidEntries: { date: Date; amount: number }[],
  monthsBack: number
) {
  const now = new Date();

  const months: {
    key: string;
    label: string;
    total: number;
  }[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      key: monthKey(date),
      label: monthLabel(date),
      total: 0,
    });
  }

  for (const entry of paidEntries) {
    const key = monthKey(entry.date);

    const bucket = months.find(
      (month) => month.key === key
    );

    if (bucket) {
      bucket.total += entry.amount;
    }
  }

  return months;
}

export async function getReportsData(
  period: ReportPeriod
) {
  const { start, end } =
    getPeriodRange(period);

  const twelveMonthsAgo = new Date(
    start.getFullYear(),
    start.getMonth() - 11,
    1
  );

  const [
    paidEntries,
    pendingEntries,
    appointmentCounts,
    patientStatusCounts,
    totalPatients,
    newPatients,
  ] = await Promise.all([
    getPaidEntriesSince(twelveMonthsAgo),
    getAllPendingFinancialEntries(),
    getAppointmentCountsByStatus(start, end),
    getPatientsByStatusCount(),
    getPatientCount(),
    getNewPatientsCount(start, end),
  ]);

  const totalReceived = paidEntries
    .filter(
      (entry: { date: Date }) =>
        entry.date >= start &&
        entry.date <= end
    )
    .reduce(
      (
        total: number,
        entry: { amount: number }
      ) => total + entry.amount,
      0
    );

  const totalPending = pendingEntries
    .filter(
      (entry: { status: string }) =>
        entry.status === "Pendente"
    )
    .reduce(
      (
        total: number,
        entry: { amount: number }
      ) => total + entry.amount,
      0
    );

  const totalOverdue = pendingEntries
    .filter(
      (entry: { status: string }) =>
        entry.status === "Atrasado"
    )
    .reduce(
      (
        total: number,
        entry: { amount: number }
      ) => total + entry.amount,
      0
    );

  const monthlyRevenue = buildMonthlyRevenue(
    paidEntries,
    period === "this-year" ? 12 : 6
  );

  const appointmentsByStatus = {
    Agendada: 0,
    Realizada: 0,
    Cancelada: 0,
  } as Record<string, number>;

  for (const group of appointmentCounts as {
    status: string;
    _count: number;
  }[]) {
    appointmentsByStatus[group.status] =
      group._count;
  }

  const patientsByStatus = (
    patientStatusCounts as {
      status: string;
      _count: number;
    }[]
  ).map((group) => ({
    status: group.status,
    count: group._count,
  }));

  return {
    period,
    range: { start, end },
    financial: {
      totalReceived,
      totalPending,
      totalOverdue,
      monthlyRevenue,
    },
    operational: {
      appointmentsByStatus,
      totalPatients,
      newPatients,
      patientsByStatus,
    },
  };
}
