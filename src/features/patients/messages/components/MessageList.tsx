"use client";

import {
  MessageCircle,
  CalendarClock,
} from "lucide-react";

import {
  StatusBadge,
  LoadingState,
  EmptyState,
} from "@/src/clinic-ui";

import { Message } from "../types/message";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function MessageList({
  messages,
  loading,
}: MessageListProps) {
  if (loading) {
    return (
      <LoadingState
        title="Carregando mensagens..."
        description="Buscando o histórico de envios."
      />
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="Nenhuma mensagem enviada"
        description="As mensagens enviadas para este paciente aparecem aqui."
      />
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4"
        >
          <div className="flex min-w-0 items-start gap-3">
            {message.type ===
            "LembreteConsulta" ? (
              <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            )}

            <div className="min-w-0">
              <p className="text-sm">
                {message.content}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {message.type ===
                "LembreteConsulta"
                  ? "Lembrete automático"
                  : "Mensagem manual"}
                {" · "}
                {formatDateTime(
                  message.createdAt
                )}
              </p>

              {message.status ===
                "Falhou" &&
                message.errorMessage && (
                  <p className="mt-1 text-xs text-destructive">
                    {message.errorMessage}
                  </p>
                )}
            </div>
          </div>

          <StatusBadge
            status={message.status}
          />
        </div>
      ))}
    </div>
  );
}
