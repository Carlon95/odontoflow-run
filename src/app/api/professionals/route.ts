import { NextResponse } from "next/server";

import { findAll } from "@/src/features/auth/repositories/userRepository";
import { requireUser } from "@/src/lib/api/authGuard";

// Lista enxuta de profissionais (id, nome, papel, especialidade) para
// popular selects de "dentista responsável" na agenda e em outras
// telas. Diferente de /api/team, qualquer usuário autenticado pode
// ler — não expõe e-mail nem exige papel de Admin.
export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const users = await findAll();

  return NextResponse.json(
    users.map((user: {
      id: string;
      name: string;
      role: string;
      specialty: string | null;
    }) => ({
      id: user.id,
      name: user.name,
      role: user.role,
      specialty: user.specialty,
    }))
  );
}
