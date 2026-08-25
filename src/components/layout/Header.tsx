"use client";

import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { logout } from "@/src/features/auth/services/client/authApi";
import { navItems } from "./navItems";

interface HeaderProps {
  onMenuClick: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/patients/")) {
    return "Paciente";
  }

  const match = navItems.find((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href)
  );

  return match?.label ?? "OdontoFlow";
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useCurrentUser();

  async function handleLogout() {
    await logout();

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/80 px-4 shadow-sm backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
          {getPageTitle(pathname)}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span className="hidden text-sm text-slate-600 sm:inline">
          {user
            ? `Bem-vindo, ${user.name.split(" ")[0]}!`
            : "Bem-vindo!"}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {user ? getInitials(user.name) : "..."}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Sair"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
