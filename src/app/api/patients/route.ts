import { NextResponse } from "next/server";

import {
  getPatients,
  savePatient,
} from "@/src/features/patients/services/server/patientService";

import {
  success,
  failure,
} from "@/src/lib/api/response";

import { requireUser } from "@/src/lib/api/authGuard";
import { patientSchema } from "@/src/features/patients/schemas/patientSchema";
import { parseBody } from "@/src/lib/api/validate";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  try {
    const patients = await getPatients();

    return success(patients);
  } catch (error) {
    console.error(error);

    return failure("Erro ao buscar pacientes.");
  }
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const parsed = await parseBody(
    request,
    patientSchema
  );

  if (!parsed.data) return parsed.response;

  try {
    const patient = await savePatient(
      parsed.data
    );

    return success(patient, 201);
  } catch (error) {
    console.error(error);

    return failure("Erro ao cadastrar paciente.");
  }
}
