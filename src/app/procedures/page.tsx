import MainLayout from "@/src/components/layout/MainLayout";
import ProceduresPage from "@/src/features/procedures/pages/ProceduresPage";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";

export default async function Page() {
  await requireAuthenticatedUser();

  return (
    <MainLayout>
      <ProceduresPage />
    </MainLayout>
  );
}
