import { NextRequest, NextResponse } from "next/server";

import {
  deleteEvolution,
  updateEvolution,
} from "@/src/features/patients/evolutions/services/server/evolutionService";
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

  const evolution =
    await updateEvolution(id, {
      content: body.content,
      sessionDate: new Date(body.sessionDate),
      nextSession: body.nextSession
        ? new Date(body.nextSession)
        : null,
    });

  return NextResponse.json(evolution);
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  await deleteEvolution(id);

  return NextResponse.json({
    success: true,
  });
}
