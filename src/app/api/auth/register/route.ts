import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/src/features/auth/services/server/getCurrentUser";
import {
  hasAnyUser,
  registerUser,
} from "@/src/features/auth/services/server/authService";

import { registerSchema } from "@/src/features/auth/schemas/authSchema";
import { parseBody } from "@/src/lib/api/validate";

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  createSessionToken,
} from "@/src/features/auth/services/server/sessionService";

// Informa ao front-end se ainda é possível fazer o cadastro
// inicial (nenhum usuário existe no banco ainda).
export async function GET() {
  const setupRequired = !(await hasAnyUser());

  return NextResponse.json({
    setupRequired,
  });
}

export async function POST(
  request: NextRequest
) {
  const setupRequired = !(await hasAnyUser());

  // Se já existe algum usuário cadastrado, só um administrador
  // já logado pode criar novas contas (evita qualquer pessoa
  // logada — inclusive dentistas — cadastrando outras contas).
  if (!setupRequired) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    if (currentUser.role !== "Admin") {
      return NextResponse.json(
        {
          message:
            "Apenas administradores podem cadastrar novos usuários.",
        },
        { status: 403 }
      );
    }
  }

  const parsed = await parseBody(
    request,
    registerSchema
  );

  if (!parsed.data) return parsed.response;

  const body = parsed.data;

  try {
    const user = await registerUser({
      name: body.name,
      email: body.email,
      password: body.password,
      // No cadastro inicial (bootstrap), a primeira conta
      // sempre vira Admin, independente do que for enviado.
      role: setupRequired
        ? "Admin"
        : body.role,
    });

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // No cadastro inicial, já loga automaticamente a pessoa
    // (evita um passo extra de ter que logar em seguida).
    if (setupRequired) {
      const token = await createSessionToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      response.cookies.set(
        SESSION_COOKIE_NAME,
        token,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite: "lax",
          path: "/",
          maxAge: SESSION_MAX_AGE,
        }
      );
    }

    return response;

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao criar usuário.";

    return NextResponse.json(
      { message },
      { status: 400 }
    );

  }
}
