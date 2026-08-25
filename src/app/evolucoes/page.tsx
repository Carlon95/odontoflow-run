import MainLayout from "@/src/components/layout/MainLayout";
import { PageContainer, PageHeader } from "@/src/clinic-ui";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";
import EvolutionsOverviewPage from "@/src/features/patients/evolutions/overview/EvolutionsOverviewPage";

export default async function Page() {
  await requireAuthenticatedUser();

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader
          title="Evoluções"
          description="Sessões registradas de todos os pacientes."
        />

        <EvolutionsOverviewPage />
      </PageContainer>
    </MainLayout>
  );
}
