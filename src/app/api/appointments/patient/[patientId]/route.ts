import { NextRequest, NextResponse } from "next/server";

import { getAppointmentsByPatient } from "@/src/features/patients/agenda/services/server/appointmentService";
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

  const appointments =
    await getAppointmentsByPatient(patientId);

  return NextResponse.json(appointments);
}
