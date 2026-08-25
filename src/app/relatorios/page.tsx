import MainLayout from "@/src/components/layout/MainLayout";
import { PageContainer, PageHeader } from "@/src/clinic-ui";

import ReportsPage from "@/src/features/reports/components/ReportsPage";
import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";

export default async function Page() {
  await requireAuthenticatedUser();

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader
          title="Relatórios"
          description="Indicadores financeiros e operacionais da clínica."
        />

        <ReportsPage />
      </PageContainer>
    </MainLayout>
  );
}
