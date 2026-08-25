import Image from "next/image";

import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div className="shadow-elegant w-full max-w-md rounded-2xl border bg-white p-9">

      <div className="mb-8 flex flex-col items-center text-center">

        <Image
          src="/brand/icon-square.png"
          alt="OdontoFlow"
          width={56}
          height={56}
          priority
          className="mb-4 h-14 w-14"
        />

        <h1 className="font-heading text-2xl font-bold text-slate-800">
          Entrar
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Acesse a gestão odontológica da sua clínica.
        </p>

      </div>

      <LoginForm />

    </div>
  );
}
