import {
  editProcedure,
  deleteProcedure,
} from "@/src/features/procedures/services/server/procedureService";

import {
  success,
  failure,
} from "@/src/lib/api/response";

import { requireUser } from "@/src/lib/api/authGuard";
import { procedureSchema } from "@/src/features/procedures/schemas/procedureSchema";
import { parseBody } from "@/src/lib/api/validate";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  { params }: Params
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  const parsed = await parseBody(request, procedureSchema);

  if (!parsed.data) return parsed.response;

  try {
    const procedure = await editProcedure(id, parsed.data);

    return success(procedure);
  } catch (error) {
    console.error(error);

    return failure("Erro ao atualizar procedimento.");
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  try {
    await deleteProcedure(id);

    return success({ success: true });
  } catch (error) {
    console.error(error);

    return failure("Erro ao remover procedimento.");
  }
}
