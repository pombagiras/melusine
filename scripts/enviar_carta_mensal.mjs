/**
 * ==============================================================================
 * CARTA DAS POMBAGIRAS — SCRIPT DE DISPARO MENSAL
 * ==============================================================================
 * Uso:
 *   1. Visualizar prévia e contagem de inscritos:
 *      node scripts/enviar_carta_mensal.mjs --preview
 *
 *   2. Enviar teste exclusivo para você:
 *      node scripts/enviar_carta_mensal.mjs --test pambunjila1@gmail.com
 *
 *   3. Enviar para a lista real (com confirmação manual):
 *      node scripts/enviar_carta_mensal.mjs --send
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

// 1. Carregar variáveis do .env manualmente (sem dependências externas)
function loadEnv() {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        const k = trimmed.substring(0, idx).trim();
        const v = trimmed.substring(idx + 1).trim();
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

loadEnv();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qeayxaqcwajitbrzdhzp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!RESEND_API_KEY) {
  console.error('\n❌ Erro: RESEND_API_KEY não encontrada no ambiente ou .env.');
  process.exit(1);
}

// 2. Argumentos de linha de comando
const args = process.argv.slice(2);
const mode = args[0] || '--preview';

let cartaPath = path.resolve('cartas/carta_atual.html');
const fileArgIdx = args.indexOf('--file');
if (fileArgIdx > -1 && args[fileArgIdx + 1]) {
  cartaPath = path.resolve(args[fileArgIdx + 1]);
}

if (!fs.existsSync(cartaPath)) {
  console.error(`\n❌ Erro: Arquivo da carta não encontrado em: ${cartaPath}`);
  process.exit(1);
}

// 3. Ler carta e extrair metadados
const rawCartaHtml = fs.readFileSync(cartaPath, 'utf8');
const assuntoMatch = rawCartaHtml.match(/ASSUNTO:\s*([^\r\n]+)/i);
const assunto = assuntoMatch ? assuntoMatch[1].trim() : 'Carta das Pombagiras';

// Converter HTML em texto puro básico para fallback
function htmlToPlainText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();
}

// 4. Buscar inscritos ativos no Supabase
async function getSubscribers() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada no .env.');
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?select=id,email`, {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    }
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar inscritos no Supabase: ${res.status} ${await res.text()}`);
  }

  return await res.json();
}

// 5. Enviar e-mail individual via Resend
async function sendEmail({ to, subject, html, text, unsubscribeUrl }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Alexia Melusine • Pombagiras.com <contato@pombagiras.com>',
      to: [to],
      subject,
      html,
      text,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
      }
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

// 6. Execução dos modos
async function main() {
  console.log('\n======================================================');
  console.log('       CARTA DAS POMBAGIRAS — CENTRAL DE DISPARO       ');
  console.log('======================================================');
  console.log(`📄 Arquivo:   ${cartaPath}`);
  console.log(`📌 Assunto:   "${assunto}"`);
  console.log(`📧 Remetente: Alexia Melusine • Pombagiras.com <contato@pombagiras.com>`);

  // --- MODO 1: PREVIEW ---
  if (mode === '--preview') {
    let inscritos = [];
    try {
      inscritos = await getSubscribers();
      console.log(`👥 Inscritos ativos: ${inscritos.length} pessoa(s) na lista.`);
    } catch (e) {
      console.log(`⚠️ Nota: Supabase não consultado (${e.message})`);
    }

    console.log('\n--- PRÉVIA DO TEXTO (MODO LEITURA) ---');
    console.log(htmlToPlainText(rawCartaHtml).substring(0, 500) + '...\n');
    console.log('------------------------------------------------------');
    console.log('Comandos disponíveis:');
    console.log('  Para testar no seu e-mail:');
    console.log('    node scripts/enviar_carta_mensal.mjs --test seu-email@gmail.com\n');
    console.log('  Para enviar para toda a lista:');
    console.log('    node scripts/enviar_carta_mensal.mjs --send\n');
    return;
  }

  // --- MODO 2: TESTE PONTUAL ---
  if (mode === '--test') {
    const testEmail = args[1];
    if (!testEmail || !testEmail.includes('@')) {
      console.error('\n❌ Erro: Informe o e-mail de teste. Ex:');
      console.error('node scripts/enviar_carta_mensal.mjs --test pambunjila1@gmail.com');
      process.exit(1);
    }

    console.log(`\n🧪 MODO DE TESTE ATIVADO: enviando APENAS para ${testEmail}...`);
    const unsubscribeTestUrl = 'https://pombagiras.com/descadastro/?id=preview-teste';
    const finalHtml = rawCartaHtml.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeTestUrl);
    const finalText = htmlToPlainText(finalHtml);

    try {
      const result = await sendEmail({
        to: testEmail,
        subject: `[TESTE] ${assunto}`,
        html: finalHtml,
        text: finalText,
        unsubscribeUrl: unsubscribeTestUrl
      });

      console.log(`\n✅ E-mail de teste enviado com sucesso!`);
      console.log(`   ID no Resend: ${result.id}`);
      console.log(`   Verifique sua caixa de entrada em: ${testEmail}\n`);
    } catch (err) {
      console.error('\n❌ Falha ao enviar e-mail de teste:', err.message);
    }
    return;
  }

  // --- MODO 3: ENVIO REAL ---
  if (mode === '--send') {
    const inscritos = await getSubscribers();
    console.log(`\n🚨 ATENÇÃO: VOCÊ ESTÁ PRESTES A ENVIAR A CARTA PARA A LISTA REAL!`);
    console.log(`   Total de destinatários: ${inscritos.length} pessoa(s).`);
    console.log(`   Assunto: "${assunto}"\n`);

    if (inscritos.length === 0) {
      console.log('Nenhum inscrito na lista. Abortando envio.');
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const confirmacao = await new Promise(resolve => {
      rl.question('👉 Digite "CONFIRMAR" para iniciar o envio oficial: ', answer => {
        rl.close();
        resolve(answer.trim());
      });
    });

    if (confirmacao !== 'CONFIRMAR') {
      console.log('\n❌ Envio cancelado pelo usuário. Nenhuma mensagem foi disparada.\n');
      return;
    }

    console.log('\n🚀 Iniciando disparos individuais (um a um, sem expor e-mails)...');

    const logsDir = path.resolve('cartas/logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

    const logResults = [];
    let sucessos = 0;
    let falhas = 0;

    for (let i = 0; i < inscritos.length; i++) {
      const sub = inscritos[i];
      const unsubscribeUrl = `https://pombagiras.com/descadastro/?id=${sub.id}`;
      const finalHtml = rawCartaHtml.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeUrl);
      const finalText = htmlToPlainText(finalHtml);

      try {
        const res = await sendEmail({
          to: sub.email,
          subject: assunto,
          html: finalHtml,
          text: finalText,
          unsubscribeUrl
        });

        sucessos++;
        logResults.push({ id: sub.id, status: 'sucesso', resendId: res.id, timestamp: new Date().toISOString() });
        console.log(`   [${i + 1}/${inscritos.length}] Enviado com sucesso.`);
      } catch (err) {
        falhas++;
        logResults.push({ id: sub.id, status: 'erro', error: err.message, timestamp: new Date().toISOString() });
        console.error(`   [${i + 1}/${inscritos.length}] Erro ao enviar: ${err.message}`);
      }

      // Pausa de 120ms para respeitar limites do Resend
      await new Promise(r => setTimeout(r, 120));
    }

    const logFilename = `disparo_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(path.join(logsDir, logFilename), JSON.stringify({
      data: new Date().toISOString(),
      assunto,
      total: inscritos.length,
      sucessos,
      falhas,
      detalhes: logResults
    }, null, 2));

    console.log(`\n🎉 DISPARO CONCLUÍDO!`);
    console.log(`   Sucessos: ${sucessos}`);
    console.log(`   Falhas:   ${falhas}`);
    console.log(`   Log salvo em: cartas/logs/${logFilename}\n`);
  }
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err);
  process.exit(1);
});
