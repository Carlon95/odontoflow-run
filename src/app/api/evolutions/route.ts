import { NextResponse } from "next/server";

import { getAllEvolutions } from "@/src/features/patients/evolutions/services/server/evolutionService";
import { requireUser } from "@/src/lib/api/authGuard";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const evolutions = await getAllEvolutions();

  return NextResponse.json(evolutions);
}
