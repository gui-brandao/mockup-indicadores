// Função serverless (Vercel) — fonte real do bloco "Operação (O.S.)".
//
// Sem OS_API_BASE_URL/OS_API_TOKEN configuradas nas variáveis de ambiente do
// Vercel (estado de hoje), responde { configured: false } e o painel segue
// 100% no mock de data/os.js — nenhuma mudança visível.
//
// Quando o endpoint/autenticação reais do Sistema de O.S. existirem,
// implementar fetchReal() abaixo moldando a resposta para o MESMO formato de
// window.APP_DATA.os (ver data/os.js):
//   { months, monthLabels,
//     series: { registros },
//     snapshot: { referencia, total, emAberto, finalizados, urgentes,
//                 semResponsavel, mediaDia, porStatus: [{ status, valor }],
//                 urgenciaPct, tendencia: { dias, valores } },
//     categorias: [{ categoria, valor }],
//     tempoMedioResolucaoDias }
// É esse contrato — não a origem do dado — que views/operacao.js e
// views/visao-geral.js enxergam; mantendo-o, nenhuma view muda.
const { handleSource } = require("./_lib/source-proxy");

async function fetchReal(baseUrl, token) {
  // TODO: chamada real ao Sistema de O.S., ex.:
  //   const r = await fetch(`${baseUrl}/indicadores`, { headers: { Authorization: `Bearer ${token}` } });
  //   if (!r.ok) throw new Error(`Sistema de O.S. respondeu ${r.status}`);
  //   const raw = await r.json();
  //   return moldarParaFormatoDoPainel(raw); // ver contrato no comentário acima
  throw new Error("Integração real do Sistema de O.S. ainda não implementada");
}

module.exports = async (req, res) => {
  await handleSource(res, { baseUrlEnv: "OS_API_BASE_URL", tokenEnv: "OS_API_TOKEN", fetchReal });
};
