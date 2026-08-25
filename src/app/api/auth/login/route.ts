import { NextRequest, NextResponse } from "next/server";

import { login } from "@/src/features/auth/services/server/authService";
import { loginSchema } from "@/src/features/auth/schemas/authSchema";
import { parseBody } from "@/src/lib/api/validate";

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/src/features/auth/services/server/sessionService";

export async function POST(
  request: NextRequest
) {
  const parsed = await parseBody(
    request,
    loginSchema
  );

  if (!parsed.data) return parsed.response;

  const { email, password } = parsed.data;

  const result = await login(
    email,
    password
  );

  if (!result.success) {
    if (result.reason === "locked") {
      const minutesLeft = Math.ceil(
        (result.lockedUntil.getTime() -
          Date.now()) /
          60000
      );

      return NextResponse.json(
        {
          message: `Muitas tentativas incorretas. Tente novamente em ${minutesLeft} minuto${minutesLeft === 1 ? "" : "s"}, ou redefina sua senha.`,
          reason: "locked",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        message:
          "E-mail ou senha inválidos.",
        reason: "invalid",
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role,
  });

  response.cookies.set(
    SESSION_COOKIE_NAME,
    result.token,
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

  return response;
}
