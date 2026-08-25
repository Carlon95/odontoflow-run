import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}

export default function SectionCard({
  title,
  description,
  children,
  actions,
  footer,
}: SectionCardProps) {
  return (
    <section className="shadow-elegant rounded-2xl border bg-background">
      <header className="flex items-start justify-between border-b p-6 sm:p-7">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div>
            {actions}
          </div>
        )}
      </header>

      <div className="p-6 sm:p-7">
        {children}
      </div>

      {footer && (
        <footer className="border-t bg-muted/30 p-4">
          {footer}
        </footer>
      )}
    </section>
  );
}