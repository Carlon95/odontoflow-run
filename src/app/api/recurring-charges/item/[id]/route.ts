import { NextRequest, NextResponse } from "next/server";

import {
  deleteRecurringCharge,
  toggleRecurringCharge,
  updateRecurringCharge,
} from "@/src/features/patients/financial/recurring/services/server/recurringChargeService";

import { requireUser } from "@/src/lib/api/authGuard";
import { recurringChargeSchema } from "@/src/features/patients/financial/recurring/schemas/recurringChargeSchema";
import { parseBody } from "@/src/lib/api/validate";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  const parsed = await parseBody(
    request,
    recurringChargeSchema
  );

  if (!parsed.data) return parsed.response;

  const charge = await updateRecurringCharge(
    id,
    parsed.data
  );

  return NextResponse.json(charge);
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  const body = await request.json();

  const charge = await toggleRecurringCharge(
    id,
    !!body.active
  );

  return NextResponse.json(charge);
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  await deleteRecurringCharge(id);

  return NextResponse.json({
    success: true,
  });
}
