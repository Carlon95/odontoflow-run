import { NextRequest, NextResponse } from "next/server";

import { sendPendingReminders } from "@/src/features/patients/messages/services/server/reminderService";

export async function GET(
  request: NextRequest
) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error(
      "CRON_SECRET não configurada — endpoint de lembretes recusando executar."
    );

    return NextResponse.json(
      {
        message:
          "CRON_SECRET não configurada no servidor.",
      },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get(
    "authorization"
  );

  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { message: "Não autorizado." },
      { status: 401 }
    );
  }

  try {
    const result =
      await sendPendingReminders();

    return NextResponse.json(result);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Erro ao processar lembretes.",
      },
      { status: 500 }
    );

  }
}
