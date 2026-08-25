import { Suspense } from "react";

import RegisterCard from "@/src/features/auth/components/RegisterCard";

export default function RegisterPage() {
  return (
    <div className="bg-ambient-glow flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Suspense fallback={null}>
        <RegisterCard />
      </Suspense>
    </div>
  );
}
