import { prisma } from "@/src/lib/prisma";

export async function findByEmail(
  email: string
) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findById(
  id: string
) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function create(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}) {
  return prisma.user.create({
    data,
  });
}

export async function count() {
  return prisma.user.count();
}

export async function countByRole(
  role: string
) {
  return prisma.user.count({
    where: {
      role,
    },
  });
}

export async function findAll() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function update(
  id: string,
  data: {
    role: string;
  }
) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function remove(
  id: string
) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}

// ==============================
// Segurança de login
// ==============================

export async function registerFailedAttempt(
  id: string,
  attempts: number,
  lockedUntil: Date | null
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      failedLoginAttempts: attempts,
      lockedUntil,
    },
  });
}

export async function resetLoginAttempts(
  id: string
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

// ==============================
// Redefinição de senha
// ==============================

export async function setResetToken(
  id: string,
  tokenHash: string,
  expiresAt: Date
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: expiresAt,
    },
  });
}

export async function findByResetTokenHash(
  tokenHash: string
) {
  return prisma.user.findFirst({
    where: {
      resetTokenHash: tokenHash,
    },
  });
}

export async function clearResetToken(
  id: string
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      resetTokenHash: null,
      resetTokenExpiresAt: null,
    },
  });
}

export async function updatePassword(
  id: string,
  passwordHash: string
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      passwordHash,
    },
  });
}
