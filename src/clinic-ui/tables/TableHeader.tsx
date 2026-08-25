import { ReactNode } from "react";

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function TableHeader({
  children,
  className = "",
}: TableHeaderProps) {
  return (
    <th
      className={`px-6 py-3 text-left text-sm font-semibold ${className}`}
    >
      {children}
    </th>
  );
}