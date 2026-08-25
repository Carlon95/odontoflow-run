import { NextRequest, NextResponse } from "next/server";

import {
  getReportsData,
  ReportPeriod,
} from "@/src/features/reports/services/server/reportsService";

import { requireUser } from "@/src/lib/api/authGuard";

const VALID_PERIODS: ReportPeriod[] = [
  "this-month",
  "last-month",
  "last-3-months",
  "this-year",
  "all-time",
];

export async function GET(
  request: NextRequest
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { searchParams } =
    new URL(request.url);

  const periodParam =
    searchParams.get("period");

  const period: ReportPeriod =
    VALID_PERIODS.includes(
      periodParam as ReportPeriod
    )
      ? (periodParam as ReportPeriod)
      : "this-month";

  const data = await getReportsData(period);

  return NextResponse.json(data);
}
