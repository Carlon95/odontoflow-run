import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatCardAccent =
  | "primary"
  | "cyan"
  | "amber"
  | "rose"
  | "muted";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;

  accent?: StatCardAccent;

  subtitle?: string;
  subtitleClassName?: string;

  footer?: string;

  progress?: number;
}

const ACCENT_CLASSES: Record<StatCardAccent, string> = {
  primary: "bg-primary/8 text-primary",
  cyan: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50/80 text-rose-700",
  muted: "bg-slate-50 text-slate-500",
};

export default function StatCard({
  title,
  value,
  icon,
  accent = "primary",
  subtitle,
  subtitleClassName,
  footer,
  progress,
}: StatCardProps) {
  return (
    <div className="shadow-elegant shadow-elegant-hover rounded-2xl border bg-card p-6 hover:-translate-y-0.5">

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            ACCENT_CLASSES[accent]
          )}
        >
          {icon}
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
      </div>

      <h3 className="font-heading mt-5 text-[1.75rem] font-bold leading-none tracking-tight tabular-nums">
        {value}
      </h3>

      {subtitle && (
        <p
          className={cn(
            "mt-2 text-sm font-medium",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}

      {progress !== undefined && (
        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {footer && (
        <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
          {footer}
        </p>
      )}
    </div>
  );
}
