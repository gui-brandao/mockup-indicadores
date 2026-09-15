// Função serverless (Vercel) — fonte real do bloco "Espaços & Agenda".
//
// Sem AGENDA_API_BASE_URL/AGENDA_API_TOKEN configuradas nas variáveis de
// ambiente do Vercel (estado de hoje), responde { configured: false } e o
// painel segue 100% no mock de data/agenda.js — nenhuma mudança visível.
//
// Quando o endpoint/autenticação reais do Sistema de Agenda existirem,
// implementar fetchReal() abaixo moldando a resposta para o MESMO formato de
// window.APP_DATA.agenda (ver data/agenda.js):
//   { months, monthLabels,
//     series: { agendamentos, inscricoes, presencas, espacosUsados, presencaPct },
//     movimentacaoDiaria: { dias, agendamentos, inscricoes, presencas },
//     topEspacos: [{ nome, reservas }],
//     proximosAgendamentos: [{ titulo, local, horario, inscricoes, status }],
//     taxaPresencaEvento: [{ evento, inscricoes, presencas }] }
// É esse contrato — não a origem do dado — que views/espacos.js e
// views/visao-geral.js enxergam; mantendo-o, nenhuma view muda.
const { handleSource } = require("./_lib/source-proxy");

async function fetchReal(baseUrl, token) {
  // TODO: chamada real ao Sistema de Agenda, ex.:
  //   const r = await fetch(`${baseUrl}/indicadores`, { headers: { Authorization: `Bearer ${token}` } });
  //   if (!r.ok) throw new Error(`Sistema de Agenda respondeu ${r.status}`);
  //   const raw = await r.json();
  //   return moldarParaFormatoDoPainel(raw); // ver contrato no comentário acima
  throw new Error("Integração real do Sistema de Agenda ainda não implementada");
}

module.exports = async (req, res) => {
  await handleSource(res, { baseUrlEnv: "AGENDA_API_BASE_URL", tokenEnv: "AGENDA_API_TOKEN", fetchReal });
};
