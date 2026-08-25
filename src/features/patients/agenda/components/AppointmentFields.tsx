"use client";

import { useEffect, useState } from "react";

import {
  Controller,
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import {
  ClinicInput,
  FormField,
} from "@/src/clinic-ui";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getPatients } from "@/src/features/patients/services/patient.service";
import { Patient } from "@/src/features/patients/types/patient";

import { getProfessionals, Professional } from "@/src/features/auth/services/client/professionalApi";
import { getProcedures } from "@/src/features/procedures/services/procedureApi";
import { Procedure } from "@/src/features/procedures/types/procedure";

export interface AppointmentFormData {
  patientId: string;
  professionalId: string;
  procedureId: string;
  date: string;
  time: string;
  duration: string;
  status: "Agendada" | "Realizada" | "Cancelada";
  notes: string;
}

interface AppointmentFieldsProps {
  register: UseFormRegister<AppointmentFormData>;
  control: Control<AppointmentFormData>;
  errors: FieldErrors<AppointmentFormData>;
  showPatientSelect?: boolean;
  onProcedureChange?: (procedure: Procedure | undefined) => void;
}

export default function AppointmentFields({
  register,
  control,
  errors,
  showPatientSelect = false,
  onProcedureChange,
}: AppointmentFieldsProps) {
  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [professionals, setProfessionals] =
    useState<Professional[]>([]);

  const [procedures, setProcedures] =
    useState<Procedure[]>([]);

  useEffect(() => {
    if (!showPatientSelect) return;

    getPatients()
      .then(setPatients)
      .catch((error) =>
        console.error(error)
      );
  }, [showPatientSelect]);

  useEffect(() => {
    getProfessionals()
      .then(setProfessionals)
      .catch((error) => console.error(error));

    getProcedures()
      .then((data) =>
        setProcedures(data.filter((procedure) => procedure.active))
      )
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

      {showPatientSelect && (
        <div className="sm:col-span-2">
          <FormField
            label="Paciente"
            required
          >
            <Controller
              control={control}
              name="patientId"
              rules={{
                required:
                  "Selecione o paciente.",
              }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>

                  <SelectContent>
                    {patients.map(
                      (patient) => (
                        <SelectItem
                          key={patient.id}
                          value={patient.id}
                        >
                          {patient.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.patientId && (
              <p className="mt-1 text-sm text-destructive">
                {errors.patientId.message}
              </p>
            )}
          </FormField>
        </div>
      )}

      <FormField label="Dentista Responsável">
        <Controller
          control={control}
          name="professionalId"
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>

              <SelectContent>
                {professionals.map((professional) => (
                  <SelectItem
                    key={professional.id}
                    value={professional.id}
                  >
                    {professional.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="Procedimento">
        <Controller
          control={control}
          name="procedureId"
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={(value) => {
                field.onChange(value);
                onProcedureChange?.(
                  procedures.find((p) => p.id === value)
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>

              <SelectContent>
                {procedures.map((procedure) => (
                  <SelectItem
                    key={procedure.id}
                    value={procedure.id}
                  >
                    {procedure.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField
        label="Data"
        required
      >
        <ClinicInput
          type="date"
          {...register("date", {
            required: "Informe a data.",
          })}
        />
      </FormField>

      <FormField
        label="Horário"
        required
      >
        <ClinicInput
          type="time"
          {...register("time", {
            required: "Informe o horário.",
          })}
        />
      </FormField>

      <FormField
        label="Duração (minutos)"
        required
      >
        <ClinicInput
          type="number"
          min="10"
          step="5"
          {...register("duration", {
            required: "Informe a duração.",
          })}
        />
      </FormField>

      <FormField
        label="Status"
        required
      >
        <Controller
          control={control}
          name="status"
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Agendada">
                  Agendada
                </SelectItem>

                <SelectItem value="Realizada">
                  Realizada
                </SelectItem>

                <SelectItem value="Cancelada">
                  Cancelada
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="sm:col-span-2">
        <FormField label="Observações">
          <ClinicInput
            placeholder="Opcional"
            {...register("notes")}
          />
        </FormField>
      </div>

    </div>
  );
}
