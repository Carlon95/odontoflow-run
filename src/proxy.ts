import { NextRequest, NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "./features/auth/services/server/sessionService";

// Rotas acessíveis sem estar logado. "/register" fica aqui
// porque também precisa funcionar no cadastro inicial (quando
// ainda não existe nenhum usuário no banco).
const NO_AUTH_REQUIRED_PATHS = [
  "/login",
  "/register",
  "/esqueci-senha",
  "/redefinir-senha",
];

// Dessas, só "/login" deve "empurrar" quem já está logado
// pra fora — "/register" continua acessível pra um admin
// logado cadastrar novos usuários da equipe.
const REDIRECT_IF_AUTHENTICATED_PATHS = [
  "/login",
];

const PUBLIC_API_PREFIXES = [
  "/api/auth",
  // O cron tem seu próprio mecanismo de autorização (chave
  // secreta no header Authorization), não usa cookie de sessão
  // — quem chama é um agendador externo, não uma pessoa logada.
  "/api/cron",
];

export async function proxy(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  const isNoAuthRequired =
    NO_AUTH_REQUIRED_PATHS.includes(
      pathname
    );

  const isPublicApi =
    PUBLIC_API_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );

  const token = request.cookies.get(
    SESSION_COOKIE_NAME
  )?.value;

  const session = token
    ? await verifySessionToken(token)
    : null;

  if (
    !session &&
    !isNoAuthRequired &&
    !isPublicApi
  ) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  if (
    session &&
    REDIRECT_IF_AUTHENTICATED_PATHS.includes(
      pathname
    )
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Além das exceções originais (_next/static, _next/image,
    // favicon.ico), passamos a excluir também: arquivos estáticos
    // servidos de /public (qualquer extensão de imagem — cobre
    // /brand/*.png, os .svg padrão do Next etc.) e as rotas de
    // ícone geradas pelo App Router (icon.png, apple-icon.png).
    // Sem isso, um visitante sem sessão pedindo uma dessas
    // imagens (ex: o logo na tela de login) cai no redirect para
    // /login e recebe HTML no lugar da imagem.
    "/((?!_next/static|_next/image|icon\\.png|apple-icon\\.png|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
