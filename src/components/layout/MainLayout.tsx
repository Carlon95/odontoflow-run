"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({
  children,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="bg-ambient-glow flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
