"use client";

import {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import {
  ClinicInput,
  FormField,
} from "@/src/clinic-ui";

export interface FinancialEntryFormData {
  date: string;
  description: string;
  amount: string;
  method: string;
}

interface FinancialEntryFieldsProps {
  register: UseFormRegister<FinancialEntryFormData>;
  control: Control<FinancialEntryFormData>;
  errors: FieldErrors<FinancialEntryFormData>;
}

export default function FinancialEntryFields({
  register,
  errors,
}: FinancialEntryFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

      <FormField
        label="Descrição"
        required
      >
        <>
          <ClinicInput
            placeholder="Ex: Consulta odontológica, Tratamento de canal..."
            {...register("description", {
              required:
                "Informe a descrição do lançamento.",
            })}
          />

          {errors.description && (
            <p className="mt-1 text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </>
      </FormField>

      <FormField
        label="Valor (R$)"
        required
      >
        <>
          <ClinicInput
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            {...register("amount", {
              required:
                "Informe o valor.",
              min: {
                value: 0,
                message:
                  "O valor não pode ser negativo.",
              },
            })}
          />

          {errors.amount && (
            <p className="mt-1 text-sm text-destructive">
              {errors.amount.message}
            </p>
          )}
        </>
      </FormField>

      <FormField
        label="Vencimento"
        required
      >
        <ClinicInput
          type="date"
          {...register("date", {
            required:
              "Informe o vencimento.",
          })}
        />
      </FormField>

      <FormField
        label="Forma de Pagamento"
      >
        <ClinicInput
          placeholder="Ex: Pix, Cartão, Dinheiro..."
          {...register("method")}
        />
      </FormField>

    </div>
  );
}
