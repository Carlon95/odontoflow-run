import { NextResponse } from "next/server";

import { deletePatientDocument } from "@/src/features/patients/documents/services/server/documentService";

import { requireUser } from "@/src/lib/api/authGuard";

interface Params {
  params: Promise<{
    id: string;
    docId: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { docId } = await params;

  try {
    await deletePatientDocument(docId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao excluir arquivo." },
      { status: 500 }
    );
  }
}
