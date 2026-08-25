import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PageSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function PageSection({
  title,
  description,
  children,
  actions,
}: PageSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>

          {description && (
            <CardDescription>
              {description}
            </CardDescription>
          )}
        </div>

        {actions && (
          <div>{actions}</div>
        )}
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}