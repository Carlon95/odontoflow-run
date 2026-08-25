import { ReactNode } from "react";

interface FormActionsProps {
  children: ReactNode;
}

export default function FormActions({
  children,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6">
      {children}
    </div>
  );
}