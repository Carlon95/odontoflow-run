import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

type ClinicInputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export default function ClinicInput({
  className,
  ...props
}: ClinicInputProps) {
  return (
    <Input
      className={cn(className)}
      {...props}
    />
  );
}