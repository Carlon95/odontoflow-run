import { NextRequest, NextResponse } from "next/server";

import { requestPasswordReset } from "@/src/features/auth/services/server/authService";

export async function POST(
  request: NextRequest
) {
  const body = await request.json();

  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { message: "Informe o e-mail." },
      { status: 400 }
    );
  }

  try {
    await requestPasswordReset(email);

  } catch (error) {

    console.error(error);

    // Mesmo em erro interno, não damos detalhes — evita
    // vazar informação sobre a existência da conta.

  }

  // Resposta sempre genérica, exista ou não a conta com
  // esse e-mail.
  return NextResponse.json({
    message:
      "Se esse e-mail estiver cadastrado, enviamos um link de redefinição.",
  });
}
