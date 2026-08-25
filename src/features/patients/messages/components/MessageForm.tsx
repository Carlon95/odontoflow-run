"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClinicTextarea, SectionCard } from "@/src/clinic-ui";

import { sendMessage } from "../services/client/messageApi";

interface MessageFormProps {
  patientId: string;
  hasPhone: boolean;
  onSent: () => void;
}

export default function MessageForm({
  patientId,
  hasPhone,
  onSent,
}: MessageFormProps) {
  const [content, setContent] =
    useState("");

  const [isSending, setIsSending] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setIsSending(true);

      await sendMessage(
        patientId,
        content.trim()
      );

      toast.success(
        "Mensagem enviada pelo WhatsApp."
      );

      setContent("");
      onSent();

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao enviar mensagem."
      );

    } finally {

      setIsSending(false);

    }
  }

  return (
    <SectionCard
      title="Enviar Mensagem"
      description="A mensagem é enviada pelo WhatsApp para o telefone cadastrado. Só funciona se o paciente te mandou mensagem nas últimas 24h — é uma regra da própria Meta."
    >
      {!hasPhone ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Este paciente não tem telefone
          cadastrado. Adicione um telefone na
          ficha do paciente para poder enviar
          mensagens.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <ClinicTextarea
            rows={4}
            placeholder="Escreva a mensagem..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                isSending ||
                !content.trim()
              }
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending
                ? "Enviando..."
                : "Enviar pelo WhatsApp"}
            </Button>
          </div>
        </form>
      )}
    </SectionCard>
  );
}
