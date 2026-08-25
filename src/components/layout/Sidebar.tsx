"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { navItems } from "./navItems";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay no mobile, atrás da sidebar */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-sidebar transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0",
          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-5">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <Image
              src="/brand/logo-horizontal-white-text.png"
              alt="OdontoFlow"
              width={168}
              height={71}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            if (!item.available) {
              return (
                <li key={item.href}>
                  <div className="flex cursor-not-allowed items-center justify-between rounded-lg border-l-2 border-transparent py-2.5 pl-[10px] pr-3 text-sm text-sidebar-foreground/40">
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>

                    <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/50">
                      Em breve
                    </span>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-l-2 py-2.5 pl-[10px] pr-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-sidebar-primary bg-sidebar-primary/8 text-sidebar-primary"
                      : "border-transparent text-sidebar-foreground/65 hover:bg-white/5 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
