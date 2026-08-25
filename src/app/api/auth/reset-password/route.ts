import { NextRequest, NextResponse } from "next/server";

import { resetPassword } from "@/src/features/auth/services/server/authService";

export async function POST(
  request: NextRequest
) {
  const body = await request.json();

  const { token, password } = body;

  if (!token || !password) {
    return NextResponse.json(
      {
        message:
          "Dados incompletos para redefinir a senha.",
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      {
        message:
          "A senha deve ter pelo menos 8 caracteres.",
      },
      { status: 400 }
    );
  }

  try {
    await resetPassword(token, password);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao redefinir senha.";

    return NextResponse.json(
      { message },
      { status: 400 }
    );

  }
}
