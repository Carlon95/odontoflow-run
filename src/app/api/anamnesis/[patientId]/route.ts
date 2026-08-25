import { NextResponse } from "next/server";

import {
  getAnamnesis,
  saveAnamnesis,
} from "@/src/features/patients/anamnese/services/server/anamnesisService";

import { requireUser } from "@/src/lib/api/authGuard";

interface RouteProps {
  params: Promise<{
    patientId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  try {

    const { patientId } =
      await params;

    const anamnesis =
      await getAnamnesis(patientId);

    return NextResponse.json(
      anamnesis
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Erro ao buscar anamnese.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteProps
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  try {

    const { patientId } =
      await params;

    const body =
      await request.json();

    const anamnesis =
      await saveAnamnesis({
        patientId,
        ...body,
      });

    return NextResponse.json(
      anamnesis
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Erro ao salvar anamnese.",
      },
      {
        status: 500,
      }
    );
  }
}