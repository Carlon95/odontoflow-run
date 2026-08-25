import { prisma } from "@/src/lib/prisma";
import { withComputedStatus } from "../utils/computeStatus";

export async function findPaidSince(
  since: Date
) {
  return prisma.financialEntry.findMany({
    where: {
      status: "Pago",
      date: {
        gte: since,
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function findAll() {
  const entries =
    await prisma.financialEntry.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  return entries.map(withComputedStatus);
}

export async function findAllPending() {
  const entries =
    await prisma.financialEntry.findMany({
      where: {
        status: "Pendente",
      },
      orderBy: {
        date: "asc",
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  return entries.map(withComputedStatus);
}

export async function findByPatientId(
  patientId: string
) {
  const entries =
    await prisma.financialEntry.findMany({
      where: {
        patientId,
      },
      orderBy: {
        date: "desc",
      },
    });

  return entries.map(withComputedStatus);
}

export async function findById(
  id: string
) {
  const entry =
    await prisma.financialEntry.findUnique({
      where: {
        id,
      },
      include: {
        patient: true,
      },
    });

  return entry
    ? withComputedStatus(entry)
    : null;
}

export async function create(data: {
  patientId: string;
  description: string;
  amount: number;
  method?: string;
  date: Date;
  recurringChargeId?: string;
}) {
  return prisma.financialEntry.create({
    data: {
      patientId: data.patientId,
      description: data.description,
      amount: data.amount,
      status: "Pendente",
      method: data.method,
      date: data.date,
      recurringChargeId:
        data.recurringChargeId,
    },
  });
}

export async function update(
  id: string,
  data: {
    description: string;
    amount: number;
    method?: string;
    date: Date;
  }
) {
  return prisma.financialEntry.update({
    where: {
      id,
    },
    data: {
      description: data.description,
      amount: data.amount,
      method: data.method,
      date: data.date,
    },
  });
}

export async function markAsPaid(
  id: string,
  method?: string
) {
  return prisma.financialEntry.update({
    where: {
      id,
    },
    data: {
      status: "Pago",
      paidAt: new Date(),
      method,
    },
  });
}

export async function markAsUnpaid(
  id: string
) {
  return prisma.financialEntry.update({
    where: {
      id,
    },
    data: {
      status: "Pendente",
      paidAt: null,
    },
  });
}

export async function remove(
  id: string
) {
  return prisma.financialEntry.delete({
    where: {
      id,
    },
  });
}

export async function existsForRecurringChargeInMonth(
  recurringChargeId: string,
  monthStart: Date,
  monthEnd: Date
) {
  const entry =
    await prisma.financialEntry.findFirst({
      where: {
        recurringChargeId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

  return !!entry;
}
