import { ReactNode } from "react";
import { ClinicCard } from "@/components/clinic";

interface InfoCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function InfoCard({
  title,
  subtitle,
  children,
}: InfoCardProps) {
  return (
    <ClinicCard
      title={title}
      subtitle={subtitle}
    >
      {children}
    </ClinicCard>
  );
}