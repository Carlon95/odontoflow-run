import {
  clearResetToken,
  count,
  create,
  findByEmail,
  findByResetTokenHash,
  registerFailedAttempt,
  resetLoginAttempts,
  setResetToken,
  updatePassword,
} from "../../repositories/userRepository";

import {
  generateResetToken,
  hashPassword,
  hashResetToken,
  verifyPassword,
} from "./passwordService";

import { createSessionToken } from "./sessionService";
import { sendEmail } from "@/src/lib/email";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const RESET_TOKEN_EXPIRY_MINUTES = 60;

export type LoginResult =
  | {
      success: true;
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  | {
      success: false;
      reason: "invalid";
    }
  | {
      success: false;
      reason: "locked";
      lockedUntil: Date;
    };

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  const user = await findByEmail(email);

  if (!user) {
    return { success: false, reason: "invalid" };
  }

  if (
    user.lockedUntil &&
    user.lockedUntil > new Date()
  ) {
    return {
      success: false,
      reason: "locked",
      lockedUntil: user.lockedUntil,
    };
  }

  const isValid = await verifyPassword(
    password,
    user.passwordHash
  );

  if (!isValid) {
    const attempts =
      user.failedLoginAttempts + 1;

    const shouldLock =
      attempts >= MAX_LOGIN_ATTEMPTS;

    const lockedUntil = shouldLock
      ? new Date(
          Date.now() +
            LOCKOUT_MINUTES * 60 * 1000
        )
      : null;

    await registerFailedAttempt(
      user.id,
      attempts,
      lockedUntil
    );

    if (shouldLock && lockedUntil) {
      return {
        success: false,
        reason: "locked",
        lockedUntil,
      };
    }

    return { success: false, reason: "invalid" };
  }

  await resetLoginAttempts(user.id);

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const existing = await findByEmail(
    data.email
  );

  if (existing) {
    throw new Error(
      "Já existe um usuário com este e-mail."
    );
  }

  const passwordHash = await hashPassword(
    data.password
  );

  return create({
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role ?? "Dentista",
  });
}

export async function hasAnyUser() {
  const total = await count();

  return total > 0;
}

// ==============================
// Redefinição de senha
// ==============================

export async function requestPasswordReset(
  email: string
) {
  const user = await findByEmail(email);

  // Sempre "funciona" silenciosamente, mesmo se o e-mail não
  // existir — não dá pra revelar quais e-mails têm conta
  // cadastrada (evita enumeração de contas por terceiros).
  if (!user) return;

  // Se já foi gerado um token há menos de 5 minutos (o token
  // dura 60min, então se ainda faltam mais de 55min pra expirar
  // é porque acabou de ser criado), não manda de novo — evita
  // que alguém fique disparando e-mails em sequência pro mesmo
  // endereço.
  const recentlyRequested =
    user.resetTokenExpiresAt &&
    user.resetTokenExpiresAt.getTime() -
      Date.now() >
      55 * 60 * 1000;

  if (recentlyRequested) return;

  const rawToken = generateResetToken();
  const tokenHash = hashResetToken(rawToken);

  const expiresAt = new Date(
    Date.now() +
      RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  await setResetToken(
    user.id,
    tokenHash,
    expiresAt
  );

  const appUrl =
    process.env.APP_URL ??
    "http://localhost:3000";

  const resetUrl = `${appUrl}/redefinir-senha?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject:
      "Redefinição de senha — OdontoFlow",
    html: `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="padding: 24px 0 16px; border-bottom: 2px solid #0248BF;">
          <span style="font-size: 20px; font-weight: 700; color: #08256B;">Odonto<span style="color: #0248BF;">Flow</span></span>
        </div>
        <div style="padding: 24px 0; color: #1e293b; font-size: 14px; line-height: 1.6;">
          <p>Olá, ${user.name}.</p>
          <p>Recebemos um pedido para redefinir a senha da sua conta no OdontoFlow.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; background: #0248BF; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600;">
              Escolher nova senha
            </a>
          </p>
          <p style="color: #64748b; font-size: 13px;">Esse link expira em 1 hora. Se você não pediu isso, pode ignorar este e-mail — sua senha continua a mesma.</p>
        </div>
      </div>
    `,
  });
}

export async function resetPassword(
  rawToken: string,
  newPassword: string
) {
  const tokenHash =
    hashResetToken(rawToken);

  const user = await findByResetTokenHash(
    tokenHash
  );

  if (
    !user ||
    !user.resetTokenExpiresAt ||
    user.resetTokenExpiresAt < new Date()
  ) {
    throw new Error(
      "Link inválido ou expirado. Solicite uma nova redefinição de senha."
    );
  }

  const passwordHash = await hashPassword(
    newPassword
  );

  await updatePassword(
    user.id,
    passwordHash
  );

  await clearResetToken(user.id);

  // Já que a pessoa provou que tem acesso ao e-mail, aproveita
  // pra também liberar um eventual bloqueio de tentativas.
  await resetLoginAttempts(user.id);
}
