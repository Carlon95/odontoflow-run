import { NextRequest, NextResponse } from "next/server";

import * as assessmentService from "@/src/features/patients/assessments/services/server/assessmentService";
import { requireUser } from "@/src/lib/api/authGuard";

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

  const assessments =
    await assessmentService.getAssessments(patientId);

  return NextResponse.json(assessments);
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { patientId } = await params;

  const body = await request.json();

  const assessment =
    await assessmentService.createAssessment({
      patientId,
      type: body.type,
      description: body.description,
      date: body.date
        ? new Date(body.date)
        : undefined,
    });

  return NextResponse.json(assessment);
}
