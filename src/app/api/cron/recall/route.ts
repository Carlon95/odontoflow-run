import { NextRequest, NextResponse } from "next/server";

import { sendAllPendingRecalls } from "@/src/features/recall/services/server/recallService";

export async function GET(
  request: NextRequest
) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error(
      "CRON_SECRET não configurada — endpoint de retorno recusando executar."
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
    const result = await sendAllPendingRecalls();

    return NextResponse.json(result);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Erro ao processar lembretes de retorno.",
      },
      { status: 500 }
    );

  }
}
