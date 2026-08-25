import { NextRequest, NextResponse } from "next/server";

import * as financialEntryService from "@/src/features/patients/financial/services/server/financialEntryService";
import { requireUser } from "@/src/lib/api/authGuard";
import { financialEntrySchema } from "@/src/features/patients/financial/schemas/financialEntrySchema";
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

  const entries =
    await financialEntryService.getFinancialEntries(
      patientId
    );

  return NextResponse.json(entries);
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
    financialEntrySchema
  );

  if (!parsed.data) return parsed.response;

  const entry =
    await financialEntryService.createFinancialEntry({
      patientId,
      description: parsed.data.description,
      amount: parsed.data.amount,
      method: parsed.data.method || undefined,
      date: new Date(parsed.data.date),
    });

  return NextResponse.json(entry);
}
