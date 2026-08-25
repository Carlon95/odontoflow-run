"use client";

import SearchToolbar from "@/src/clinic-ui/navigation/SearchToolbar";

interface PatientSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PatientSearch({
  value,
  onChange,
}: PatientSearchProps) {
  return (
    <SearchToolbar
      value={value}
      onChange={onChange}
      placeholder="Pesquisar pacientes..."
    />
  );
}