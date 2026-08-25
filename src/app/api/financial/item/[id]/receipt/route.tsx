import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { getFinancialEntry } from "@/src/features/patients/financial/services/server/financialEntryService";
import { requireUser } from "@/src/lib/api/authGuard";

import ReceiptDocument from "@/src/features/patients/financial/components/ReceiptDocument";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const auth = await requireUser();
  if (!auth.user) return auth.response;

  const { id } = await params;

  const entry = await getFinancialEntry(id) as
    | {
        id: string;
        description: string;
        amount: number;
        status: string;
        method: string | null;
        paidAt: Date | null;
        date: Date;
        patient: { name: string };
      }
    | null;

  if (!entry) {
    return NextResponse.json(
      { message: "Lançamento não encontrado." },
      { status: 404 }
    );
  }

  if (entry.status !== "Pago") {
    return NextResponse.json(
      {
        message:
          "Só é possível gerar recibo de lançamentos já pagos.",
      },
      { status: 400 }
    );
  }

  const paidAtDate =
    entry.paidAt ?? entry.date;

  const buffer = await renderToBuffer(
    <ReceiptDocument
      clinicName={auth.user.name}
      patientName={entry.patient.name}
      description={entry.description}
      amount={formatCurrency(entry.amount)}
      paidAt={paidAtDate.toLocaleDateString(
        "pt-BR"
      )}
      method={entry.method ?? "Não informado"}
      receiptNumber={entry.id
        .slice(-8)
        .toUpperCase()}
    />
  );

  return new NextResponse(
    new Uint8Array(buffer),
    {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="recibo-${entry.id.slice(-8)}.pdf"`,
      },
    }
  );
}
