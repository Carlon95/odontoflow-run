"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClinicInput, FormField } from "@/src/clinic-ui";

import { requestPasswordReset } from "../services/client/authApi";

interface FormData {
  email: string;
}

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: "" },
  });

  async function onSubmit(
    data: FormData
  ) {
    try {
      setIsSubmitting(true);

      await requestPasswordReset(
        data.email
      );

      setSent(true);

    } catch {

      // A rota sempre responde com sucesso genérico — se algo
      // realmente quebrar, mostramos a mesma mensagem mesmo
      // assim, pra não vazar informação.
      setSent(true);

    } finally {

      setIsSubmitting(false);

    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />

        <p className="font-medium">
          Verifique seu e-mail
        </p>

        <p className="text-sm text-muted-foreground">
          Se esse e-mail estiver cadastrado,
          enviamos um link para redefinir
          sua senha. Ele expira em 1 hora.
        </p>

        <Link
          href="/login"
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
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

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Enviando..."
          : "Enviar link de redefinição"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}
