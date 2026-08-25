import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

const variants: Record<string, string> = {
  Novo:
    "bg-blue-100 text-blue-700 hover:bg-blue-100",

  Ativo:
    "bg-green-100 text-green-700 hover:bg-green-100",

  Oculto:
    "bg-slate-100 text-slate-700 hover:bg-slate-100",

  Pago:
    "bg-green-100 text-green-700 hover:bg-green-100",

  Pendente:
    "bg-amber-100 text-amber-700 hover:bg-amber-100",

  Atrasado:
    "bg-red-100 text-red-700 hover:bg-red-100",

  Agendada:
    "bg-blue-100 text-blue-700 hover:bg-blue-100",

  Realizada:
    "bg-green-100 text-green-700 hover:bg-green-100",

  Cancelada:
    "bg-slate-100 text-slate-700 hover:bg-slate-100",

  Anamnese:
    "bg-orange-100 text-orange-700 hover:bg-orange-100",

  "Avaliação":
    "bg-purple-100 text-purple-700 hover:bg-purple-100",

  "Em Tratamento":
    "bg-green-100 text-green-700 hover:bg-green-100",

  Alta:
    "bg-slate-100 text-slate-700 hover:bg-slate-100",

  "Você":
    "bg-blue-100 text-blue-700 hover:bg-blue-100",

  Enviado:
    "bg-green-100 text-green-700 hover:bg-green-100",

  Falhou:
    "bg-red-100 text-red-700 hover:bg-red-100",
};

export default function StatusBadge({
  status,
}: Props) {
  return (
    <Badge
      className={
        variants[status] ??
        "bg-muted text-muted-foreground"
      }
    >
      {status}
    </Badge>
  );
}