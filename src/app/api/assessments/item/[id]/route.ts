import { NextRequest, NextResponse } from "next/server";

import {
  deleteAssessment,
  updateAssessment,
} from "@/src/features/patients/assessments/services/server/assessmentService";
import { requireUser } from "@/src/lib/api/authGuard";

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

  const body = await request.json();

  const assessment =
    await updateAssessment(id, {
      type: body.type,
      description: body.description,
      date: new Date(body.date),
    });

  return NextResponse.json(assessment);
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  await deleteAssessment(id);

  return NextResponse.json({
    success: true,
  });
}
