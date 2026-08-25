interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  const from =
    process.env.EMAIL_FROM ??
    "OdontoFlow <onboarding@resend.dev>";

  // Sem provedor configurado: não trava o fluxo, só mostra o
  // e-mail no console do servidor — útil pra testar localmente
  // sem precisar de conta em nenhum serviço de e-mail ainda.
  if (!apiKey) {
    console.log(
      "\n==================== E-MAIL (modo desenvolvimento) ===================="
    );
    console.log(
      "RESEND_API_KEY não configurada — e-mail não foi enviado de verdade."
    );
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log(html);
    console.log(
      "=========================================================================\n"
    );

    return;
  }

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();

    console.error(
      "Erro ao enviar e-mail:",
      text
    );

    throw new Error(
      "Erro ao enviar e-mail."
    );
  }
}
