// Dados mockados do Painel Consolidado — Parque Tecnológico
// Fonte: números reais do Sistema de Agenda / Sistema de O.S. (prints) e planilhas do plano FINEP (Consultores na Incubadora, BI Atendimento Empreendedorismo).
// Séries mensais e canais estimados de forma plausível onde não há dado real disponível.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.crm = {
  "months": [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set"
  ],
  "monthLabels": [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro"
  ],
  "series": {
    "planejado": [
      380,
      410,
      450,
      470,
      504,
      693,
      705,
      730,
      760
    ],
    "realizado": [
      340,
      372,
      405,
      430,
      470,
      610,
      640,
      685,
      702
    ]
  },
  "metaAnual": 6300,
  "porCanal": [
    {
      "canal": "Atendimento Presencial",
      "valor": 281
    },
    {
      "canal": "Atendimento via Site",
      "valor": 154
    },
    {
      "canal": "Plantão de Atendimento",
      "valor": 126
    },
    {
      "canal": "E-mail / Outros",
      "valor": 84
    },
    {
      "canal": "Eventos e Workshops",
      "valor": 56
    }
  ],
  "funil": [
    {
      "etapa": "Contato / Lead",
      "valor": 1020
    },
    {
      "etapa": "Diagnóstico realizado",
      "valor": 620
    },
    {
      "etapa": "Atendimento especializado",
      "valor": 430
    },
    {
      "etapa": "Encaminhado à incubação",
      "valor": 96
    }
  ],
  "empresasAtendidas": 187,
  "oportunidadesAtivas": 64,
  "parcerias": [
    {
      "cod": "2.4.1",
      "nome": "Projetos submetidos a fomento/incentivo fiscal",
      "meta": 2,
      "realizado": 1,
      "status": "Em execução"
    },
    {
      "cod": "2.4.2",
      "nome": "Parcerias formalizadas com ICTs",
      "meta": 3,
      "realizado": 2,
      "status": "Em execução"
    },
    {
      "cod": "2.4.3",
      "nome": "Parceria com investidor de startups",
      "meta": 1,
      "realizado": 0,
      "status": "Em negociação"
    },
    {
      "cod": "2.4.4",
      "nome": "Coworkings credenciados",
      "meta": 2,
      "realizado": 0,
      "status": "Não iniciada"
    }
  ]
};
