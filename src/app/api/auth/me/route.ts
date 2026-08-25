import { NextResponse } from "next/server";

import { getCurrentUser } from "@/src/features/auth/services/server/getCurrentUser";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Não autenticado." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
