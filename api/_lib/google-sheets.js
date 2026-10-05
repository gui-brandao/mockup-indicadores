// Leitura de planilhas Google Sheets com conta de serviço — sem dependências
// (o projeto não tem package.json): o JWT RS256 é assinado com o `crypto` do
// Node e as chamadas usam o `fetch` nativo. Somente leitura (escopo
// spreadsheets.readonly); a planilha precisa estar compartilhada com o e-mail
// da conta de serviço.
const crypto = require("crypto");

const ESCOPO = "https://www.googleapis.com/auth/spreadsheets.readonly";
const URL_TOKEN = "https://oauth2.googleapis.com/token";

function base64url(entrada) {
  return Buffer.from(entrada).toString("base64url");
}

// Variáveis de ambiente costumam guardar a chave com "\n" literais (e às
// vezes entre aspas) — volta para o formato PEM.
function normalizarChave(chave) {
  return String(chave).trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n");
}

async function obterToken(email, chavePrivada) {
  const agora = Math.floor(Date.now() / 1000);
  const cabecalho = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const corpo = base64url(JSON.stringify({ iss: email, scope: ESCOPO, aud: URL_TOKEN, iat: agora, exp: agora + 3600 }));
  const assinatura = crypto.createSign("RSA-SHA256").update(`${cabecalho}.${corpo}`).sign(normalizarChave(chavePrivada));
  const resposta = await fetch(URL_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${cabecalho}.${corpo}.${base64url(assinatura)}`,
    }),
  });
  if (!resposta.ok) throw new Error(`Google OAuth respondeu ${resposta.status} — confira e-mail e chave da conta de serviço`);
  return (await resposta.json()).access_token;
}

// Primeira linha da aba = cabeçalho (minúsculo); cada linha seguinte vira um
// objeto. A Sheets API omite células vazias no fim da linha — viram "".
function abaParaObjetos(valores) {
  const [cabecalho = [], ...linhas] = valores || [];
  const colunas = cabecalho.map((c) => String(c).trim().toLowerCase());
  return linhas
    .filter((linha) => linha.some((v) => String(v ?? "").trim() !== ""))
    .map((linha) => Object.fromEntries(colunas.map((nome, i) => [nome, linha[i] ?? ""])));
}

// Devolve { NomeDaAba: [ { coluna: valor } ] } para as abas pedidas.
async function lerAbas({ planilhaId, email, chavePrivada, abas }) {
  const token = await obterToken(email, chavePrivada);
  const parametros = new URLSearchParams({ valueRenderOption: "UNFORMATTED_VALUE", dateTimeRenderOption: "SERIAL_NUMBER" });
  abas.forEach((nome) => parametros.append("ranges", nome));
  const resposta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(planilhaId)}/values:batchGet?${parametros}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (resposta.status === 403 || resposta.status === 404) {
    throw new Error(`Google Sheets respondeu ${resposta.status} — confira o ID e se a planilha está compartilhada com a conta de serviço`);
  }
  if (!resposta.ok) throw new Error(`Google Sheets respondeu ${resposta.status}`);
  const { valueRanges = [] } = await resposta.json();
  return Object.fromEntries(abas.map((nome, i) => [nome, abaParaObjetos(valueRanges[i] && valueRanges[i].values)]));
}

module.exports = { lerAbas, abaParaObjetos, normalizarChave };
