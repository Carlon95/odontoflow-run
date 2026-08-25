import { ReactNode } from "react";

interface DataTableProps {
  columns: ReactNode;
  children: ReactNode;
}

export default function DataTable({
  columns,
  children,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
      <table className="w-full min-w-[640px]">
        <thead className="bg-muted/40">
          {columns}
        </thead>

        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}