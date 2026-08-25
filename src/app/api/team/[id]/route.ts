import { NextRequest, NextResponse } from "next/server";

import {
  removeMember,
  updateMemberRole,
} from "@/src/features/auth/services/server/teamService";

import { requireAdmin } from "@/src/lib/api/authGuard";

const VALID_ROLES = ["Admin", "Dentista"];

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;

  const { id } = await params;

  const body = await request.json();

  if (!VALID_ROLES.includes(body.role)) {
    return NextResponse.json(
      { message: "Papel inválido." },
      { status: 400 }
    );
  }

  try {
    const member = await updateMemberRole(
      id,
      body.role,
      auth.user.id
    );

    return NextResponse.json({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao atualizar usuário.";

    return NextResponse.json(
      { message },
      { status: 400 }
    );

  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;

  const { id } = await params;

  try {
    await removeMember(id, auth.user.id);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Erro ao remover usuário.";

    return NextResponse.json(
      { message },
      { status: 400 }
    );

  }
}
