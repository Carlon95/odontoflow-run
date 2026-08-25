"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { SectionCard } from "@/src/clinic-ui";

interface PatientStatusChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  Novo: "#3b82f6",
  Anamnese: "#f97316",
  "Avaliação": "#a855f7",
  "Em Tratamento": "#22c55e",
  Alta: "#94a3b8",
};

export default function PatientStatusChart({
  data,
}: PatientStatusChartProps) {
  const hasData = data.some(
    (item) => item.count > 0
  );

  return (
    <SectionCard
      title="Pacientes por Status"
      description="Distribuição atual da carteira de pacientes."
    >
      {hasData ? (
        <div className="h-72 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={
                      STATUS_COLORS[
                        entry.status
                      ] ?? "#cbd5e1"
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "var(--border)",
                  fontSize: 13,
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Nenhum paciente cadastrado ainda.
        </p>
      )}
    </SectionCard>
  );
}
