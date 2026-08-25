"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard } from "@/src/clinic-ui";

interface RevenueChartProps {
  data: {
    label: string;
    total: number;
  }[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function RevenueChart({
  data,
}: RevenueChartProps) {
  return (
    <SectionCard
      title="Receita por Mês"
      description="Valores efetivamente recebidos, últimos meses."
    >
      <div className="h-72 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="var(--muted-foreground)"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="var(--muted-foreground)"
              tickFormatter={(value) =>
                formatCurrency(value)
              }
              width={80}
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value))
              }
              contentStyle={{
                borderRadius: 8,
                borderColor: "var(--border)",
                fontSize: 13,
              }}
            />

            <Bar
              dataKey="total"
              fill="var(--primary)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
