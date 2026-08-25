"use client";

import { cn } from "@/lib/utils";

// Notação FDI — dois quadrantes por arcada, exibidos como um
// dentista veria o paciente de frente (lado direito do paciente
// aparece à esquerda da tela).
const UPPER_ROW = [
  "18", "17", "16", "15", "14", "13", "12", "11",
  "21", "22", "23", "24", "25", "26", "27", "28",
];

const LOWER_ROW = [
  "48", "47", "46", "45", "44", "43", "42", "41",
  "31", "32", "33", "34", "35", "36", "37", "38",
];

export interface OdontogramToothState {
  toothNumber: string;
  status: string;
}

interface OdontogramProps {
  teeth?: OdontogramToothState[];
  selectedTooth?: string | null;
  onToothClick?: (toothNumber: string) => void;
  size?: "sm" | "md";
  className?: string;
}

// Quando um dente tem mais de um procedimento, mostramos o status
// "mais ativo" — em andamento chama mais atenção que já concluído,
// por exemplo.
const STATUS_PRIORITY: Record<string, number> = {
  "Em Andamento": 3,
  Planejado: 2,
  Concluído: 1,
  Cancelado: 0,
};

const STATUS_CLASSES: Record<string, string> = {
  Planejado:
    "bg-primary/8 border-primary/40 text-primary hover:bg-primary/12",
  "Em Andamento":
    "bg-amber-50/80 border-amber-300 text-amber-700 hover:bg-amber-50",
  Concluído:
    "bg-emerald-50/80 border-emerald-300 text-emerald-700 hover:bg-emerald-50",
  Cancelado:
    "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100",
};

const EMPTY_CLASSES =
  "bg-white border-slate-200/80 text-slate-400 font-medium hover:border-primary/30 hover:bg-primary/5";

function resolveToothState(
  toothNumber: string,
  teeth: OdontogramToothState[]
) {
  const matches = teeth.filter(
    (t) => t.toothNumber === toothNumber
  );

  if (matches.length === 0) return null;

  return matches.reduce((best, current) =>
    (STATUS_PRIORITY[current.status] ?? -1) >
    (STATUS_PRIORITY[best.status] ?? -1)
      ? current
      : best
  );
}

function ToothChip({
  toothNumber,
  state,
  selected,
  interactive,
  size,
  onClick,
  flip,
}: {
  toothNumber: string;
  state: OdontogramToothState | null;
  selected: boolean;
  interactive: boolean;
  size: "sm" | "md";
  onClick?: () => void;
  flip: boolean;
}) {
  const dimensions =
    size === "sm"
      ? "h-8 w-6 text-[10px]"
      : "h-10 w-8 text-xs";

  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={interactive ? onClick : undefined}
      title={
        state
          ? `Dente ${toothNumber} — ${state.status}`
          : `Dente ${toothNumber}`
      }
      className={cn(
        "flex shrink-0 items-center justify-center border font-semibold transition-colors",
        flip ? "rounded-b-lg" : "rounded-t-lg",
        dimensions,
        interactive && "cursor-pointer",
        !interactive && "cursor-default",
        state
          ? STATUS_CLASSES[state.status] ?? EMPTY_CLASSES
          : EMPTY_CLASSES,
        selected &&
          "ring-2 ring-primary ring-offset-1"
      )}
    >
      {toothNumber}
    </Tag>
  );
}

export default function Odontogram({
  teeth = [],
  selectedTooth = null,
  onToothClick,
  size = "md",
  className,
}: OdontogramProps) {
  const interactive = Boolean(onToothClick);

  return (
    <div
      className={cn(
        "shadow-elegant inline-flex flex-col items-center gap-2 overflow-x-auto rounded-xl border bg-muted/10 p-5",
        className
      )}
    >
      <div className="flex gap-1">
        {UPPER_ROW.map((tooth, index) => (
          <div
            key={tooth}
            className={cn(
              index === 8 && "ml-2"
            )}
          >
            <ToothChip
              toothNumber={tooth}
              state={resolveToothState(tooth, teeth)}
              selected={selectedTooth === tooth}
              interactive={interactive}
              size={size}
              flip={false}
              onClick={() => onToothClick?.(tooth)}
            />
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-border" />

      <div className="flex gap-1">
        {LOWER_ROW.map((tooth, index) => (
          <div
            key={tooth}
            className={cn(
              index === 8 && "ml-2"
            )}
          >
            <ToothChip
              toothNumber={tooth}
              state={resolveToothState(tooth, teeth)}
              selected={selectedTooth === tooth}
              interactive={interactive}
              size={size}
              flip={true}
              onClick={() => onToothClick?.(tooth)}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-primary/50 bg-primary/10" />
          Planejado
        </span>

        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-amber-400 bg-amber-50" />
          Em andamento
        </span>

        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border border-emerald-400 bg-emerald-50" />
          Concluído
        </span>
      </div>
    </div>
  );
}
