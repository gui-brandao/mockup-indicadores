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

// --- Dados complementares (mockup) -------------------------------------------
// Carteira acumulada de empresas atendidas — termina em 187, igual ao KPI.
window.APP_DATA.crm.empresasMensal = [42, 58, 71, 86, 104, 121, 142, 163, 187];

// Empresas por porte — soma = 187.
window.APP_DATA.crm.porSegmento = [
  { segmento: "Startup", valor: 32 },
  { segmento: "Microempresa", valor: 46 },
  { segmento: "Pequena empresa", valor: 38 },
  { segmento: "MEI", valor: 34 },
  { segmento: "Média / Grande", valor: 21 },
  { segmento: "ICT / Universidade", valor: 16 }
];

// Origem do primeiro contato — soma = 187.
window.APP_DATA.crm.origemContato = [
  { origem: "Site do Parque", valor: 52 },
  { origem: "Indicação", valor: 41 },
  { origem: "Evento presencial", valor: 33 },
  { origem: "Redes sociais", valor: 24 },
  { origem: "Parceiro / Prefeitura", valor: 20 },
  { origem: "Procura espontânea", valor: 17 }
];

// Séries mensais para os minigráficos dos KPIs (terminam nos valores dos cartões).
window.APP_DATA.crm.parceriasMensal = [0, 0, 1, 1, 1, 2, 2, 3, 3];
window.APP_DATA.crm.oportunidadesMensal = [18, 24, 29, 34, 41, 47, 54, 59, 64];
