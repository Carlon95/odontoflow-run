import type { NextConfig } from "next";

const securityHeaders = [
  // Impede que o site seja carregado dentro de um <iframe> em
  // outro domínio (proteção contra clickjacking).
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Impede que o navegador tente "adivinhar" o tipo de um
  // arquivo diferente do Content-Type declarado.
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Não envia a URL completa de origem em requisições
  // cross-site, só a origem.
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Desliga o acesso a APIs sensíveis do navegador (câmera,
  // microfone, geolocalização) que este app não usa.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto explicitamente — sem isso, o
  // Turbopack pode ficar em dúvida se encontrar outro
  // package-lock.json em alguma pasta acima (ex: na pasta do
  // usuário do Windows), e mostra um aviso no terminal.
  turbopack: {
    root: __dirname,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
