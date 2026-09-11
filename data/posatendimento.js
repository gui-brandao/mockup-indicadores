// Dados mockados do Painel Consolidado — Parque Tecnológico
// Pesquisas de satisfação e follow-ups de pós-atendimento — 100% estimado/
// ilustrativo. KPIs (satisfação média, NPS médio, follow-ups pendentes, %
// de retorno positivo) são calculados em runtime a partir deste array —
// nenhum total fixo aqui, mesma regra do resto do projeto.
//
// `resultado` "Concluído"/"Fora do SLA" indicam follow-up já resolvido (usado
// para calcular retorno positivo); "Pendente"/"Em andamento" ainda não têm
// resultado definido e entram no KPI "follow-ups pendentes" quando `retorno`
// é true.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.posatendimento = {
  months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"],
  monthLabels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"],
  pesquisasMensal: [4, 6, 8, 10, 12, 12, 13, 14, 15],
  pesquisas: [
    { id: "POS-01", cliente: "ForjaTech Automação", servico: "Diagnóstico — Incubadora", data: "2026-09-03", satisfacao: 5, nps: 9, retorno: true, followUpData: "2026-09-17", responsavel: "Marina Duarte", resultado: "Em andamento" },
    { id: "POS-02", cliente: "Instituto Federal ABC", servico: "Uso de Laboratório", data: "2026-09-01", satisfacao: 4, nps: 8, retorno: false, followUpData: null, responsavel: "Rafael Prado", resultado: "Concluído" },
    { id: "POS-03", cliente: "GrupoNex Engenharia", servico: "Atendimento especializado", data: "2026-08-30", satisfacao: 5, nps: 10, retorno: false, followUpData: null, responsavel: "Diego Nakamura", resultado: "Concluído" },
    { id: "POS-04", cliente: "AgroSensa Monitoramento", servico: "Reserva de Espaço", data: "2026-08-28", satisfacao: 4, nps: 8, retorno: true, followUpData: "2026-09-12", responsavel: "Camila Reis", resultado: "Pendente" },
    { id: "POS-05", cliente: "Coworking Aurora Devs", servico: "Evento — Demo Day", data: "2026-08-25", satisfacao: 5, nps: 9, retorno: false, followUpData: null, responsavel: "Marina Duarte", resultado: "Concluído" },
    { id: "POS-06", cliente: "VitaCare Diagnósticos", servico: "Uso de Laboratório", data: "2026-08-20", satisfacao: 3, nps: 7, retorno: true, followUpData: "2026-09-10", responsavel: "Rafael Prado", resultado: "Fora do SLA" },
    { id: "POS-07", cliente: "TechBridge Soluções", servico: "Mentoria — Fomento e Editais", data: "2026-08-15", satisfacao: 5, nps: 9, retorno: true, followUpData: "2026-08-29", responsavel: "Diego Nakamura", resultado: "Concluído" },
    { id: "POS-08", cliente: "PrecisaMake", servico: "Diagnóstico — Incubadora", data: "2026-08-10", satisfacao: 5, nps: 9, retorno: true, followUpData: "2026-08-24", responsavel: "Marina Duarte", resultado: "Concluído" },
    { id: "POS-09", cliente: "MedaVida Telemedicina", servico: "Atendimento especializado", data: "2026-08-05", satisfacao: 5, nps: 10, retorno: false, followUpData: null, responsavel: "Camila Reis", resultado: "Concluído" },
    { id: "POS-10", cliente: "Polo Consultoria Empresarial", servico: "Reserva de Espaço", data: "2026-07-29", satisfacao: 5, nps: 9, retorno: true, followUpData: "2026-08-12", responsavel: "Camila Reis", resultado: "Concluído" },
    { id: "POS-11", cliente: "NeuroScan Labs", servico: "Uso de Laboratório", data: "2026-07-20", satisfacao: 5, nps: 9, retorno: true, followUpData: "2026-08-03", responsavel: "Rafael Prado", resultado: "Concluído" },
    { id: "POS-12", cliente: "CenaViva Produções", servico: "Evento — Workshop de Propriedade Intelectual", data: "2026-07-15", satisfacao: 5, nps: 8, retorno: false, followUpData: null, responsavel: "Diego Nakamura", resultado: "Concluído" },
    { id: "POS-13", cliente: "RegulaTech Compliance", servico: "Atendimento especializado", data: "2026-07-05", satisfacao: 3, nps: 7, retorno: true, followUpData: "2026-09-20", responsavel: "Diego Nakamura", resultado: "Em andamento" },
    { id: "POS-14", cliente: "FormaTech Industrial", servico: "Diagnóstico — Incubadora", data: "2026-06-28", satisfacao: 5, nps: 9, retorno: true, followUpData: "2026-09-25", responsavel: "Marina Duarte", resultado: "Pendente" },
    { id: "POS-15", cliente: "ClassePlay", servico: "Mentoria — Fomento e Editais", data: "2026-06-10", satisfacao: 5, nps: 9, retorno: true, followUpData: "2026-06-24", responsavel: "Camila Reis", resultado: "Concluído" },
  ],
};
