"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import SummaryTab from "./tabs/SummaryTab";
import AnamnesisTab from "./tabs/AnamnesisTab";
import AssessmentTab from "./tabs/AssessmentTab";
import TreatmentPlanTab from "./tabs/TreatmentPlanTab";
import FinanceTab from "./tabs/FinanceTab";

import EvolutionsTab from "../evolutions/components/EvolutionsTab";
import MessagesTab from "../messages/components/MessagesTab";
import DocumentsTab from "../documents/components/DocumentsTab";

import { Patient } from "../types/patient";
import { Anamnesis } from "../anamnese/types/anamnesis";
import { Evolution } from "../evolutions/types/evolution";
import { FinancialEntry } from "../financial/types/financialEntry";
import { Appointment } from "../agenda/types/appointment";

interface PatientTabsProps {
  patient: Patient;
  anamnesis: Anamnesis | null;
  evolutions: Evolution[];
  financialEntries: FinancialEntry[];
  appointments: Appointment[];
}

export default function PatientTabs({
  patient,
  anamnesis,
  evolutions,
  financialEntries,
  appointments,
}: PatientTabsProps) {
  return (
    <Tabs
      defaultValue="summary"
      className="space-y-6"
    >
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList className="flex w-max min-w-full gap-1 sm:grid sm:grid-cols-8">
          <TabsTrigger value="summary">
            Resumo
          </TabsTrigger>

          <TabsTrigger value="anamnese">
            Anamnese
          </TabsTrigger>

          <TabsTrigger value="assessment">
            Avaliações
          </TabsTrigger>

          <TabsTrigger value="therapy">
            Tratamento
          </TabsTrigger>

          <TabsTrigger value="progress">
            Evoluções
          </TabsTrigger>

          <TabsTrigger value="documents">
            Arquivos
          </TabsTrigger>

          <TabsTrigger value="finance">
            Financeiro
          </TabsTrigger>

          <TabsTrigger value="messages">
            Mensagens
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="summary">
        <SummaryTab
          patient={patient}
          anamnesis={anamnesis}
          evolutions={evolutions}
          financialEntries={financialEntries}
          appointments={appointments}
        />
      </TabsContent>

      <TabsContent value="anamnese">
        <AnamnesisTab patientId={patient.id} />
      </TabsContent>

      <TabsContent value="assessment">
        <AssessmentTab patientId={patient.id} />
      </TabsContent>

      <TabsContent value="therapy">
        <TreatmentPlanTab patientId={patient.id} />
      </TabsContent>

      <TabsContent value="progress">
        <EvolutionsTab patientId={patient.id} />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsTab patientId={patient.id} />
      </TabsContent>

      <TabsContent value="finance">
        <FinanceTab patientId={patient.id} />
      </TabsContent>

      <TabsContent value="messages">
        <MessagesTab
          patientId={patient.id}
          hasPhone={!!patient.phone}
        />
      </TabsContent>
    </Tabs>
  );
}