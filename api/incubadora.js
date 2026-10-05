// Função serverless (Vercel) — fonte real da tela "Incubadora & Jornada": uma
// planilha Google Sheets (somente leitura). Modelo da planilha e passo a passo
// em README.md § "Planilha da Incubadora" e em docs/planilha-incubadora/.
//
// Sem INCUBADORA_SHEET_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_KEY
// nas variáveis de ambiente do Vercel (estado de hoje), responde
// { configured: false } e o painel segue no mock de data/incubadora.js.
const { handleSource } = require("./_lib/source-proxy");
const { lerAbas } = require("./_lib/google-sheets");
const { montarIncubadora, ABAS_OBRIGATORIAS } = require("./_lib/montar-incubadora");

async function fetchReal(env) {
  const abas = await lerAbas({
    planilhaId: env.INCUBADORA_SHEET_ID,
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    chavePrivada: env.GOOGLE_SERVICE_ACCOUNT_KEY,
    abas: ABAS_OBRIGATORIAS,
  });
  return montarIncubadora(abas);
}

module.exports = async (req, res) => {
  await handleSource(res, {
    requiredEnv: ["INCUBADORA_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_KEY"],
    fetchReal,
    cacheSeconds: 60,
  });
};
