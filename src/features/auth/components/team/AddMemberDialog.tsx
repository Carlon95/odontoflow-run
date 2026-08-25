"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ClinicInput, FormField } from "@/src/clinic-ui";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { register as registerMember } from "../../services/client/authApi";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Dentista";
}

export default function AddMemberDialog({
  open,
  onOpenChange,
  onAdded,
}: AddMemberDialogProps) {
  const [isSaving, setIsSaving] =
    useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Dentista",
    },
  });

  async function onSubmit(
    data: FormData
  ) {
    try {
      setIsSaving(true);

      await registerMember(data);

      toast.success(
        "Usuário adicionado com sucesso."
      );

      reset();
      onOpenChange(false);
      onAdded();

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao adicionar usuário."
      );

    } finally {

      setIsSaving(false);

    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Adicionar Membro
          </DialogTitle>

          <DialogDescription>
            Crie o acesso de um novo dentista
            ou administrador à clínica.
          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            label="Nome completo"
            required
          >
            <>
              <ClinicInput
                placeholder="Nome da pessoa"
                {...register("name", {
                  required:
                    "Informe o nome.",
                })}
              />

              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </>
          </FormField>

          <FormField
            label="E-mail"
            required
          >
            <>
              <ClinicInput
                type="email"
                placeholder="email@exemplo.com"
                {...register("email", {
                  required:
                    "Informe o e-mail.",
                })}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </>
          </FormField>

          <FormField
            label="Senha provisória"
            required
          >
            <>
              <ClinicInput
                type="password"
                placeholder="Mínimo 8 caracteres"
                {...register("password", {
                  required:
                    "Informe uma senha.",
                  minLength: {
                    value: 8,
                    message:
                      "A senha deve ter pelo menos 8 caracteres.",
                  },
                })}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </>
          </FormField>

          <FormField
            label="Papel"
            required
          >
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Dentista">
                      Dentista
                    </SelectItem>

                    <SelectItem value="Admin">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Adicionando..."
                : "Adicionar"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
