"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ClinicInput, FormField } from "@/src/clinic-ui";

import {
  login,
  checkSetup,
} from "../services/client/authApi";
import { LoginFormData } from "../schemas/authSchema";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [setupRequired, setSetupRequired] =
    useState(false);

  useEffect(() => {
    checkSetup()
      .then((data) =>
        setSetupRequired(
          data.setupRequired
        )
      )
      .catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    data: LoginFormData
  ) {
    try {
      setIsSubmitting(true);
      setError(null);

      await login(
        data.email,
        data.password
      );

      const redirectTo =
        searchParams.get("redirect") ||
        "/";

      router.push(redirectTo);
      router.refresh();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Erro ao entrar."
      );

    } finally {

      setIsSubmitting(false);

    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {setupRequired && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
          Nenhuma conta encontrada.{" "}
          <Link
            href="/register"
            className="font-medium underline"
          >
            Crie a conta de administrador
          </Link>{" "}
          para começar a usar o sistema.
        </div>
      )}

      <FormField
        label="E-mail"
        required
      >
        <>
          <ClinicInput
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
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
        label="Senha"
        required
      >
        <>
          <ClinicInput
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password", {
              required:
                "Informe a senha.",
            })}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </>
      </FormField>

      <div className="-mt-3 text-right">
        <Link
          href="/esqueci-senha"
          className="text-sm text-primary hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

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
          ? "Entrando..."
          : "Entrar"}
      </Button>
    </form>
  );
}
