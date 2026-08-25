"use client";

import { useCallback, useEffect, useState } from "react";

import { getMessages } from "../services/client/messageApi";
import { Message } from "../types/message";

import MessageForm from "./MessageForm";
import MessageList from "./MessageList";

interface MessagesTabProps {
  patientId: string;
  hasPhone: boolean;
}

export default function MessagesTab({
  patientId,
  hasPhone,
}: MessagesTabProps) {
  const [messages, setMessages] = useState<
    Message[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getMessages(
        patientId
      );

      setMessages(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }, [patientId]);

  useEffect(() => {
    // Busca única ao montar — padrão intencional de "carregar
    // dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <MessageForm
        patientId={patientId}
        hasPhone={hasPhone}
        onSent={load}
      />

      <MessageList
        messages={messages}
        loading={loading}
      />
    </div>
  );
}
