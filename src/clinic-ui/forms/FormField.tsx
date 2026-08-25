import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id?: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({
  id,
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}

        {required && (
          <span className="ml-1 text-destructive">*</span>
        )}
      </Label>

      {children}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}