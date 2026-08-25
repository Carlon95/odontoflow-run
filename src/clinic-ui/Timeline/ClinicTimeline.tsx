import { ReactNode } from "react";

interface ClinicTimelineProps {
  children: ReactNode;
}

export default function ClinicTimeline({
  children,
}: ClinicTimelineProps) {
  return (
    <div className="space-y-5">
      {children}
    </div>
  );
}