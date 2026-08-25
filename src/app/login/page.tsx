import { Suspense } from "react";

import LoginCard from "@/src/features/auth/components/LoginCard";

export default function LoginPage() {
  return (
    <div className="bg-ambient-glow flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </div>
  );
}
