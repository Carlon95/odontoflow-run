import { NextResponse } from "next/server";

import { sendRecallReminder } from "@/src/features/recall/services/server/recallService";

import { requireUser } from "@/src/lib/api/authGuard";

interface Params {
  params: Promise<{
    patientId: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: Params
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { patientId } = await params;

  try {
    await sendRecallReminder(patientId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Erro ao enviar lembrete de retorno.",
      },
      { status: 500 }
    );
  }
}
