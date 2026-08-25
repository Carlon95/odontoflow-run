import { NextResponse } from "next/server";

import { getTeamMembers } from "@/src/features/auth/services/server/teamService";
import { requireAdmin } from "@/src/lib/api/authGuard";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response;

  const members = await getTeamMembers();

  return NextResponse.json(
    members.map(
      (member: {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
      }) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        createdAt: member.createdAt,
      })
    )
  );
}
