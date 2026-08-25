"use client";

import FinancialTab from "../../financial/components/FinancialTab";

interface FinanceTabProps {
  patientId: string;
}

export default function FinanceTab({
  patientId,
}: FinanceTabProps) {
  return (
    <FinancialTab
      patientId={patientId}
    />
  );
}
