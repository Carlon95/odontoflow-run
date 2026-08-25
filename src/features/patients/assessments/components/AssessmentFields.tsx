"use client";

import {
  ClinicInput,
  ClinicTextarea,
  FormField,
} from "@/src/clinic-ui";

import {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

export interface AssessmentFormData {
  date: string;
  type: string;
  description: string;
}

interface AssessmentFieldsProps {
  register: UseFormRegister<AssessmentFormData>;
  errors: FieldErrors<AssessmentFormData>;
}

export default function AssessmentFields({
  register,
  errors,
}: AssessmentFieldsProps) {
  return (
    <>
      <FormField
        label="Data da Avaliação"
        required
      >
        <>
          <ClinicInput
            type="date"
            {...register("date", {
              required:
                "Informe a data da avaliação.",
            })}
          />

          {errors.date && (
            <p className="mt-1 text-sm text-destructive">
              {errors.date.message}
            </p>
          )}
        </>
      </FormField>

      <FormField
        label="Tipo de Avaliação"
        required
      >
        <>
          <ClinicInput
            placeholder="Ex: Avaliação inicial, Reavaliação, Escala de ansiedade (GAD-7)..."
            {...register("type", {
              required:
                "Informe o tipo da avaliação.",
            })}
          />

          {errors.type && (
            <p className="mt-1 text-sm text-destructive">
              {errors.type.message}
            </p>
          )}
        </>
      </FormField>

      <FormField
        label="Resultado / Observações"
        required
      >
        <>
          <ClinicTextarea
            rows={8}
            placeholder="Descreva os achados e resultados da avaliação..."
            {...register("description", {
              required:
                "Descreva o resultado da avaliação.",
              minLength: {
                value: 10,
                message:
                  "A descrição deve conter pelo menos 10 caracteres.",
              },
            })}
          />

          {errors.description && (
            <p className="mt-1 text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </>
      </FormField>
    </>
  );
}
