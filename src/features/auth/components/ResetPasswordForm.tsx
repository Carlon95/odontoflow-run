"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClinicInput, FormField } from "@/src/clinic-ui";

import { resetPassword } from "../services/client/authApi";

interface FormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(
    data: FormData
  ) {
    if (!token) return;

    if (
      data.password !==
      data.confirmPassword
    ) {
      setError(
        "As senhas não coincidem."
      );

      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await resetPassword(
        token,
        data.password
      );

      setDone(true);

      setTimeout(() => {
        router.push("/login");
      }, 2500);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Erro ao redefinir senha."
      );

    } finally {

      setIsSubmitting(false);

    }
  }

  if (!token) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-destructive">
          Link inválido. Nenhum token de
          redefinição foi informado.
        </p>

        <Link
          href="/esqueci-senha"
          className="text-sm font-medium text-primary hover:underline"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />

        <p className="font-medium">
          Senha redefinida com sucesso
        </p>

        <p className="text-sm text-muted-foreground">
          Redirecionando para o login...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FormField
        label="Nova senha"
        required
      >
        <>
          <ClinicInput
            type="password"
            placeholder="Mínimo 8 caracteres"
            {...register("password", {
              required:
                "Informe a nova senha.",
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
        label="Confirmar nova senha"
        required
      >
        <>
          <ClinicInput
            type="password"
            placeholder="Repita a senha"
            {...register(
              "confirmPassword",
              {
                required:
                  "Confirme a nova senha.",
                validate: (value) =>
                  value ===
                    watch("password") ||
                  "As senhas não coincidem.",
              }
            )}
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-destructive">
              {
                errors.confirmPassword
                  .message
              }
            </p>
          )}
        </>
      </FormField>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Salvando..."
          : "Redefinir senha"}
      </Button>
    </form>
  );
}
