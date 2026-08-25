import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ListCardProps {
  children: ReactNode;
  className?: string;
}

export default function ListCard({
  children,
  className,
}: ListCardProps) {
  return (
    <div
      className={cn(
        `
        rounded-2xl
        border
        bg-card
        p-5
        shadow-sm
        transition-all
        duration-200

        hover:shadow-md
        hover:border-primary/20
        `,
        className
      )}
    >
      {children}
    </div>
  );
}