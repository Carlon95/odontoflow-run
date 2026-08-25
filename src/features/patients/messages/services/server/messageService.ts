import {
  create,
  findByPatientId,
} from "../../repositories/messageRepository";

import { findById } from "../../../repositories/patientRepository";
import { sendWhatsAppMessage } from "@/src/lib/whatsapp";

export async function getMessages(
  patientId: string
) {
  return findByPatientId(patientId);
}

export async function sendFreeMessage(
  patientId: string,
  content: string
) {
  const patient = await findById(patientId);

  if (!patient) {
    throw new Error(
      "Paciente não encontrado."
    );
  }

  if (!patient.phone) {
    throw new Error(
      "Este paciente não tem telefone cadastrado. Adicione um telefone antes de enviar mensagens."
    );
  }

  try {
    await sendWhatsAppMessage({
      to: patient.phone,
      body: content,
    });

    return create({
      patientId,
      type: "Livre",
      content,
      status: "Enviado",
    });

  } catch (error) {

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido.";

    await create({
      patientId,
      type: "Livre",
      content,
      status: "Falhou",
      errorMessage,
    });

    throw new Error(errorMessage);

  }
}
