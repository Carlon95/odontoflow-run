import { ReactNode } from "react";

interface PatientInfoItemProps {
  label: string;
  value: ReactNode;
}

export default function PatientInfoItem({
  label,
  value,
}: PatientInfoItemProps) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">

      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <div className="font-medium">
        {value}
      </div>

    </div>
  );
}