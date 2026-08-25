import { NextResponse } from "next/server";

import { getPatientsDueForRecall } from "@/src/features/recall/services/server/recallService";

import { requireUser } from "@/src/lib/api/authGuard";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  try {
    const patients = await getPatientsDueForRecall();

    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Erro ao buscar pacientes para retorno.",
      },
      { status: 500 }
    );
  }
}
