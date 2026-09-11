// Dados mockados do Painel Consolidado — Parque Tecnológico
// Eventos promovidos/incentivados pelo Parque — 100% estimado/ilustrativo.
// "CITE" aqui é o espaço/auditório do próprio Parque (mesmo nome já usado no
// objetivo real da meta 3.5.1 em data/metas.js — não é o sistema de referência
// visual usado para desenhar esta tela, coincidência de nome).
// Alimenta as metas 3.5.1 (eventos no CITE) e 3.6.1 (eventos externos) — os
// campos `realizado`/`status`/`pct` desses dois itens em data/metas.js foram
// atualizados a partir da contagem abaixo (mesma regra das outras 23 metas:
// número estático no dataset, nunca calculado a partir de outro arquivo em
// runtime — só que agora com base real nestes eventos, em vez de 0).

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.eventos = {
  months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"],
  monthLabels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"],
  eventosMensal: [0, 0, 1, 1, 2, 1, 1, 1, 6],
  participantesMensal: [0, 0, 22, 12, 150, 180, 88, 8, 519],
  encaminhamentosMensal: [0, 0, 1, 2, 8, 6, 10, 2, 12],
  lista: [
    { id: "EVT-01", nome: "Oficina de Modelagem de Negócios", data: "2026-03-12", status: "Realizado", tipoPublico: "Startups", local: "CITE", gratuito: true, inscritos: 22, presentes: 19, parceirosPresentes: 2, startupsPresentes: 16, investidoresPresentes: 0, contaParaMeta: "3.5.1" },
    { id: "EVT-02", nome: "Feira Nacional de Startups (São Paulo)", data: "2026-04-14", status: "Realizado", tipoPublico: "Startups & Investidores", local: "São Paulo Expo", gratuito: false, inscritos: 12, presentes: 12, parceirosPresentes: 1, startupsPresentes: 10, investidoresPresentes: 1, contaParaMeta: "3.6.1" },
    { id: "EVT-03", nome: "Palestra: Tendências em IA Aplicada", data: "2026-05-08", status: "Realizado", tipoPublico: "Empresas & EBTs", local: "CITE", gratuito: true, inscritos: 55, presentes: 48, parceirosPresentes: 25, startupsPresentes: 15, investidoresPresentes: 3, contaParaMeta: "3.5.1" },
    { id: "EVT-04", nome: "Semana de CT&I do Grande ABC", data: "2026-05-25", status: "Realizado", tipoPublico: "Escolas & Universidades", local: "UFABC — Santo André", gratuito: true, inscritos: 95, presentes: 80, parceirosPresentes: 10, startupsPresentes: 15, investidoresPresentes: 0, contaParaMeta: "3.6.1" },
    { id: "EVT-05", nome: "Congresso Regional de Inovação ABC", data: "2026-06-20", status: "Realizado", tipoPublico: "Público Geral", local: "Centro de Eventos Santo André", gratuito: false, inscritos: 180, presentes: 150, parceirosPresentes: 40, startupsPresentes: 20, investidoresPresentes: 8, contaParaMeta: "3.6.1" },
    { id: "EVT-06", nome: "Hackathon Parque Tecnológico", data: "2026-07-27", status: "Realizado", tipoPublico: "Estudantes & Startups", local: "CITE", gratuito: true, inscritos: 88, presentes: 76, parceirosPresentes: 5, startupsPresentes: 60, investidoresPresentes: 2, contaParaMeta: "3.5.1" },
    { id: "EVT-07", nome: "Rodada de Negócios com Investidores (SP)", data: "2026-08-10", status: "Realizado", tipoPublico: "Investidores", local: "São Paulo", gratuito: false, inscritos: 8, presentes: 8, parceirosPresentes: 1, startupsPresentes: 3, investidoresPresentes: 4, contaParaMeta: "3.6.1" },
    { id: "EVT-08", nome: "Bootcamp Manufatura Avançada", data: "2026-09-02", status: "Realizado", tipoPublico: "Empresas", local: "CITE", gratuito: true, inscritos: 34, presentes: 30, parceirosPresentes: 15, startupsPresentes: 10, investidoresPresentes: 0, contaParaMeta: "3.5.1" },
    { id: "EVT-09", nome: "Roda de Mentoria: Fomento e Editais", data: "2026-09-05", status: "Realizado", tipoPublico: "Startups", local: "CITE", gratuito: true, inscritos: 28, presentes: 24, parceirosPresentes: 3, startupsPresentes: 20, investidoresPresentes: 0, contaParaMeta: "3.5.1" },
    { id: "EVT-10", nome: "Demo Day Parque Tecnológico 2026", data: "2026-09-10", status: "Realizado", tipoPublico: "Startups & Investidores", local: "CITE", gratuito: true, inscritos: 145, presentes: 118, parceirosPresentes: 30, startupsPresentes: 45, investidoresPresentes: 12, contaParaMeta: "3.5.1" },
    { id: "EVT-11", nome: "Workshop de Propriedade Intelectual", data: "2026-09-15", status: "Programado", tipoPublico: "Empresas & EBTs", local: "CITE", gratuito: true, inscritos: 62, presentes: null, parceirosPresentes: 0, startupsPresentes: 0, investidoresPresentes: 0, contaParaMeta: "3.5.1" },
    { id: "EVT-12", nome: "Trilha de Robótica para Estudantes", data: "2026-09-18", status: "Programado", tipoPublico: "Estudantes & Escolas", local: "CITE", gratuito: true, inscritos: 40, presentes: null, parceirosPresentes: 0, startupsPresentes: 0, investidoresPresentes: 0, contaParaMeta: "3.5.1" },
    { id: "EVT-13", nome: "Feira de Inovação Aberta", data: "2026-09-22", status: "Inscrições abertas", tipoPublico: "Público Geral", local: "CITE", gratuito: true, inscritos: 210, presentes: null, parceirosPresentes: 0, startupsPresentes: 0, investidoresPresentes: 0, contaParaMeta: "3.5.1" },
  ],
  inscricoes: [
    { idEvento: "EVT-10", evento: "Demo Day Parque Tecnológico 2026", participante: "PrecisaMake", perfil: "Startup", inscrito: true, presente: true, interesse: "Alta", encaminhamento: "Incubadora" },
    { idEvento: "EVT-10", evento: "Demo Day Parque Tecnológico 2026", participante: "TechBridge Soluções", perfil: "Parceiro", inscrito: true, presente: true, interesse: "Média", encaminhamento: "Parcerias" },
    { idEvento: "EVT-09", evento: "Roda de Mentoria: Fomento e Editais", participante: "AgroSensa Monitoramento", perfil: "Startup", inscrito: true, presente: true, interesse: "Alta", encaminhamento: "Fomento" },
    { idEvento: "EVT-08", evento: "Bootcamp Manufatura Avançada", participante: "ForjaTech Automação", perfil: "Startup", inscrito: true, presente: true, interesse: "Alta", encaminhamento: "Laboratórios" },
    { idEvento: "EVT-11", evento: "Workshop de Propriedade Intelectual", participante: "Instituto Vetor Digital", perfil: "Parceiro", inscrito: true, presente: null, interesse: "—", encaminhamento: "—" },
    { idEvento: "EVT-13", evento: "Feira de Inovação Aberta", participante: "Comunidade em geral", perfil: "Pessoa física", inscrito: true, presente: null, interesse: "—", encaminhamento: "—" },
  ],
};
