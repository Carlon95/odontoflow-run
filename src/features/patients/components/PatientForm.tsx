"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  patientSchema,
  PatientFormData,
} from "../schemas/patientSchema";

import {
  createPatient,
  updatePatient,
} from "../services/patient.service";

import { Patient } from "../types/patient";

import { FormField } from "@/src/clinic-ui";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import SectionCard from "@/src/clinic-ui/layout/SectionCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientFormProps {
  onSave: () => void;
  patient?: Patient;
}

export default function PatientForm({
  onSave,
  patient,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      gender: "Masculino",
      phone: "",
      email: "",
      cpf: "",
      insurancePlan: "",
    },
  });

  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name,
        birthDate: new Date(patient.birthDate)
          .toISOString()
          .split("T")[0],
        gender: patient.gender,
        phone: patient.phone ?? "",
        email: patient.email ?? "",
        cpf: patient.cpf ?? "",
        insurancePlan: patient.insurancePlan ?? "",
      });
    } else {
      reset({
        name: "",
        birthDate: "",
        gender: "Masculino",
        phone: "",
        email: "",
        cpf: "",
        insurancePlan: "",
      });
    }
  }, [patient, reset]);

  async function handleSave(data: PatientFormData) {
    try {
      if (patient) {
        await updatePatient(patient.id, data);

        toast.success(
          "Paciente atualizado com sucesso!"
        );
      } else {
        await createPatient(data);

        toast.success(
          "Paciente cadastrado com sucesso!"
        );
      }

      reset({
        name: "",
        birthDate: "",
        gender: "Masculino",
        phone: "",
        email: "",
        cpf: "",
        insurancePlan: "",
      });

      onSave();
    } catch (error) {
      console.error(error);

      toast.error(
        "Não foi possível salvar o paciente."
      );
    }
  }

  return (
  <form
    onSubmit={handleSubmit(handleSave)}
    className="space-y-6"
  >
    <SectionCard
      title="Dados Pessoais"
      description="Informações básicas do paciente."
    >
      <div className="space-y-5">
        <FormField
          id="name"
          label="Nome Completo"
          required
          error={errors.name?.message}
        >
          <Input
            id="name"
            placeholder="Digite o nome completo"
            {...register("name")}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            id="birthDate"
            label="Data de Nascimento"
            required
            error={errors.birthDate?.message}
          >
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate")}
            />
          </FormField>

          <FormField
            label="Sexo"
            required
            error={errors.gender?.message}
          >
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Masculino">
                      Masculino
                    </SelectItem>

                    <SelectItem value="Feminino">
                      Feminino
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            id="phone"
            label="Telefone (WhatsApp)"
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              placeholder="(11) 91234-5678"
              {...register("phone")}
            />
          </FormField>

          <FormField
            id="email"
            label="E-mail"
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              placeholder="paciente@email.com"
              {...register("email")}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            id="cpf"
            label="CPF"
            error={errors.cpf?.message}
          >
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              {...register("cpf")}
            />
          </FormField>

          <FormField
            id="insurancePlan"
            label="Convênio"
            error={errors.insurancePlan?.message}
          >
            <Input
              id="insurancePlan"
              placeholder="Particular, se em branco"
              {...register("insurancePlan")}
            />
          </FormField>
        </div>
      </div>
    </SectionCard>

    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? patient
            ? "Atualizando..."
            : "Salvando..."
          : patient
          ? "Atualizar Paciente"
          : "Salvar Paciente"}
      </Button>
    </div>
  </form>
);
}