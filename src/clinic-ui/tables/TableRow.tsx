import { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
}

export default function TableRow({
  children,
}: TableRowProps) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/30">
      {children}
    </tr>
  );
}