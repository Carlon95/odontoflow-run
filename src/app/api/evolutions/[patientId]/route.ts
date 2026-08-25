import { NextRequest, NextResponse } from "next/server";

import * as evolutionService from "@/src/features/patients/evolutions/services/server/evolutionService";
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

  const evolutions =
    await evolutionService.getEvolutions(patientId);

  return NextResponse.json(evolutions);
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { patientId } = await params;

  const body = await request.json();

  const evolution =
    await evolutionService.createEvolution({
      patientId,
      content: body.content,
      sessionDate: body.sessionDate
        ? new Date(body.sessionDate)
        : undefined,
      nextSession: body.nextSession
        ? new Date(body.nextSession)
        : null,
    });

  return NextResponse.json(evolution);
}
