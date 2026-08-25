import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export default function LoadingState({
  title = "Carregando...",
  description = "Aguarde alguns instantes.",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-10 text-center">

      <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>

    </div>
  );
}