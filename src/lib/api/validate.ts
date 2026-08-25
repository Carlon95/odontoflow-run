import { NextResponse } from "next/server";
import { ZodType } from "zod";

type ParseResult<T> =
  | { data: T; response: null }
  | { data: null; response: NextResponse };

export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>
): Promise<ParseResult<T>> {
  let json: unknown;

  try {
    json = await request.json();

  } catch {

    return {
      data: null,
      response: NextResponse.json(
        {
          message:
            "Corpo da requisição inválido.",
        },
        { status: 400 }
      ),
    };

  }

  const result = schema.safeParse(json);

  if (!result.success) {
    const firstIssue =
      result.error.issues[0];

    return {
      data: null,
      response: NextResponse.json(
        {
          message:
            firstIssue?.message ??
            "Dados inválidos.",
        },
        { status: 400 }
      ),
    };
  }

  return {
    data: result.data,
    response: null,
  };
}
