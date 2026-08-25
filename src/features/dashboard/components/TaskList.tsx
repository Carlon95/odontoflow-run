import Link from "next/link";
import { AlertCircle, ClipboardList } from "lucide-react";

interface TaskListProps {
  patientsWithoutAnamnesis: number;
  overdueCount: number;
}

export default function TaskList({
  patientsWithoutAnamnesis,
  overdueCount,
}: TaskListProps) {
  const items = [
    patientsWithoutAnamnesis > 0 && {
      icon: (
        <ClipboardList className="h-4 w-4 text-orange-600" />
      ),
      text: `${patientsWithoutAnamnesis} paciente${patientsWithoutAnamnesis === 1 ? "" : "s"} sem anamnese preenchida`,
      href: "/patients",
    },
    overdueCount > 0 && {
      icon: (
        <AlertCircle className="h-4 w-4 text-red-600" />
      ),
      text: `${overdueCount} pagamento${overdueCount === 1 ? "" : "s"} atrasado${overdueCount === 1 ? "" : "s"}`,
      href: "/patients",
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    text: string;
    href: string;
  }[];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-4 font-semibold">
        Pendências
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Tudo em dia por aqui. 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              {item.icon}

              <p className="text-sm">
                {item.text}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
