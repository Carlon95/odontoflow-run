function normalizePhone(phone: string) {
  // Remove tudo que não for dígito e garante o "55" na frente
  // (código do Brasil) se a pessoa não tiver digitado.
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("55")) {
    return digits;
  }

  return `55${digits}`;
}

function getConfig() {
  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN;

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const apiVersion =
    process.env.WHATSAPP_API_VERSION ??
    "v22.0";

  if (!accessToken || !phoneNumberId) {
    return null;
  }

  return {
    accessToken,
    phoneNumberId,
    endpoint: `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
  };
}

async function callWhatsAppApi(
  payload: Record<string, unknown>
) {
  const config = getConfig();

  // Sem provedor configurado: não trava o fluxo, só mostra a
  // mensagem no console — útil pra testar localmente sem
  // precisar de conta na Meta ainda.
  if (!config) {
    console.log(
      "\n==================== WHATSAPP (modo desenvolvimento) ===================="
    );
    console.log(
      "WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID não configuradas — mensagem não foi enviada de verdade."
    );
    console.log(
      JSON.stringify(payload, null, 2)
    );
    console.log(
      "============================================================================\n"
    );

    return;
  }

  const response = await fetch(
    config.endpoint,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    const errorCode =
      data?.error?.code;

    console.error(
      "Erro ao enviar WhatsApp:",
      data
    );

    // Erro clássico da Meta quando se tenta mandar texto livre
    // fora da janela de 24h de atendimento — precisa de template
    // aprovado nesse caso.
    if (errorCode === 131047) {
      throw new Error(
        "Não é possível enviar texto livre: o paciente não te enviou mensagem nas últimas 24h. Peça para o paciente mandar uma mensagem primeiro, ou use um template aprovado."
      );
    }

    throw new Error(
      data?.error?.message ||
        "Erro ao enviar mensagem no WhatsApp."
    );
  }
}

interface SendTextParams {
  to: string;
  body: string;
}

/**
 * Texto livre. Só funciona dentro da janela de 24h após a
 * última mensagem recebida do paciente — é a regra da própria
 * Meta, não uma limitação desta integração.
 */
export async function sendWhatsAppMessage({
  to,
  body,
}: SendTextParams) {
  await callWhatsAppApi({
    messaging_product: "whatsapp",
    to: normalizePhone(to),
    type: "text",
    text: { body },
  });
}

interface SendTemplateParams {
  to: string;
  templateName: string;
  languageCode?: string;
  bodyParams: string[];
}

/**
 * Mensagem via template aprovado pela Meta — necessária para
 * qualquer mensagem que a clínica inicia (fora da janela de
 * 24h), como os lembretes automáticos de consulta.
 */
export async function sendWhatsAppTemplate({
  to,
  templateName,
  languageCode = "pt_BR",
  bodyParams,
}: SendTemplateParams) {
  await callWhatsAppApi({
    messaging_product: "whatsapp",
    to: normalizePhone(to),
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        {
          type: "body",
          parameters: bodyParams.map(
            (text) => ({
              type: "text",
              text,
            })
          ),
        },
      ],
    },
  });
}
