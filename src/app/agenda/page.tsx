import MainLayout from "@/src/components/layout/MainLayout";
import AgendaPage from "@/src/features/patients/agenda/pages/AgendaPage";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";

export default async function Page() {
  await requireAuthenticatedUser();

  return (
    <MainLayout>
      <AgendaPage />
    </MainLayout>
  );
}
