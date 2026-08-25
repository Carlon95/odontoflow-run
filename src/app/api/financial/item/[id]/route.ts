import { NextRequest, NextResponse } from "next/server";

import {
  deleteFinancialEntry,
  markFinancialEntryAsPaid,
  markFinancialEntryAsUnpaid,
  updateFinancialEntry,
} from "@/src/features/patients/financial/services/server/financialEntryService";
import { requireUser } from "@/src/lib/api/authGuard";
import { financialEntrySchema } from "@/src/features/patients/financial/schemas/financialEntrySchema";
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
    financialEntrySchema
  );

  if (!parsed.data) return parsed.response;

  const entry = await updateFinancialEntry(id, {
    description: parsed.data.description,
    amount: parsed.data.amount,
    method: parsed.data.method || undefined,
    date: new Date(parsed.data.date),
  });

  return NextResponse.json(entry);
}

// Marca/desmarca como pago. Usamos PATCH com um corpo simples
// { paid: true|false, method? } — ação separada da edição normal.
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  const body = await request.json();

  const entry = body.paid
    ? await markFinancialEntryAsPaid(
        id,
        body.method || undefined
      )
    : await markFinancialEntryAsUnpaid(id);

  return NextResponse.json(entry);
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  await deleteFinancialEntry(id);

  return NextResponse.json({
    success: true,
  });
}
