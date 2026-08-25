"use client";

import FinancialSummary from "./FinancialSummary";
import FinancialEntryForm from "./FinancialEntryForm";
import FinancialEntryList from "./FinancialEntryList";

import RecurringChargesSection from "../recurring/components/RecurringChargesSection";

import { FinancialEntriesProvider } from "../context/FinancialEntriesContext";

interface FinancialTabProps {
  patientId: string;
}

export default function FinancialTab({
  patientId,
}: FinancialTabProps) {
  return (
    <FinancialEntriesProvider patientId={patientId}>
      <div className="space-y-6">

        <FinancialSummary />

        <FinancialEntryForm
          patientId={patientId}
        />

        <FinancialEntryList />

        <RecurringChargesSection
          patientId={patientId}
        />

      </div>
    </FinancialEntriesProvider>
  );
}
