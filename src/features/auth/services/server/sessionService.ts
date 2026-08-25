import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

function getSecretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (
      process.env.NODE_ENV === "production"
    ) {
      // Nunca assina sessões com um segredo padrão conhecido em
      // produção — isso permitiria forjar login de qualquer
      // usuário. Melhor derrubar o app com um erro claro do que
      // rodar inseguro silenciosamente.
      throw new Error(
        "JWT_SECRET não está definida. Configure essa variável de ambiente antes de rodar em produção."
      );
    }

    return encoder.encode(
      "dev-secret-troque-em-producao"
    );
  }

  return encoder.encode(secret);
}

export const SESSION_COOKIE_NAME =
  "clinic_session";

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 7; // 7 dias

export const SESSION_MAX_AGE =
  SESSION_DURATION_SECONDS;

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function createSessionToken(
  payload: SessionPayload
) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      `${SESSION_DURATION_SECONDS}s`
    )
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      getSecretKey()
    );

    return payload as unknown as SessionPayload;

  } catch {

    return null;

  }
}
