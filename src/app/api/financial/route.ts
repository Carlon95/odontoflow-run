import { NextResponse } from "next/server";

import { getAllFinancialEntries } from "@/src/features/patients/financial/services/server/financialEntryService";
import { requireUser } from "@/src/lib/api/authGuard";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const entries = await getAllFinancialEntries();

  return NextResponse.json(entries);
}
