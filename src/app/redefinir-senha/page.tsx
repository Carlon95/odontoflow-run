import { Suspense } from "react";

import ResetPasswordCard from "@/src/features/auth/components/ResetPasswordCard";

export default function ResetPasswordPage() {
  return (
    <div className="bg-ambient-glow flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Suspense fallback={null}>
        <ResetPasswordCard />
      </Suspense>
    </div>
  );
}
