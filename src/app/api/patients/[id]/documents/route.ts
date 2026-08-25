import { NextResponse } from "next/server";

import {
  getPatientDocuments,
  uploadPatientDocument,
  MAX_UPLOAD_SIZE_BYTES,
} from "@/src/features/patients/documents/services/server/documentService";

import { documentUploadSchema } from "@/src/features/patients/documents/schemas/documentSchema";

import { requireUser } from "@/src/lib/api/authGuard";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id: patientId } = await params;

  try {
    const documents = await getPatientDocuments(
      patientId
    );

    return NextResponse.json(documents);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao buscar arquivos." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: Params
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id: patientId } = await params;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        message:
          "Upload de arquivos não configurado. Conecte um Vercel Blob Store ao projeto (Storage → Create Database → Blob) e defina BLOB_READ_WRITE_TOKEN.",
      },
      { status: 501 }
    );
  }

  const formData = await request.formData();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Nenhum arquivo enviado." },
      { status: 400 }
    );
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json(
      {
        message: `Arquivo muito grande. O limite é ${Math.round(MAX_UPLOAD_SIZE_BYTES / 1024 / 1024)}MB.`,
      },
      { status: 413 }
    );
  }

  const parsed = documentUploadSchema.safeParse({
    name: formData.get("name") || file.name,
    category: formData.get("category") || "Documento",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados do arquivo inválidos." },
      { status: 400 }
    );
  }

  try {
    const document = await uploadPatientDocument({
      patientId,
      file,
      name: parsed.data.name,
      category: parsed.data.category,
      uploadedById: auth.user.id,
    });

    return NextResponse.json(document, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erro ao enviar arquivo." },
      { status: 500 }
    );
  }
}
