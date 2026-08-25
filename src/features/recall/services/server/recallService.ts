import { prisma } from "@/src/lib/prisma";

import { create as createMessage } from "@/src/features/patients/messages/repositories/messageRepository";
import { sendWhatsAppTemplate } from "@/src/lib/whatsapp";

// Depois de quantos meses sem uma consulta "Realizada" o paciente
// entra na lista de retorno. Configurável por variável de ambiente
// para clínicas que preferem um intervalo diferente (ortodontia,
// por exemplo, costuma usar prazos mais curtos).
const RECALL_INTERVAL_MONTHS = Number(
  process.env.RECALL_INTERVAL_MONTHS ?? 6
);

// Não manda lembrete de novo pro mesmo paciente antes desse
// número de dias, mesmo que o cron rode todo dia — evita spam.
const RECALL_COOLDOWN_DAYS = 30;

const TEMPLATE_NAME =
  process.env.WHATSAPP_RECALL_TEMPLATE_NAME ??
  "lembrete_retorno";

const TEMPLATE_LANG =
  process.env.WHATSAPP_REMINDER_TEMPLATE_LANG ??
  "pt_BR";

export interface PatientDueForRecall {
  id: string;
  name: string;
  phone: string | null;
  lastVisitDate: Date;
  monthsSinceLastVisit: number;
}

export async function getPatientsDueForRecall(): Promise<
  PatientDueForRecall[]
> {
  const patients = await prisma.patient.findMany({
    where: {
      receiveReminders: true,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      lastRecallSentAt: true,
      appointments: {
        select: {
          date: true,
          status: true,
        },
      },
    },
  });

  const now = new Date();

  const cutoff = new Date(now);
  cutoff.setMonth(
    cutoff.getMonth() - RECALL_INTERVAL_MONTHS
  );

  const result: PatientDueForRecall[] = [];

  type AppointmentInfo = {
    date: Date;
    status: string;
  };

  for (const patient of patients) {
    const completedVisits = patient.appointments.filter(
      (a: AppointmentInfo) => a.status === "Realizada"
    );

    // Paciente nunca veio de fato — isso é "primeira consulta
    // pendente", não "retorno".
    if (completedVisits.length === 0) continue;

    const lastVisitDate = completedVisits.reduce(
      (latest: Date, a: AppointmentInfo) =>
        a.date > latest ? a.date : latest,
      completedVisits[0].date
    );

    // Ainda dentro do prazo, não precisa de lembrete.
    if (lastVisitDate > cutoff) continue;

    const hasFutureAppointment = patient.appointments.some(
      (a: AppointmentInfo) =>
        a.status === "Agendada" && a.date > now
    );

    // Já tem retorno marcado — não precisa cutucar.
    if (hasFutureAppointment) continue;

    if (patient.lastRecallSentAt) {
      const cooldownEnd = new Date(
        patient.lastRecallSentAt
      );

      cooldownEnd.setDate(
        cooldownEnd.getDate() + RECALL_COOLDOWN_DAYS
      );

      if (now < cooldownEnd) continue;
    }

    const monthsSinceLastVisit = Math.floor(
      (now.getTime() - lastVisitDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30)
    );

    result.push({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      lastVisitDate,
      monthsSinceLastVisit,
    });
  }

  // Quem está há mais tempo sem voltar aparece primeiro.
  return result.sort(
    (a, b) =>
      a.lastVisitDate.getTime() -
      b.lastVisitDate.getTime()
  );
}

function buildRecallPreview(
  patientName: string,
  months: number
) {
  return `Olá, ${patientName}! Já faz ${months} meses da sua última consulta — que tal agendar seu retorno?`;
}

export async function sendRecallReminder(
  patientId: string
) {
  const patients = await getPatientsDueForRecall();

  const patient = patients.find(
    (p) => p.id === patientId
  );

  if (!patient) {
    throw new Error(
      "Paciente não está na lista de retorno no momento."
    );
  }

  if (!patient.phone) {
    throw new Error(
      "Paciente não tem telefone cadastrado."
    );
  }

  const content = buildRecallPreview(
    patient.name,
    patient.monthsSinceLastVisit
  );

  try {
    await sendWhatsAppTemplate({
      to: patient.phone,
      templateName: TEMPLATE_NAME,
      languageCode: TEMPLATE_LANG,
      bodyParams: [
        patient.name,
        String(patient.monthsSinceLastVisit),
      ],
    });

    await createMessage({
      patientId: patient.id,
      type: "LembreteRetorno",
      content,
      status: "Enviado",
    });

    await prisma.patient.update({
      where: { id: patient.id },
      data: { lastRecallSentAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    await createMessage({
      patientId: patient.id,
      type: "LembreteRetorno",
      content,
      status: "Falhou",
      errorMessage:
        error instanceof Error
          ? error.message
          : "Erro desconhecido.",
    });

    await prisma.patient.update({
      where: { id: patient.id },
      data: { lastRecallSentAt: new Date() },
    });

    throw error;
  }
}

export async function sendAllPendingRecalls() {
  const patients = await getPatientsDueForRecall();

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const patient of patients) {
    if (!patient.phone) {
      skipped++;
      continue;
    }

    try {
      await sendRecallReminder(patient.id);
      sent++;
    } catch (error) {
      console.error(error);
      failed++;
    }
  }

  return {
    sent,
    failed,
    skipped,
    total: patients.length,
  };
}
