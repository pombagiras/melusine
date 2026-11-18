/**
 * ==============================================================================
 * CARTA DAS POMBAGIRAS — CENTRAL DE DISPARO MENSAL COM APROVAÇÃO
 * ==============================================================================
 * Uso:
 *   1. Visualizar prévia e contagem de inscritos:
 *      node scripts/enviar_carta_mensal.mjs --preview --file cartas/carta_2026_12.html
 *
 *   2. Enviar teste exclusivo para um endereço:
 *      node scripts/enviar_carta_mensal.mjs --test contato@pombagiras.com --file cartas/carta_2026_12.html
 *
 *   3. Garantir criação de rascunho para o mês seguinte (sem sobrescrever):
 *      node scripts/enviar_carta_mensal.mjs --ensure-next-draft [--month YYYY_MM]
 *
 *   4. Enviar rascunho para aprovação de Alexia (usado no dia 28):
 *      node scripts/enviar_carta_mensal.mjs --notify-draft [--file cartas/carta_YYYY_MM.html]
 *
 *   5. Marcar uma carta como aprovada:
 *      node scripts/enviar_carta_mensal.mjs --approve --file cartas/carta_2026_12.html
 *
 *   6. Enviar automaticamente no dia 1 (SOMENTE se APROVADA: SIM; senão avisa):
 *      node scripts/enviar_carta_mensal.mjs --send-if-approved [--file cartas/carta_YYYY_MM.html]
 *
 *   7. Verificar permissões e conectividade (zero envios):
 *      node scripts/enviar_carta_mensal.mjs --check-permissions [--file cartas/carta_YYYY_MM.html]
 *
 *   8. Envio manual interativo (requer digitar CONFIRMAR):
 *      node scripts/enviar_carta_mensal.mjs --send --file cartas/carta_2026_12.html
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ADMIN_EMAIL = 'contato@pombagiras.com';
const FROM_HEADER = 'Alexia Melusine • Pombagiras.com <contato@pombagiras.com>';
const CLOUD_FUNCTION_URL = 'https://qeayxaqcwajitbrzdhzp.supabase.co/functions/v1/monthly-newsletter';

// 1. Carregar variáveis do .env manualmente (sem expor valores)
function loadEnv() {
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const k = trimmed.substring(0, idx).trim();
      const v = trimmed.substring(idx + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

loadEnv();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qeayxaqcwajitbrzdhzp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 2. Argumentos e resolução de carta-alvo
const args = process.argv.slice(2);
const mode = args[0] || '--preview';
const forceSend = args.includes('--force');

function getArgValue(flag) {
  const idx = args.indexOf(flag);
  return idx > -1 && args[idx + 1] ? args[idx + 1] : null;
}

function getSaoPauloParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const year = Number(parts.find(p => p.type === 'year').value);
  const month = Number(parts.find(p => p.type === 'month').value);
  const day = Number(parts.find(p => p.type === 'day').value);
  return {
    year,
    month,
    day,
    yearStr: String(year),
    monthStr: String(month).padStart(2, '0'),
    dayStr: String(day).padStart(2, '0')
  };
}

function getCurrentMonthSaoPaulo() {
  const { yearStr, monthStr } = getSaoPauloParts();
  return `${yearStr}_${monthStr}`;
}

function getNextMonthSaoPaulo() {
  const { year, month } = getSaoPauloParts();
  if (month === 12) return `${year + 1}_01`;
  return `${year}_${String(month + 1).padStart(2, '0')}`;
}

function getTargetMonthForDraft() {
  const { day } = getSaoPauloParts();
  return day >= 20 ? getNextMonthSaoPaulo() : getCurrentMonthSaoPaulo();
}

function extractMonthFromPath(cartaPath) {
  const match = path.basename(cartaPath).match(/^carta_(\d{4}_\d{2})\.html$/i);
  return match ? match[1] : null;
}

function resolveCartaPath() {
  const explicitFile = getArgValue('--file');
  if (explicitFile) return path.resolve(explicitFile);

  const explicitMonth = getArgValue('--month');
  if (explicitMonth) {
    const clean = explicitMonth.replace('-', '_');
    return path.resolve(`cartas/carta_${clean}.html`);
  }

  if (mode === '--ensure-next-draft') {
    const nextYm = getNextMonthSaoPaulo();
    return path.resolve(`cartas/carta_${nextYm}.html`);
  }

  if (mode === '--notify-draft') {
    const ym = getTargetMonthForDraft();
    return path.resolve(`cartas/carta_${ym}.html`);
  }

  if (mode === '--send-if-approved' || mode === '--approve') {
    const ym = getCurrentMonthSaoPaulo();
    return path.resolve(`cartas/carta_${ym}.html`);
  }

  if (mode === '--check-permissions') {
    const currentMonthly = path.resolve(`cartas/carta_${getCurrentMonthSaoPaulo()}.html`);
    if (fs.existsSync(currentMonthly)) return currentMonthly;
    const nextMonthly = path.resolve(`cartas/carta_${getNextMonthSaoPaulo()}.html`);
    if (fs.existsSync(nextMonthly)) return nextMonthly;
    return currentMonthly;
  }

  return path.resolve('cartas/carta_atual.html');
}

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

function parseMeta(rawHtml) {
  const assuntoMatch = rawHtml.match(/ASSUNTO:\s*([^\r\n]+)/i);
  const mesMatch = rawHtml.match(/MES_REFERENCIA:\s*([^\r\n]+)/i);
  const aprovadaMatch = rawHtml.match(/APROVADA:\s*(SIM|NAO|NÃO)\b/i);
  const aprovadaVal = aprovadaMatch ? aprovadaMatch[1].toUpperCase() : 'NAO';
  return {
    assunto: assuntoMatch ? assuntoMatch[1].trim() : 'Carta das Pombagiras',
    mesReferencia: mesMatch ? mesMatch[1].trim() : null,
    aprovada: aprovadaVal === 'SIM'
  };
}

async function getSubscribers() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada no ambiente.');
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_subscribers?select=id,email`, {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  if (!res.ok) {
    throw new Error(`Erro ao consultar newsletter_subscribers: HTTP ${res.status}`);
  }
  return await res.json();
}

async function sendEmail({ to, subject, html, text, unsubscribeUrl }) {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY não configurada no ambiente.');
  }
  const payload = {
    from: FROM_HEADER,
    to: [to],
    subject,
    html,
    text
  };
  if (unsubscribeUrl) {
    payload.headers = {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

async function executeSubscribersDispatch(rawCartaHtml, assunto, mesReferencia, cartaPath) {
  const inscritos = await getSubscribers();
  if (inscritos.length === 0) {
    console.log('Nenhum inscrito na lista. Nenhum e-mail enviado.');
    return { total: 0, sucessos: 0, falhas: 0, logFilename: null };
  }

  const logsDir = path.resolve('cartas/logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  console.log(`\n🚀 Iniciando disparos individuais para ${inscritos.length} inscrito(s)...`);

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
      console.log(`   [${i + 1}/${inscritos.length}] Enviado com sucesso (ID: ${res.id}).`);
    } catch (err) {
      falhas++;
      logResults.push({ id: sub.id, status: 'erro', error: err.message, timestamp: new Date().toISOString() });
      console.error(`   [${i + 1}/${inscritos.length}] Falha no envio: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 120));
  }

  const logFilename = `disparo_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(path.join(logsDir, logFilename), JSON.stringify({
    data: new Date().toISOString(),
    arquivo: path.basename(cartaPath),
    mesReferencia,
    assunto,
    total: inscritos.length,
    sucessos,
    falhas,
    detalhes: logResults
  }, null, 2));

  console.log(`\n🎉 DISPARO CONCLUÍDO!`);
  console.log(`   Total de inscritos: ${inscritos.length}`);
  console.log(`   E-mails enviados:  ${sucessos}`);
  console.log(`   Falhas:            ${falhas}`);
  console.log(`   Log salvo em:      cartas/logs/${logFilename}\n`);

  return { total: inscritos.length, sucessos, falhas, logFilename };
}

function alreadySentForFile(cartaPath, mesReferencia) {
  const logsDir = path.resolve('cartas/logs');
  if (!fs.existsSync(logsDir)) return false;
  const base = path.basename(cartaPath);
  for (const name of fs.readdirSync(logsDir)) {
    if (!name.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(logsDir, name), 'utf8'));
      const sameTarget = (mesReferencia && data.mesReferencia === mesReferencia) || data.arquivo === base;
      if (sameTarget && data.sucessos > 0) return name;
    } catch {}
  }
  return false;
}

const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getRecentStudiesFromFeed(limit = 3) {
  const feedPath = path.resolve('feed.xml');
  if (!fs.existsSync(feedPath)) return [];
  try {
    const xml = fs.readFileSync(feedPath, 'utf8');
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let m;
    while ((m = itemRegex.exec(xml)) !== null && items.length < limit) {
      const block = m[1];
      const title = (block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
      const link = (block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '').trim();
      const desc = (block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || '').trim();
      if (title && link) {
        items.push({ title, link, desc });
      }
    }
    return items;
  } catch {
    return [];
  }
}

function buildNextDraftHtml(ym) {
  const [yearStr, monthStr] = ym.split('_');
  const monthIdx = Math.max(0, Math.min(11, Number(monthStr) - 1));
  const mesNome = MONTH_NAMES_PT[monthIdx] || monthStr;
  const mesRef = `${yearStr}-${monthStr}`;
  const estudos = getRecentStudiesFromFeed(3);

  const estudosSection = estudos.length > 0
    ? `
  <!-- Leituras Recentes do Acervo -->
  <div style="background-color: rgba(197, 160, 89, 0.08); border-left: 3px solid #dfc07e; padding: 18px 20px; margin: 26px 0; border-radius: 4px;">
    <p style="margin: 0 0 10px 0; color: #dfc07e; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
      Destaques recentes do nosso acervo público
    </p>
    <ul style="margin: 0; padding-left: 18px; color: #e6e2d8; font-size: 14.5px; line-height: 1.65;">
${estudos.map(item => `      <li style="margin-bottom: 10px;">
        <a href="${escapeHtml(item.link)}" style="color: #dfc07e; font-weight: 600; text-decoration: underline;">${escapeHtml(item.title)}</a>${item.desc ? `<br><span style="color: #cfcac0; font-size: 13.5px;">${escapeHtml(item.desc)}</span>` : ''}
      </li>`).join('\n')}
    </ul>
  </div>`
    : `
  <!-- Caixa de Destaque -->
  <div style="background-color: rgba(197, 160, 89, 0.08); border-left: 3px solid #dfc07e; padding: 18px 20px; margin: 26px 0; border-radius: 4px;">
    <p style="margin: 0; color: #FAF6EE; font-size: 14.5px; font-style: italic;">
      "Laroyê! Que a lucidez, o respeito às tradições e a soberania dos seus caminhos sustentem cada passo deste novo mês."
    </p>
  </div>`;

  return `<!-- 
================================================================================
CARTA DAS POMBAGIRAS — EDIÇÃO MENSAL DE ${mesNome.toUpperCase()} ${yearStr}
Edite apenas em revisão autorizada; não substituir cartas anteriores.
A variável {{UNSUBSCRIBE_URL}} será substituída automaticamente pelo link
exclusivo de cancelamento de cada pessoa assinante.
================================================================================
ASSUNTO: Carta das Pombagiras — ${mesNome} ${yearStr}: Caminhos de Estudo, Memória e Autonomia
MES_REFERENCIA: ${mesRef}
APROVADA: NAO
================================================================================
-->
<div style="max-width: 620px; margin: 0 auto; background-color: #120a0e; border: 1px solid rgba(197, 160, 89, 0.3); border-radius: 12px; padding: 36px 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #FAF6EE; line-height: 1.75;">

  <!-- Cabeçalho -->
  <div style="text-align: center; margin-bottom: 28px; border-bottom: 1px solid rgba(197, 160, 89, 0.2); padding-bottom: 22px;">
    <a href="https://pombagiras.com" style="text-decoration: none; color: #dfc07e; font-size: 19px; font-weight: bold; letter-spacing: 1.5px;">
      POMBAGIRAS.COM
    </a>
    <div style="font-size: 12px; color: #f7c6cc; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px;">
      Carta Mensal de Estudos &bull; ${mesNome} ${yearStr}
    </div>
  </div>

  <!-- Título -->
  <h1 style="color: #dfc07e; font-size: 23px; line-height: 1.35; margin-top: 0; margin-bottom: 20px; font-weight: 700;">
    ${mesNome} de ${yearStr}: Lucidez, Memória Ancestral e Caminhos Abertos
  </h1>

  <!-- Corpo -->
  <p style="color: #e6e2d8; font-size: 15px; margin-bottom: 16px;">
    Saudações fraternas a cada pessoa que caminha conosco nesta encruzilhada de estudo, memória e respeito.
  </p>

  <p style="color: #e6e2d8; font-size: 15px; margin-bottom: 16px;">
    Ao iniciarmos este novo mês, renovamos nossa partilha mensal com serenidade e rigor. No Pombagiras.com, cada texto nasce para desmistificar estigmas históricos e oferecer referências sólidas sobre as Guardiãs e os Guardiões nas tradições de matriz afro-brasileira.
  </p>

  <p style="color: #e6e2d8; font-size: 15px; margin-bottom: 16px;">
    Reafirmamos o compromisso inegociável da nossa casa: aqui não se vendem trabalhos espirituais, não se comercializa a fé e não se transforma o sagrado em balcão de promessas. Nosso acervo permanece 100% gratuito, independente e aberto para quem deseja estudar com dignidade.
  </p>
${estudosSection}

  <p style="color: #e6e2d8; font-size: 15px; margin-bottom: 26px;">
    Todos os estudos, tratados e novidades continuam abertos gratuitamente em <a href="https://pombagiras.com" style="color: #dfc07e; text-decoration: underline;">pombagiras.com</a>.
  </p>

  <!-- Assinatura -->
  <div style="margin-top: 32px; border-top: 1px solid rgba(197, 160, 89, 0.2); padding-top: 22px;">
    <p style="color: #FAF6EE; font-size: 15px; margin: 0 0 4px 0;">
      Laroyê, respeito e axé,
    </p>
    <p style="color: #dfc07e; font-size: 17px; font-weight: bold; margin: 0 0 2px 0;">
      Alexia Melusine
    </p>
    <p style="color: #96a3a8; font-size: 13px; margin: 0;">
      Pesquisadora independente e curadora editorial &bull; Pombagiras.com
    </p>
  </div>

  <!-- Rodapé com Link de Descadastro -->
  <div style="margin-top: 36px; padding-top: 18px; border-top: 1px dashed rgba(197, 160, 89, 0.2); text-align: center; font-size: 12px; color: #96a3a8; line-height: 1.6;">
    Você está recebendo esta mensagem porque se inscreveu na Carta das Pombagiras.<br>
    Caso não deseje mais receber nossas mensagens mensais, basta <a href="{{UNSUBSCRIBE_URL}}" style="color: #dfc07e; text-decoration: underline;">cancelar sua inscrição com um clique</a>.
  </div>

</div>
`;
}

function ensureNextDraft(cartaPath) {
  if (fs.existsSync(cartaPath)) {
    const existingHtml = fs.readFileSync(cartaPath, 'utf8');
    const meta = parseMeta(existingHtml);
    console.log(`\nℹ️ Rascunho ${path.basename(cartaPath)} já existe (APROVADA: ${meta.aprovada ? 'SIM' : 'NAO'}).`);
    console.log('   Arquivo preservado intacto (nenhuma sobrescrita realizada).');
    return { created: false, cartaPath, aprovada: meta.aprovada };
  }

  const ym = extractMonthFromPath(cartaPath) || getNextMonthSaoPaulo();
  const dir = path.dirname(cartaPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const draftHtml = buildNextDraftHtml(ym);
  fs.writeFileSync(cartaPath, draftHtml, 'utf8');
  console.log(`\n📝 Novo rascunho criado com sucesso: ${cartaPath}`);
  console.log('   Status inicial: APROVADA: NAO');
  return { created: true, cartaPath, aprovada: false };
}

function saveCloudDispatchLog(data) {
  const logsDir = path.resolve('cartas/logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  const logFilename = `disparo_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(path.join(logsDir, logFilename), JSON.stringify({
    data: new Date().toISOString(),
    origem: 'supabase-edge-function',
    arquivo: data.arquivo,
    mesReferencia: data.mesReferencia,
    assunto: data.assunto,
    total: data.total,
    sucessos: data.sucessos,
    falhas: data.falhas,
    detalhes: data.detalhes || []
  }, null, 2));
  console.log(`   Log salvo em: cartas/logs/${logFilename}`);
  return logFilename;
}

async function invokeCloudNewsletter({ mode: cloudMode, month, force = false, source }) {
  const payload = { mode: cloudMode, force, source };
  if (month) payload.month = month;

  const resp = await fetch(CLOUD_FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Resposta inválida da nuvem (HTTP ${resp.status}): ${text}`);
  }
  if (!resp.ok) {
    throw new Error(data.error || `Erro na Edge Function (HTTP ${resp.status})`);
  }
  return data;
}

async function runCloudMode(cliMode, cartaPath) {
  const modeMap = {
    '--check-permissions': 'check',
    '--notify-draft': 'notify-draft',
    '--send-if-approved': 'send-if-approved'
  };
  const cloudMode = modeMap[cliMode];
  const explicitMonthArg = getArgValue('--month');
  const explicitFileArg = getArgValue('--file');
  const monthFromPath = extractMonthFromPath(cartaPath);
  const month = explicitMonthArg
    ? explicitMonthArg.replace('-', '_')
    : (explicitFileArg && monthFromPath ? monthFromPath : monthFromPath || undefined);

  const source = process.env.GITHUB_ACTIONS ? 'github-actions' : 'local-cli-cloud-fallback';
  console.log(`\n☁️ Chaves locais ausentes — executando via nuvem (${CLOUD_FUNCTION_URL}) [modo: ${cloudMode}]...`);

  const data = await invokeCloudNewsletter({ mode: cloudMode, month, force: forceSend, source });

  if (cloudMode === 'check') {
    console.log(`   Data SP (nuvem):            ${data.saoPauloDate}`);
    console.log(`   Carta analisada:            ${data.arquivo} (encontrada: ${data.carta?.found ? 'SIM' : 'NAO'})`);
    console.log(`   Aprovada no GitHub:         ${data.carta?.aprovada ? 'SIM' : 'NAO'}`);
    console.log(`   Placeholder descadastro:    ${data.carta?.hasUnsubscribePlaceholder ? 'OK' : 'FALHA'}`);
    console.log(`   RESEND_API_KEY (nuvem):     ${data.env?.resendKeyConfigured ? 'OK' : 'FALTANDO'}`);
    console.log(`   SUPABASE_SERVICE (nuvem):   ${data.env?.supabaseServiceRoleConfigured ? 'OK' : 'FALTANDO'}`);
    console.log(`   Autenticação Resend:        ${data.env?.resendAuth || 'FALHA'}`);
    console.log(`   Inscritos no Supabase:      ${data.subscriberCount}`);
    console.log(`   Logs na nuvem neste mês:    ${Array.isArray(data.logs) ? data.logs.length : 0}\n`);
    if (!data.ok) process.exit(1);
    console.log('✅ VERIFICAÇÃO NA NUVEM CONCLUÍDA (0 e-mails enviados).\n');
    return;
  }

  if (cloudMode === 'notify-draft') {
    if (data.skipped) {
      console.log(`ℹ️ Notificação do dia 28 já registrada na nuvem para ${data.mesReferencia} (${data.reason}).`);
      return;
    }
    if (data.cartaFound === false) {
      console.log(`⚠️ Rascunho ${data.arquivo} não encontrado no GitHub; aviso enviado para ${ADMIN_EMAIL}.`);
      return;
    }
    console.log(`✅ Notificação do dia 28 enviada para ${ADMIN_EMAIL} (Aprovada: ${data.aprovada ? 'SIM' : 'NAO'}, Resend ID: ${data.resendId}).`);
    return;
  }

  if (cloudMode === 'send-if-approved') {
    if (data.skipped) {
      console.log(`ℹ️ Envio do mês ${data.mesReferencia} já executado anteriormente (${data.reason}). Abortando duplicidade.`);
      return;
    }
    if (data.blocked) {
      console.log(`🛑 BLOQUEADO na nuvem (${data.reason}) para ${data.arquivo}. Nenhum e-mail enviado aos inscritos.`);
      return;
    }
    console.log(`\n🎉 DISPARO NA NUVEM CONCLUÍDO!`);
    console.log(`   Arquivo:   ${data.arquivo}`);
    console.log(`   Total:     ${data.total}`);
    console.log(`   Sucessos:  ${data.sucessos}`);
    console.log(`   Falhas:    ${data.falhas}`);
    if (data.total > 0) {
      saveCloudDispatchLog(data);
    }
  }
}

async function main() {
  const cartaPath = resolveCartaPath();

  console.log('\n======================================================');
  console.log('       CARTA DAS POMBAGIRAS — CENTRAL DE DISPARO       ');
  console.log('======================================================');
  console.log(`📄 Arquivo:   ${cartaPath}`);

  if (mode === '--ensure-next-draft') {
    ensureNextDraft(cartaPath);
    return;
  }

  if (['--check-permissions', '--notify-draft', '--send-if-approved'].includes(mode) && (!RESEND_API_KEY || !SUPABASE_SERVICE_ROLE_KEY)) {
    await runCloudMode(mode, cartaPath);
    return;
  }

  if (!fs.existsSync(cartaPath)) {
    if (mode === '--send-if-approved') {
      console.log('⚠️ Nenhuma carta encontrada para este mês. Nada foi enviado aos inscritos.');
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: '[AVISO] Envio do dia 1 não executado: rascunho não encontrado',
        html: `<p>O envio automático do dia 1 foi cancelado porque o arquivo esperado (<code>${path.basename(cartaPath)}</code>) ainda não existe. Nenhum e-mail foi enviado aos inscritos.</p>`,
        text: `O envio automático do dia 1 foi cancelado porque o arquivo ${path.basename(cartaPath)} não existe. Nenhum e-mail foi enviado.`
      });
      return;
    }
    console.error(`\n❌ Erro: Arquivo da carta não encontrado em: ${cartaPath}`);
    process.exit(1);
  }

  const rawCartaHtml = fs.readFileSync(cartaPath, 'utf8');
  const { assunto, mesReferencia, aprovada } = parseMeta(rawCartaHtml);

  console.log(`📌 Assunto:   "${assunto}"`);
  console.log(`🗓️ Mês ref.:  ${mesReferencia || '(não definido)'}`);
  console.log(`✅ Aprovada:  ${aprovada ? 'SIM' : 'NAO'}`);

  // --- MODO CHECK-PERMISSIONS (SOMENTE LEITURA + CONECTIVIDADE, ZERO ENVIOS) ---
  if (mode === '--check-permissions') {
    console.log('\n🔐 Verificando permissões e conectividade (nenhum e-mail será enviado)...');
    const checks = {
      envResendKey: Boolean(RESEND_API_KEY),
      envSupabaseKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
      cartaRead: Boolean(rawCartaHtml && rawCartaHtml.includes('{{UNSUBSCRIBE_URL}}')),
      cartaLogsWrite: false,
      supabaseRead: false,
      supabaseCount: 0,
      resendAuth: false
    };

    try {
      const logsDir = path.resolve('cartas/logs');
      fs.mkdirSync(logsDir, { recursive: true });
      const probe = path.join(logsDir, '.perm_probe');
      fs.writeFileSync(probe, 'ok', 'utf8');
      fs.unlinkSync(probe);
      checks.cartaLogsWrite = true;
    } catch (e) {
      console.error(`❌ Falha de escrita em cartas/logs: ${e.message}`);
    }

    try {
      const inscritos = await getSubscribers();
      checks.supabaseRead = true;
      checks.supabaseCount = inscritos.length;
    } catch (e) {
      console.error(`❌ Falha ao consultar Supabase: ${e.message}`);
    }

    try {
      const resp = await fetch('https://api.resend.com/domains', {
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
      });
      const bodyText = await resp.text();
      if (resp.ok) {
        checks.resendAuth = 'OK (acesso completo)';
      } else if (resp.status === 401 && /restricted.*send|only send/i.test(bodyText)) {
        checks.resendAuth = 'OK (chave válida com escopo sending_access)';
      } else {
        throw new Error(`HTTP ${resp.status} ${bodyText}`);
      }
    } catch (e) {
      console.error(`❌ Falha ao autenticar no Resend: ${e.message}`);
    }

    console.log(`   .env RESEND_API_KEY:        ${checks.envResendKey ? 'OK' : 'FALTANDO'}`);
    console.log(`   .env SUPABASE_SERVICE_ROLE: ${checks.envSupabaseKey ? 'OK' : 'FALTANDO'}`);
    console.log(`   Leitura da carta:           ${checks.cartaRead ? 'OK' : 'FALHA'}`);
    console.log(`   Escrita em cartas/logs:     ${checks.cartaLogsWrite ? 'OK' : 'FALHA'}`);
    console.log(`   Leitura Supabase inscritos:  ${checks.supabaseRead ? `OK (${checks.supabaseCount})` : 'FALHA'}`);
    console.log(`   Autenticação Resend (API):  ${checks.resendAuth || 'FALHA'}\n`);

    const allOk = checks.envResendKey && checks.envSupabaseKey && checks.cartaRead && checks.cartaLogsWrite && checks.supabaseRead && Boolean(checks.resendAuth);
    if (!allOk) process.exit(1);
    console.log('✅ TODAS AS PERMISSÕES E CONECTIVIDADES CONFIRMADAS (0 e-mails enviados).\n');
    return;
  }

  // --- MODO APPROVE ---
  if (mode === '--approve') {
    let updated = rawCartaHtml;
    if (/APROVADA:\s*(SIM|NAO|NÃO)\b/i.test(updated)) {
      updated = updated.replace(/APROVADA:\s*(SIM|NAO|NÃO)\b/i, 'APROVADA: SIM');
    } else if (/ASSUNTO:/i.test(updated)) {
      updated = updated.replace(/(ASSUNTO:[^\r\n]+)/i, '$1\nAPROVADA: SIM');
    } else {
      updated = `<!--\nAPROVADA: SIM\n-->\n` + updated;
    }
    fs.writeFileSync(cartaPath, updated, 'utf8');
    console.log(`\n✅ Carta marcada com APROVADA: SIM em ${path.basename(cartaPath)}.`);
    return;
  }

  // --- MODO PREVIEW ---
  if (mode === '--preview') {
    try {
      const inscritos = await getSubscribers();
      console.log(`👥 Inscritos ativos em newsletter_subscribers: ${inscritos.length}`);
    } catch (e) {
      console.log(`⚠️ Nota: Supabase não consultado (${e.message})`);
    }
    console.log('\n--- PRÉVIA DO TEXTO ---');
    console.log(htmlToPlainText(rawCartaHtml));
    console.log('------------------------------------------------------\n');
    return;
  }

  // --- MODO TEST ---
  if (mode === '--test') {
    const testEmail = args[1] && args[1].includes('@') ? args[1] : ADMIN_EMAIL;
    console.log(`\n🧪 MODO DE TESTE ATIVADO: enviando APENAS para ${testEmail}...`);
    const unsubscribeTestUrl = 'https://pombagiras.com/descadastro/?id=preview-teste';
    const finalHtml = rawCartaHtml.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeTestUrl);
    const finalText = htmlToPlainText(finalHtml);

    const result = await sendEmail({
      to: testEmail,
      subject: `[TESTE] ${assunto}`,
      html: finalHtml,
      text: finalText,
      unsubscribeUrl: unsubscribeTestUrl
    });

    console.log(`\n✅ E-mail de teste enviado com sucesso!`);
    console.log(`   Destinatário: ${testEmail}`);
    console.log(`   ID no Resend: ${result.id}\n`);
    return;
  }

  // --- MODO NOTIFY-DRAFT (DIA 28) ---
  if (mode === '--notify-draft') {
    console.log(`\n📝 Enviando notificação do dia 28 para ${ADMIN_EMAIL}...`);
    const unsubscribeTestUrl = 'https://pombagiras.com/descadastro/?id=rascunho-aprovacao';
    const statusTexto = aprovada ? 'APROVADA (pronta para o disparo automático do dia 1)' : 'AGUARDANDO APROVAÇÃO';
    const instrucaoTexto = aprovada
      ? 'Esta edição já está marcada com APROVADA: SIM. O envio ocorrerá automaticamente no dia 1 às 09:00.'
      : 'Altere para APROVADA: SIM no repositório ou peça ao Antigravity antes do dia 1 para liberar o envio automático.';
    const banner = `<div style="max-width:620px;margin:0 auto 14px auto;padding:12px 16px;background:#2a151c;border:1px solid #dfc07e;border-radius:8px;color:#FAF6EE;font-family:sans-serif;font-size:13px;">
      <strong>${aprovada ? 'CARTA JÁ APROVADA PARA O DIA 1' : 'RASCUNHO PARA APROVAÇÃO (DIA 1)'}</strong><br>
      Arquivo: <code>${path.basename(cartaPath)}</code> &bull; Status atual: <strong>${statusTexto}</strong><br>
      ${instrucaoTexto}
    </div>\n`;
    const finalHtml = banner + rawCartaHtml.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeTestUrl);
    const finalText = `${aprovada ? 'CARTA PRONTA PARA O DIA 1' : 'RASCUNHO PARA APROVAÇÃO'} (${path.basename(cartaPath)})\n${instrucaoTexto}\n\n` + htmlToPlainText(rawCartaHtml);

    const result = await sendEmail({
      to: ADMIN_EMAIL,
      subject: aprovada ? `[PRONTA P/ DIA 1 — APROVADA] ${assunto}` : `[RASCUNHO P/ APROVAÇÃO] ${assunto}`,
      html: finalHtml,
      text: finalText,
      unsubscribeUrl: unsubscribeTestUrl
    });
    console.log(`✅ Notificação enviada para ${ADMIN_EMAIL} (Resend ID: ${result.id}).`);
    return;
  }

  // --- MODO SEND-IF-APPROVED (DIA 1 AUTOMÁTICO) ---
  if (mode === '--send-if-approved') {
    if (!aprovada) {
      console.log('\n🛑 BLOQUEADO: Carta NÃO está marcada com APROVADA: SIM. Nenhum e-mail foi enviado aos inscritos.');
      const aviso = await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[AVISO] Carta do mês não enviada (${mesReferencia || path.basename(cartaPath)}) — Aguardando aprovação`,
        html: `<p>Olá Alexia,</p><p>O agendamento do dia 1 foi executado, mas a carta <strong>${assunto}</strong> (<code>${path.basename(cartaPath)}</code>) ainda está com <code>APROVADA: NAO</code>.</p><p><strong>Nenhum e-mail foi enviado aos inscritos.</strong> Caso queira enviá-la, aprove no chat com o Antigravity.</p>`,
        text: `A carta ${assunto} (${path.basename(cartaPath)}) está com APROVADA: NAO. Nenhum e-mail foi enviado aos inscritos.`
      });
      console.log(`📧 Aviso de bloqueio enviado para ${ADMIN_EMAIL} (Resend ID: ${aviso.id}).`);
      return;
    }

    const prevLog = !forceSend && alreadySentForFile(cartaPath, mesReferencia);
    if (prevLog) {
      console.log(`\nℹ️ Esta carta já foi enviada anteriormente (log: cartas/logs/${prevLog}). Abortando duplicidade.`);
      return;
    }

    const summary = await executeSubscribersDispatch(rawCartaHtml, assunto, mesReferencia, cartaPath);
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `[RELATÓRIO DE ENVIO] ${assunto}`,
      html: `<p>Envio mensal concluído para <code>${path.basename(cartaPath)}</code>.</p><ul><li><strong>Total de inscritos:</strong> ${summary.total}</li><li><strong>E-mails enviados com sucesso:</strong> ${summary.sucessos}</li><li><strong>Falhas:</strong> ${summary.falhas}</li><li><strong>Log:</strong> <code>cartas/logs/${summary.logFilename || 'n/a'}</code></li></ul>`,
      text: `Envio mensal concluído (${path.basename(cartaPath)}): Total=${summary.total}, Enviados=${summary.sucessos}, Falhas=${summary.falhas}.`
    });
    console.log(`📧 Relatório final enviado para ${ADMIN_EMAIL}.`);
    return;
  }

  // --- MODO SEND MANUAL INTERATIVO ---
  if (mode === '--send') {
    const inscritos = await getSubscribers();
    console.log(`\n🚨 ATENÇÃO: VOCÊ ESTÁ PRESTES A ENVIAR A CARTA PARA A LISTA REAL!`);
    console.log(`   Total de destinatários: ${inscritos.length} pessoa(s).`);
    console.log(`   Assunto: "${assunto}"\n`);

    if (inscritos.length === 0) {
      console.log('Nenhum inscrito na lista. Abortando envio.');
      return;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
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

    await executeSubscribersDispatch(rawCartaHtml, assunto, mesReferencia, cartaPath);
  }
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});
