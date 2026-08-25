import MainLayout from "@/src/components/layout/MainLayout";
import PatientsPage from "@/src/features/patients/pages/PatientsPage";

import { requireAuthenticatedUser } from "@/src/features/auth/services/server/requireAuth";

export default async function Page() {
  await requireAuthenticatedUser();

  return (
    <MainLayout>
      <PatientsPage />
    </MainLayout>
  );
}
