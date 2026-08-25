import MainLayout from "@/src/components/layout/MainLayout";
import { PageContainer, PageHeader } from "@/src/clinic-ui";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";
import FinancialOverviewPage from "@/src/features/patients/financial/overview/FinancialOverviewPage";

export default async function Page() {
  await requireAuthenticatedUser();

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader
          title="Financeiro"
          description="Lançamentos de todos os pacientes."
        />

        <FinancialOverviewPage />
      </PageContainer>
    </MainLayout>
  );
}
