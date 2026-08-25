import { ReactNode } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";



interface ClinicCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function ClinicCard({
  title,
  subtitle,
  children,
  className,
}: ClinicCardProps) {
  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardContent className="p-6">

        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}

      </CardContent>
    </Card>
  );
}