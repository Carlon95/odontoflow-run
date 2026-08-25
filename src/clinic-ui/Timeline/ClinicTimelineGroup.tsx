interface ClinicTimelineGroupProps {
  title: string;
  children: React.ReactNode;
}

export default function ClinicTimelineGroup({
  title,
  children,
}: ClinicTimelineGroupProps) {
  return (
    <section className="space-y-4">

      <div className="sticky top-0 z-10 bg-background py-2">

        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">

          {title}

        </h2>

      </div>

      <div className="space-y-4">

        {children}

      </div>

    </section>
  );
}