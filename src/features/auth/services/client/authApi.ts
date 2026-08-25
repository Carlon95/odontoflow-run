import { SafeUser } from "../../types/user";

export async function login(
  email: string,
  password: string
) {
  const response = await fetch(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Erro ao entrar."
    );
  }

  return response.json() as Promise<SafeUser>;
}

export async function checkSetup() {
  const response = await fetch(
    "/api/auth/register"
  );

  if (!response.ok) {
    return { setupRequired: false };
  }

  return response.json() as Promise<{
    setupRequired: boolean;
  }>;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const response = await fetch(
    "/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Erro ao criar conta."
    );
  }

  return response.json() as Promise<SafeUser>;
}

export async function requestPasswordReset(
  email: string
) {
  const response = await fetch(
    "/api/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Erro ao solicitar redefinição de senha."
    );
  }

  return data as { message: string };
}

export async function resetPassword(
  token: string,
  password: string
) {
  const response = await fetch(
    "/api/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Erro ao redefinir senha."
    );
  }
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  const response = await fetch(
    "/api/auth/me"
  );

  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<SafeUser>;
}
