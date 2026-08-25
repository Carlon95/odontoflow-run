import { NextResponse } from "next/server";

import {
  getTreatmentPlan,
  saveTreatmentPlan,
} from "@/src/features/patients/treatment-plan/services/server/treatmentPlanService";

import { treatmentPlanSchema } from "@/src/features/patients/treatment-plan/schemas/treatmentPlanSchema";

import { requireUser } from "@/src/lib/api/authGuard";
import { parseBody } from "@/src/lib/api/validate";

interface RouteProps {
  params: Promise<{
    patientId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  try {

    const { patientId } =
      await params;

    const treatmentPlan =
      await getTreatmentPlan(patientId);

    return NextResponse.json(
      treatmentPlan
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Erro ao buscar plano de tratamento.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteProps
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  try {

    const { patientId } =
      await params;

    const parsed = await parseBody(
      request,
      treatmentPlanSchema
    );

    if (!parsed.data) return parsed.response;

    const treatmentPlan =
      await saveTreatmentPlan({
        ...parsed.data,
        patientId,
      });

    return NextResponse.json(
      treatmentPlan
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Erro ao salvar plano de tratamento.",
      },
      {
        status: 500,
      }
    );
  }
}
