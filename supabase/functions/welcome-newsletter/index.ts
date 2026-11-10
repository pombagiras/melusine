import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface WebhookPayload {
  type?: string;
  table?: string;
  schema?: string;
  record?: {
    id?: string;
    email?: string;
    source_page?: string;
    created_at?: string;
  };
  id?: string;
  email?: string;
  resend_api_key?: string;
}

Deno.serve(async (req: Request) => {
  // CORS Headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();

    const email = payload.record?.email || payload.email;
    const id = payload.record?.id || payload.id;

    if (!email) {
      return new Response(JSON.stringify({ error: "E-mail não informado no payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY") || payload.resend_api_key;
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const unsubscribeUrl = id 
      ? `https://pombagiras.com/descadastro/?id=${id}`
      : `https://pombagiras.com/descadastro/`;

    const htmlBody = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vinda à Carta das Pombagiras</title>
</head>
<body style="margin: 0; padding: 24px 16px; background-color: #050203; color: #FAF6EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #120a0e; border: 1px solid rgba(197, 160, 89, 0.3); border-radius: 12px; padding: 32px 28px;">
    
    <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid rgba(197, 160, 89, 0.2); padding-bottom: 20px;">
      <a href="https://pombagiras.com" style="text-decoration: none; color: #dfc07e; font-size: 18px; font-weight: bold; letter-spacing: 1px;">
        POMBAGIRAS.COM
      </a>
    </div>

    <h2 style="color: #dfc07e; font-size: 22px; margin-top: 0; margin-bottom: 16px; line-height: 1.3;">
      Sua presença firma esta encruzilhada.
    </h2>

    <p style="color: #e6e2d8; font-size: 15px; margin-bottom: 16px;">
      Sua inscrição na <strong>Carta das Pombagiras</strong> foi confirmada com sucesso e respeito.
    </p>

    <p style="color: #e6e2d8; font-size: 15px; margin-bottom: 20px;">
      Este é um canal direto e silencioso de partilha mensal. Aqui você receberá ensaios antropológicos, reflexões sobre a sabedoria ancestral das Guardiãs, estudos hermenêuticos e atualizações do nosso acervo livre.
    </p>

    <div style="background-color: rgba(197, 160, 89, 0.08); border-left: 3px solid #dfc07e; padding: 16px 18px; margin-bottom: 24px; border-radius: 4px;">
      <p style="margin: 0 0 8px 0; color: #dfc07e; font-weight: 600; font-size: 14px;">
        Nossos compromissos com você:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #e6e2d8; font-size: 14px; line-height: 1.6;">
        <li><strong>Periodicidade discreta:</strong> enviamos apenas uma carta por mês, sem encher sua caixa de entrada.</li>
        <li><strong>Zero publicidade comercial:</strong> não vendemos produtos, não veiculamos anúncios nem monetizamos sua fé.</li>
        <li><strong>Privacidade inviolável:</strong> seu e-mail nunca será compartilhado, vendido ou exposto publicamente.</li>
      </ul>
    </div>

    <p style="color: #e6e2d8; font-size: 15px; margin-bottom: 24px;">
      O acervo continua 100% gratuito e aberto para todas as pessoas em <a href="https://pombagiras.com" style="color: #dfc07e; text-decoration: underline;">pombagiras.com</a>.
    </p>

    <div style="margin-top: 28px; border-top: 1px solid rgba(197, 160, 89, 0.2); padding-top: 20px;">
      <p style="color: #FAF6EE; font-size: 15px; margin: 0 0 4px 0;">
        Com respeito e axé,
      </p>
      <p style="color: #dfc07e; font-size: 16px; font-weight: bold; margin: 0 0 2px 0;">
        Alexia Melusine
      </p>
      <p style="color: #96a3a8; font-size: 13px; margin: 0;">
        Curadora editorial &bull; Pombagiras.com
      </p>
    </div>

    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px dashed rgba(197, 160, 89, 0.2); text-align: center; font-size: 12px; color: #96a3a8;">
      Caso queira deixar de receber esta carta a qualquer momento, basta <a href="${unsubscribeUrl}" style="color: #dfc07e; text-decoration: underline;">cancelar sua inscrição com um clique</a>.
    </div>

  </div>
</body>
</html>`;

    const textBody = `POMBAGIRAS.COM — Carta das Pombagiras

Sua presença firma esta encruzilhada.

Sua inscrição na Carta das Pombagiras foi confirmada com sucesso e respeito.

Este é um canal direto e silencioso de partilha mensal. Aqui você receberá ensaios antropológicos, reflexões sobre a sabedoria ancestral das Guardiãs, estudos hermenêuticos e atualizações do nosso acervo livre.

Nossos compromissos com você:
- Periodicidade discreta: enviamos apenas uma carta por mês, sem encher sua caixa de entrada.
- Zero publicidade comercial: não vendemos produtos, não veiculamos anúncios nem monetizamos sua fé.
- Privacidade inviolável: seu e-mail nunca será compartilhado, vendido ou exposto publicamente.

O acervo continua 100% gratuito e aberto para todas as pessoas em https://pombagiras.com.

Com respeito e axé,
Alexia Melusine
Curadora editorial • Pombagiras.com

--------------------------------------------------
Para cancelar sua inscrição a qualquer momento, basta acessar o link abaixo:
${unsubscribeUrl}
`;

    // Envio via Resend API
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Alexia Melusine • Pombagiras.com <contato@pombagiras.com>",
        to: [email],
        subject: "Bem-vinda à Carta das Pombagiras",
        html: htmlBody,
        text: textBody,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
        }
      })
    });

    const resendData = await resendResp.json();

    if (!resendResp.ok) {
      console.error("Erro no Resend:", resendData);
      return new Response(JSON.stringify({ error: resendData }), {
        status: resendResp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, emailId: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("Erro na Edge Function:", err);
    return new Response(JSON.stringify({ error: err.message || err }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
