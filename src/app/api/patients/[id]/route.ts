import { NextResponse } from "next/server";
import {
  editPatient,
  getPatientById,
} from "@/src/features/patients/services/server/patientService";

import {
  success,
  failure,
} from "@/src/lib/api/response";

import { requireUser } from "@/src/lib/api/authGuard";
import { patientSchema } from "@/src/features/patients/schemas/patientSchema";
import { parseBody } from "@/src/lib/api/validate";

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

  try {
    const { id } = await params;

    const patient = await getPatientById(id);

    if (!patient) {
      return failure(
        "Paciente não encontrado.",
        404
      );
    }

    return success(patient);
  } catch (error) {
    console.error(error);

    return failure();
  }
}


export async function PUT(
  request: Request,
  { params }: Params
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  const parsed = await parseBody(
    request,
    patientSchema
  );

  if (!parsed.data) return parsed.response;

  try {
    const patient = await editPatient(
      id,
      parsed.data
    );

    return success(patient);
  } catch (error) {
    console.error(error);

    return failure("Erro ao atualizar paciente.");
  }
}
