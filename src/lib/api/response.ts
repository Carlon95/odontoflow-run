import { NextResponse } from "next/server";

export function success(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function failure(
  message = "Erro interno do servidor.",
  status = 500
) {
  return NextResponse.json(
    { message },
    { status }
  );
}