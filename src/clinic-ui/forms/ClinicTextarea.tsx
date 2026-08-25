import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

type ClinicTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function ClinicTextarea({
  className,
  ...props
}: ClinicTextareaProps) {
  return (
    <Textarea
      className={cn(
        "min-h-32 resize-y",
        className
      )}
      {...props}
    />
  );
}