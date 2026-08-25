"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AvatarInitials } from "@/src/clinic-ui";

import {
  PageContainer,
  PageHeader,
} from "@/src/clinic-ui";

import PatientModal from "../components/PatientModal";
import PatientSearch from "../components/PatientSearch";
import PatientTable from "../components/PatientTable";

import { Patient } from "../types/patient";
import { getPatients } from "../services/patient.service";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const loadPatients = useCallback(async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      // Futuramente:
      // toast.error("Não foi possível carregar os pacientes.");
    }
  }, []);

  useEffect(() => {
    // Busca única ao montar, não um ciclo de atualização em
    // cascata — padrão intencional de "carregar dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPatients();
  }, [loadPatients]);

  const filteredPatients = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return patients;
    }

    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm)
    );
  }, [patients, search]);

  function handleNewPatient() {
    setSelectedPatient(undefined);
    setOpen(true);
  }

  function handleEditPatient(patient: Patient) {
    setSelectedPatient(patient);
    setOpen(true);
  }

  async function handleSave() {
    await loadPatients();
    setOpen(false);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Pacientes"
        description="Gerencie todos os pacientes da clínica."
        actions={
          <Button onClick={handleNewPatient}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Button>
        }
      />

      <PatientModal
        open={open}
        onOpenChange={setOpen}
        patient={selectedPatient}
        onSave={handleSave}
      />

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PatientSearch
          value={search}
          onChange={setSearch}
        />

        <div className="flex shrink-0 items-center gap-2 rounded-lg border bg-muted/30 px-4 py-2">
          <Users className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm text-muted-foreground">
            <strong>{patients.length}</strong> paciente(s)
          </span>
        </div>
      </div>

      <PatientTable
        patients={filteredPatients}
        onEdit={handleEditPatient}
      />
    </PageContainer>
  );
}