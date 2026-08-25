interface WelcomeCardProps {
  userName: string;
  todayAppointmentsCount: number;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";

  return "Boa noite";
}

export default function WelcomeCard({
  userName,
  todayAppointmentsCount,
}: WelcomeCardProps) {
  const today = new Date().toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }
  );

  return (
    <div className="shadow-elegant relative overflow-hidden rounded-2xl border bg-card p-7 sm:p-9">
      {/* Traço decorativo que ecoa o conector do ícone da marca —
          dois nós ligados por uma linha em fluxo. Bem discreto. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-40 w-56 opacity-[0.09] sm:h-48 sm:w-72"
        viewBox="0 0 280 180"
        fill="none"
      >
        <path
          d="M10 150 C 80 150, 90 40, 160 40 S 250 150, 270 90"
          stroke="url(#welcomeFlowGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className="flow-dash"
        />
        <circle cx="10" cy="150" r="5" fill="var(--brand-blue)" />
        <circle cx="270" cy="90" r="5" fill="var(--brand-cyan)" />
        <defs>
          <linearGradient
            id="welcomeFlowGradient"
            x1="0"
            y1="0"
            x2="280"
            y2="0"
          >
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="100%" stopColor="var(--brand-cyan)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-[1.75rem]">
          {getGreeting()}, {userName.split(" ")[0]}!
        </h1>

        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 capitalize text-muted-foreground">
          {today}

          {todayAppointmentsCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium normal-case text-primary">
              {todayAppointmentsCount}{" "}
              {todayAppointmentsCount === 1
                ? "consulta hoje"
                : "consultas hoje"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
