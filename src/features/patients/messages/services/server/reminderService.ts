import {
  getAppointmentsNeedingReminder,
  markAppointmentReminderSent,
} from "@/src/features/patients/agenda/services/server/appointmentService";

import { create as createMessage } from "../../repositories/messageRepository";
import { sendWhatsAppTemplate } from "@/src/lib/whatsapp";

const TEMPLATE_NAME =
  process.env.WHATSAPP_REMINDER_TEMPLATE_NAME ??
  "lembrete_consulta";

const TEMPLATE_LANG =
  process.env.WHATSAPP_REMINDER_TEMPLATE_LANG ??
  "pt_BR";

function formatDateTime(date: Date) {
  const formattedDate =
    date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });

  const formattedTime =
    date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return `${formattedDate}, às ${formattedTime}`;
}

function buildReminderPreview(
  patientName: string,
  date: Date
) {
  // Só para exibir no histórico dentro do sistema — o texto
  // que de fato chega ao paciente é controlado pelo template
  // aprovado na Meta, não por esta string.
  return `Olá, ${patientName}! Passando para lembrar da sua consulta ${formatDateTime(date)}. Até lá!`;
}

export async function sendPendingReminders() {
  const now = new Date();

  // Janela de 23h a 25h à frente — cobre consultas "amanhã por
  // volta desse horário", com folga pra o cron não rodar no
  // segundo exato certo.
  const windowStart = new Date(
    now.getTime() + 23 * 60 * 60 * 1000
  );

  const windowEnd = new Date(
    now.getTime() + 25 * 60 * 60 * 1000
  );

  const appointments =
    await getAppointmentsNeedingReminder(
      windowStart,
      windowEnd
    );

  let sent = 0;
  let failed = 0;

  for (const appointment of appointments as {
    id: string;
    patientId: string;
    date: Date;
    patient: {
      name: string;
      phone: string | null;
    };
  }[]) {
    if (!appointment.patient.phone) continue;

    const content = buildReminderPreview(
      appointment.patient.name,
      appointment.date
    );

    try {
      await sendWhatsAppTemplate({
        to: appointment.patient.phone,
        templateName: TEMPLATE_NAME,
        languageCode: TEMPLATE_LANG,
        bodyParams: [
          appointment.patient.name,
          formatDateTime(appointment.date),
        ],
      });

      await createMessage({
        patientId: appointment.patientId,
        type: "LembreteConsulta",
        content,
        status: "Enviado",
      });

      await markAppointmentReminderSent(
        appointment.id
      );

      sent++;

    } catch (error) {

      await createMessage({
        patientId: appointment.patientId,
        type: "LembreteConsulta",
        content,
        status: "Falhou",
        errorMessage:
          error instanceof Error
            ? error.message
            : "Erro desconhecido.",
      });

      // Marca como enviado mesmo em falha, pra não ficar
      // tentando de novo a cada execução do cron até a consulta
      // passar — evita spam de tentativa e erro.
      await markAppointmentReminderSent(
        appointment.id
      );

      failed++;

    }
  }

  return { sent, failed, total: appointments.length };
}
