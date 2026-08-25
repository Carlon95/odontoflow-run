import { NextRequest, NextResponse } from "next/server";

import {
  deleteAppointment,
  updateAppointment,
} from "@/src/features/patients/agenda/services/server/appointmentService";
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

  const appointment = await updateAppointment(
    id,
    {
      professionalId: body.professionalId || undefined,
      procedureId: body.procedureId || undefined,
      date: new Date(body.date),
      duration: Number(body.duration),
      status: body.status,
      notes: body.notes || undefined,
    }
  );

  return NextResponse.json(appointment);
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  await deleteAppointment(id);

  return NextResponse.json({
    success: true,
  });
}
