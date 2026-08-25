import { ReactNode } from "react";

interface SectionGridProps {
  children: ReactNode;
}

export default function SectionGrid({
  children,
}: SectionGridProps) {
  return (
    <div className="grid gap-6">
      {children}
    </div>
  );
}