import { cookies } from "next/headers";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "./sessionService";

import { findById } from "../../repositories/userRepository";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE_NAME
  )?.value;

  if (!token) return null;

  const payload = await verifySessionToken(
    token
  );

  if (!payload) return null;

  const user = await findById(
    payload.userId
  );

  if (!user) return null;

  return user;
}
