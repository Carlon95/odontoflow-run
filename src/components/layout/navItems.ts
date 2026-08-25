import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  available: boolean;
}

export const navItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    available: true,
  },
  {
    href: "/patients",
    label: "Pacientes",
    icon: Users,
    available: true,
  },
  {
    href: "/agenda",
    label: "Agenda",
    icon: CalendarDays,
    available: true,
  },
  {
    href: "/procedures",
    label: "Procedimentos",
    icon: Stethoscope,
    available: true,
  },
  {
    href: "/evolucoes",
    label: "Evoluções",
    icon: FileText,
    available: true,
  },
  {
    href: "/financeiro",
    label: "Financeiro",
    icon: Wallet,
    available: true,
  },
  {
    href: "/relatorios",
    label: "Relatórios",
    icon: BarChart3,
    available: true,
  },
  {
    href: "/configuracoes",
    label: "Configurações",
    icon: Settings,
    available: true,
  },
];
