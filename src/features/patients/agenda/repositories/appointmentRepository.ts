import { prisma } from "@/src/lib/prisma";

export async function countByStatusInRange(
  start: Date,
  end: Date
) {
  return prisma.appointment.groupBy({
    by: ["status"],
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    _count: true,
  });
}

export async function findByPatientId(
  patientId: string
) {
  return prisma.appointment.findMany({
    where: {
      patientId,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      professional: {
        select: {
          id: true,
          name: true,
        },
      },
      procedure: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findUpcoming() {
  return prisma.appointment.findMany({
    where: {
      date: {
        gte: new Date(),
      },
      status: {
        not: "Cancelada",
      },
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
      professional: {
        select: {
          id: true,
          name: true,
        },
      },
      procedure: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findAll() {
  return prisma.appointment.findMany({
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
      professional: {
        select: {
          id: true,
          name: true,
        },
      },
      procedure: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findById(
  id: string
) {
  return prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
        },
      },
      professional: {
        select: {
          id: true,
          name: true,
        },
      },
      procedure: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function create(data: {
  patientId: string;
  professionalId?: string | null;
  procedureId?: string | null;
  date: Date;
  duration?: number;
  status?: string;
  notes?: string;
}) {
  return prisma.appointment.create({
    data: {
      patientId: data.patientId,
      professionalId: data.professionalId || null,
      procedureId: data.procedureId || null,
      date: data.date,
      duration: data.duration ?? 30,
      status: data.status ?? "Agendada",
      notes: data.notes,
    },
  });
}

export async function update(
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
  return prisma.appointment.update({
    where: {
      id,
    },
    data: {
      professionalId: data.professionalId || null,
      procedureId: data.procedureId || null,
      date: data.date,
      duration: data.duration,
      status: data.status,
      notes: data.notes,
    },
  });
}

export async function remove(
  id: string
) {
  return prisma.appointment.delete({
    where: {
      id,
    },
  });
}

// ==============================
// Lembretes automáticos
// ==============================

export async function findNeedingReminder(
  windowStart: Date,
  windowEnd: Date
) {
  return prisma.appointment.findMany({
    where: {
      status: "Agendada",
      reminderSentAt: null,
      date: {
        gte: windowStart,
        lte: windowEnd,
      },
      patient: {
        receiveReminders: true,
        phone: {
          not: null,
        },
      },
    },
    include: {
      patient: true,
    },
  });
}

export async function markReminderSent(
  id: string
) {
  return prisma.appointment.update({
    where: {
      id,
    },
    data: {
      reminderSentAt: new Date(),
    },
  });
}
