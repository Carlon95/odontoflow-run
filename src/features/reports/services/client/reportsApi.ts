export interface ReportsData {
  period: string;
  range: {
    start: string;
    end: string;
  };
  financial: {
    totalReceived: number;
    totalPending: number;
    totalOverdue: number;
    monthlyRevenue: {
      key: string;
      label: string;
      total: number;
    }[];
  };
  operational: {
    appointmentsByStatus: Record<
      string,
      number
    >;
    totalPatients: number;
    newPatients: number;
    patientsByStatus: {
      status: string;
      count: number;
    }[];
  };
}

export async function getReportsData(
  period: string
) {
  const response = await fetch(
    `/api/reports?period=${period}`
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao carregar relatórios."
    );
  }

  return response.json() as Promise<ReportsData>;
}
