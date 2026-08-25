import { ShieldAlert } from "lucide-react";

import MainLayout from "@/src/components/layout/MainLayout";
import { PageContainer, PageHeader } from "@/src/clinic-ui";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";
import TeamPage from "@/src/features/auth/components/team/TeamPage";

export default async function ConfiguracoesPage() {
  const user = await requireAuthenticatedUser();

  const isAdmin = user.role === "Admin";

  return (
    <MainLayout>
      <PageContainer>
        <PageHeader
          title="Configurações"
          description="Gerencie a equipe com acesso à clínica."
        />

        {isAdmin ? (
          <TeamPage />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
            <ShieldAlert className="h-8 w-8 text-muted-foreground" />

            <p className="font-medium">
              Acesso restrito
            </p>

            <p className="max-w-sm text-sm text-muted-foreground">
              Apenas administradores podem
              gerenciar a equipe. Fale com um
              administrador da clínica se
              precisar de alguma alteração.
            </p>
          </div>
        )}
      </PageContainer>
    </MainLayout>
  );
}
