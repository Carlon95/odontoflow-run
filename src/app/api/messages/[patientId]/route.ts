import { NextRequest, NextResponse } from "next/server";

import {
  getMessages,
  sendFreeMessage,
} from "@/src/features/patients/messages/services/server/messageService";

import { requireUser } from "@/src/lib/api/authGuard";

interface RouteContext {
  params: Promise<{
    patientId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { patientId } = await params;

  const messages = await getMessages(
    patientId
  );

  return NextResponse.json(messages);
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { patientId } = await params;

  const body = await request.json();

  if (
    !body.content ||
    typeof body.content !== "string" ||
    !body.content.trim()
  ) {
    return NextResponse.json(
      {
        message:
          "Escreva uma mensagem antes de enviar.",
      },
      { status: 400 }
    );
  }

  try {
    const message = await sendFreeMessage(
      patientId,
      body.content.trim()
    );

    return NextResponse.json(message);

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao enviar mensagem.";

    return NextResponse.json(
      { message },
      { status: 400 }
    );

  }
}
