import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export async function hashPassword(
  password: string
) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
) {
  return bcrypt.compare(
    password,
    passwordHash
  );
}

// ==============================
// Token de redefinição de senha
// ==============================
//
// O token em si (alta entropia, aleatório) só existe no e-mail
// enviado à pessoa. No banco guardamos apenas o hash dele — assim,
// mesmo que o banco vaze, ninguém consegue redefinir senha de
// ninguém com esse dado (mesmo princípio de nunca guardar senha
// em texto puro).

export function generateResetToken() {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

export function hashResetToken(
  token: string
) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}
