import { redirect } from "next/navigation";

import { getCurrentUser } from "./getCurrentUser";

/**
 * Defesa em profundidade: mesmo com o proxy.ts barrando o acesso
 * a rotas não-públicas, cada página protegida também confirma a
 * autenticação por conta própria no carregamento de dados do
 * servidor. Isso segue a recomendação oficial do Next.js após o
 * CVE-2026-64642 (bypass de Middleware/Proxy) — nunca depender
 * apenas do middleware para autorização.
 */
export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdminUser() {
  const user =
    await requireAuthenticatedUser();

  if (user.role !== "Admin") {
    redirect("/");
  }

  return user;
}
