import { NextRequest, NextResponse } from "next/server";

import * as appointmentService from "@/src/features/patients/agenda/services/server/appointmentService";
import { requireUser } from "@/src/lib/api/authGuard";

export async function GET(
  request: NextRequest
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { searchParams } =
    new URL(request.url);

  const all =
    searchParams.get("all") === "true";

  const appointments = all
    ? await appointmentService.getAllAppointments()
    : await appointmentService.getUpcomingAppointments();

  return NextResponse.json(appointments);
}

export async function POST(
  request: NextRequest
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const body = await request.json();

  const appointment =
    await appointmentService.createAppointment({
      patientId: body.patientId,
      professionalId: body.professionalId || undefined,
      procedureId: body.procedureId || undefined,
      date: new Date(body.date),
      duration: body.duration
        ? Number(body.duration)
        : undefined,
      status: body.status,
      notes: body.notes || undefined,
    });

  return NextResponse.json(appointment);
}
