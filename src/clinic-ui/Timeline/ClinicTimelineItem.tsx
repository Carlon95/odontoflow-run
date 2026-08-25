import { ReactNode } from "react";

interface ClinicTimelineItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ClinicTimelineItem({
  icon,
  title,
  subtitle,
  children,
  actions,
}: ClinicTimelineItemProps) {
  return (
    <div className="relative pl-10">

      <div className="absolute left-3 top-3 h-full w-px bg-border" />

      <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">

        {icon}

      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="truncate font-semibold">
              {title}
            </h3>

            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}

          </div>

          {actions}

        </div>

        <div className="mt-4">

          {children}

        </div>

      </div>

    </div>
  );
}