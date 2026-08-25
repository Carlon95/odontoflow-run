"use client";

import { Checkbox } from "@/components/ui/checkbox";

import {
  ClinicInput,
  ClinicTextarea,
  FormField,
} from "@/src/clinic-ui";

import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export interface EvolutionFormData {
  sessionDate: string;
  content: string;
  hasNextSession: boolean;
  nextSession: string;
}

interface EvolutionFieldsProps {
  register: UseFormRegister<EvolutionFormData>;
  watch: UseFormWatch<EvolutionFormData>;
  setValue: UseFormSetValue<EvolutionFormData>;
  errors: FieldErrors<EvolutionFormData>;
}

export default function EvolutionFields({
  register,
  watch,
  setValue,
  errors,
}: EvolutionFieldsProps) {
  const hasNextSession =
    watch("hasNextSession");

  return (
    <>
      <FormField
        label="Data do Atendimento"
        required
      >
        <>
          <ClinicInput
            type="date"
            {...register("sessionDate", {
              required:
                "Informe a data do atendimento.",
            })}
          />

          {errors.sessionDate && (
            <p className="mt-1 text-sm text-destructive">
              {errors.sessionDate.message}
            </p>
          )}
        </>
      </FormField>

      <FormField
        label="Evolução"
        required
      >
        <>
          <ClinicTextarea
            rows={8}
            placeholder="Descreva a evolução clínica..."
            {...register("content", {
              required:
                "Descreva a evolução do atendimento.",
              minLength: {
                value: 10,
                message:
                  "A evolução deve conter pelo menos 10 caracteres.",
              },
            })}
          />

          {errors.content && (
            <p className="mt-1 text-sm text-destructive">
              {errors.content.message}
            </p>
          )}
        </>
      </FormField>

      <div className="flex items-center space-x-3">
        <Checkbox
          checked={hasNextSession}
          onCheckedChange={(checked) =>
            setValue(
              "hasNextSession",
              Boolean(checked)
            )
          }
        />

        <label className="text-sm font-medium">
          Há retorno agendado
        </label>
      </div>

      <FormField
        label="Data do Retorno"
        required={hasNextSession}
      >
        <>
          <ClinicInput
            type="date"
            disabled={!hasNextSession}
            {...register("nextSession", {
              validate: (value) => {
                if (
                  hasNextSession &&
                  !value
                ) {
                  return "Informe a data do retorno.";
                }

                return true;
              },
            })}
          />

          {errors.nextSession && (
            <p className="mt-1 text-sm text-destructive">
              {errors.nextSession.message}
            </p>
          )}
        </>
      </FormField>
    </>
  );
}