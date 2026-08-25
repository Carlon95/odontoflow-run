"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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

import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  checkSetup,
  register,
} from "../services/client/authApi";
import { RegisterFormData } from "../schemas/authSchema";

export default function RegisterForm() {
  const router = useRouter();

  const { user, loading: loadingUser } =
    useCurrentUser();

  const [setupRequired, setSetupRequired] =
    useState<boolean | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    checkSetup()
      .then((data) =>
        setSetupRequired(
          data.setupRequired
        )
      )
      .catch(() =>
        setSetupRequired(false)
      );
  }, []);

  const {
    register: registerField,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Dentista",
    },
  });

  async function onSubmit(
    data: RegisterFormData
  ) {
    try {
      setIsSubmitting(true);
      setError(null);

      await register(data);

      if (setupRequired) {
        // O cadastro inicial já loga automaticamente.
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar conta."
      );

    } finally {

      setIsSubmitting(false);

    }
  }

  // Ainda checando se o cadastro está liberado.
  if (
    setupRequired === null ||
    loadingUser
  ) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Carregando...
      </div>
    );
  }

  // Já existe conta no sistema e ninguém está logado:
  // não deixa cadastrar às cegas.
  if (!setupRequired && !user) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-600">
          Esta clínica já tem uma conta
          cadastrada. Peça a um
          administrador para criar seu
          acesso, ou faça login se já
          tiver uma conta.
        </p>

        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ir para o login
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
        label="Nome completo"
        required
      >
        <>
          <ClinicInput
            placeholder="Seu nome"
            {...registerField("name", {
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
            placeholder="seu@email.com"
            {...registerField("email", {
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
            placeholder="Mínimo 8 caracteres"
            {...registerField(
              "password",
              {
                required:
                  "Informe a senha.",
                minLength: {
                  value: 8,
                  message:
                    "A senha deve ter pelo menos 8 caracteres.",
                },
              }
            )}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </>
      </FormField>

      {/* O papel só faz sentido quando um admin já
          logado está cadastrando outra pessoa. No
          cadastro inicial, a conta sempre vira Admin. */}
      {!setupRequired && (
        <FormField label="Papel">
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
      )}

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
          ? "Criando..."
          : setupRequired
            ? "Criar conta de administrador"
            : "Criar usuário"}
      </Button>
    </form>
  );
}
