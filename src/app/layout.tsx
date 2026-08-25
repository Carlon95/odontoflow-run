import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fonte de destaque para títulos: geométrica e arredondada — soma
// modernidade sem o "peso clínico" de uma grotesca fria, o que
// combina com a proposta de reduzir a ansiedade típica de ambiente
// odontológico. Usada via a classe utilitária `font-heading`.
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OdontoFlow",
  description:
    "Gestão odontológica inteligente — prontuário, agenda e financeiro para a sua clínica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} h-full antialiased`}
    >
     <body className="min-h-full flex flex-col">
  {children}

  <Toaster
    richColors
    position="top-right"
    closeButton
  />
    </body>
    </html>
  );

  
}


