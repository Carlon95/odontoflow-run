export type MessageType =
  | "Livre"
  | "LembreteConsulta"
  | "LembreteRetorno";

export type MessageStatus =
  | "Enviado"
  | "Falhou";

export interface Message {
  id: string;
  patientId: string;

  type: MessageType;
  content: string;
  status: MessageStatus;
  errorMessage?: string | null;

  createdAt: string;
}
