// Função serverless (Vercel) — fonte real da tela "Incubadora & Jornada": uma
// planilha Google Sheets (somente leitura). Modelo da planilha e passo a passo
// em README.md § "Planilha da Incubadora" e em docs/planilha-incubadora/.
//
// Sem INCUBADORA_SHEET_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_KEY
// nas variáveis de ambiente do Vercel (estado de hoje), responde
// { configured: false } e o painel segue no mock de data/incubadora.js.
const { handleSource } = require("./_lib/source-proxy");
const { lerAbas } = require("./_lib/google-sheets");
const { montarIncubadora, ABAS_LIDAS } = require("./_lib/montar-incubadora");

// "Hoje" no fuso do Parque (o servidor do Vercel roda em UTC): é o que define
// o mês corrente do painel.
function hojeEmSaoPaulo() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

async function fetchReal(env) {
  const abas = await lerAbas({
    planilhaId: env.INCUBADORA_SHEET_ID,
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    chavePrivada: env.GOOGLE_SERVICE_ACCOUNT_KEY,
    abas: ABAS_LIDAS,
  });
  const resultado = montarIncubadora(abas, hojeEmSaoPaulo());
  // Botão "Abrir planilha" do painel. A planilha continua privada: o link só
  // abre para quem ela foi compartilhada.
  resultado.data.planilhaUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(env.INCUBADORA_SHEET_ID)}/edit`;
  return resultado;
}

module.exports = async (req, res) => {
  await handleSource(res, {
    requiredEnv: ["INCUBADORA_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_KEY"],
    fetchReal,
    cacheSeconds: 60,
  });
};
