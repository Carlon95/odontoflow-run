import {
  getProcedures,
  createProcedure,
} from "@/src/features/procedures/services/server/procedureService";

import {
  success,
  failure,
} from "@/src/lib/api/response";

import { requireUser } from "@/src/lib/api/authGuard";
import { procedureSchema } from "@/src/features/procedures/schemas/procedureSchema";
import { parseBody } from "@/src/lib/api/validate";

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  try {
    const procedures = await getProcedures();

    return success(procedures);
  } catch (error) {
    console.error(error);

    return failure("Erro ao buscar procedimentos.");
  }
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const parsed = await parseBody(request, procedureSchema);

  if (!parsed.data) return parsed.response;

  try {
    const procedure = await createProcedure(parsed.data);

    return success(procedure, 201);
  } catch (error) {
    console.error(error);

    return failure("Erro ao cadastrar procedimento.");
  }
}
