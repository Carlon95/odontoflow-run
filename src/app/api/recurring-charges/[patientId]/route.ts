import { NextRequest, NextResponse } from "next/server";

import {
  createRecurringCharge,
  getRecurringCharges,
} from "@/src/features/patients/financial/recurring/services/server/recurringChargeService";

import { requireUser } from "@/src/lib/api/authGuard";
import { recurringChargeSchema } from "@/src/features/patients/financial/recurring/schemas/recurringChargeSchema";
import { parseBody } from "@/src/lib/api/validate";

interface RouteContext {
  params: Promise<{
    patientId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { patientId } = await params;

  const charges = await getRecurringCharges(
    patientId
  );

  return NextResponse.json(charges);
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { patientId } = await params;

  const parsed = await parseBody(
    request,
    recurringChargeSchema
  );

  if (!parsed.data) return parsed.response;

  const charge = await createRecurringCharge({
    patientId,
    description: parsed.data.description,
    amount: parsed.data.amount,
    dayOfMonth: parsed.data.dayOfMonth,
  });

  return NextResponse.json(charge);
}
