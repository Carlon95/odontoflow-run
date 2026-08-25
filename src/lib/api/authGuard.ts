import { NextResponse } from "next/server";

import { getCurrentUser } from "@/src/features/auth/services/server/getCurrentUser";

/**
 * Defesa em profundidade: mesmo com o proxy.ts barrando rotas
 * não-públicas, cada rota de API também confirma a autenticação
 * por conta própria antes de tocar em qualquer dado. Segue a
 * recomendação oficial do Next.js após o CVE-2026-64642 (bypass
 * de Middleware/Proxy).
 *
 * Uso:
 *   const auth = await requireUser();
 *   if (!auth.user) return auth.response;
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      ),
    };
  }

  return { user, response: null };
}

export async function requireAdmin() {
  const { user, response } =
    await requireUser();

  if (!user) {
    return { user: null, response };
  }

  if (user.role !== "Admin") {
    return {
      user: null,
      response: NextResponse.json(
        {
          message:
            "Acesso restrito a administradores.",
        },
        { status: 403 }
      ),
    };
  }

  return { user, response: null };
}
