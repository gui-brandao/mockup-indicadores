// Dados mockados do Painel Consolidado — Parque Tecnológico
// Fonte: números reais do Sistema de Agenda / Sistema de O.S. (prints) e planilhas do plano FINEP (Consultores na Incubadora, BI Atendimento Empreendedorismo).
// Séries mensais e canais estimados de forma plausível onde não há dado real disponível.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.educacao = {
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
    "ava": [
      139,
      149,
      166,
      163,
      172,
      181,
      179,
      195,
      206
    ],
    "estudantes": [
      55,
      59,
      63,
      61,
      62,
      69,
      71,
      79,
      81
    ],
    "roteiros": [
      433,
      491,
      516,
      554,
      528,
      556,
      575,
      606,
      671
    ],
    "visitas": [
      37,
      43,
      45,
      49,
      46,
      48,
      54,
      56,
      54
    ]
  },
  "metas": {
    "ava": 2500,
    "estudantes": 1200,
    "roteiros": 8500,
    "visitas": 800,
    "eventosCite": 10,
    "eventosExternos": 6
  },
  "realizadoEventos": {
    "eventosCite": 0,
    "eventosExternos": 0
  },
  "publicoPorPerfil": [
    {
      "perfil": "Estudantes ensino básico",
      "valor": 2380
    },
    {
      "perfil": "Estudantes EJA/UNIVESP",
      "valor": 600
    },
    {
      "perfil": "Empreendedores/Startups",
      "valor": 1120
    },
    {
      "perfil": "Empresas e Universidades (visitas)",
      "valor": 432
    },
    {
      "perfil": "Comunidade em geral",
      "valor": 398
    }
  ],
  "catalogoAva": [
    {
      "tema": "Crescimento para Startups (Growth)",
      "duracao": "02:00:00",
      "objetivo": "Crescimento acelerado (estratégia de negócio)."
    },
    {
      "tema": "CRM e Gestão Comercial",
      "duracao": "02:00:00",
      "data": "2026-07-21",
      "objetivo": "Comprovar demanda e potencial comercial."
    },
    {
      "tema": "Business Model Canvas",
      "duracao": "02:00:00",
      "data": "2026-07-28",
      "objetivo": "Transformar hipóteses em soluções testáveis."
    },
    {
      "tema": "Proposta de Valor",
      "duracao": "02:00:00",
      "data": "2026-08-04",
      "objetivo": "Conexão entre problema e solução."
    },
    {
      "tema": "Fundamentos do Empreendedorismo Inovador",
      "duracao": "02:00:00",
      "data": "2026-08-11",
      "objetivo": "Compreender cliente, validar dores e identificar oportunidades."
    },
    {
      "tema": "Comportamento Empreendedor",
      "duracao": "02:00:00",
      "data": "2026-08-18",
      "objetivo": "Desenvolvimento da mentalidade empreendedora."
    },
    {
      "tema": "Mentalidade Empreendedora e Aprendizado",
      "duracao": "02:00:00",
      "data": "2026-08-25",
      "objetivo": "Cultura de experimentação e resiliência."
    },
    {
      "tema": "Geração de Ideias Inovadoras",
      "duracao": "02:00:00",
      "data": "2026-09-01",
      "objetivo": "Estruturação de oportunidades de negócio."
    },
    {
      "tema": "Design Sprint",
      "duracao": "02:00:00",
      "data": "2026-09-08",
      "objetivo": "Aceleração da validação."
    },
    {
      "tema": "Propriedade Intelectual",
      "duracao": "02:00:00",
      "data": "2026-09-15",
      "objetivo": "Proteção dos ativos gerados."
    },
    {
      "tema": "Vendas para Startups",
      "duracao": "02:00:00",
      "data": "2026-09-22",
      "objetivo": "Primeiras vendas e validação."
    },
    {
      "tema": "Pitch de Validação",
      "duracao": "02:00:00",
      "data": "2026-09-29",
      "objetivo": "Comunicação dos resultados obtidos."
    },
    {
      "tema": "Gestão Financeira para Startups",
      "duracao": "02:00:00",
      "data": "2026-10-06",
      "objetivo": "Organização da operação."
    },
    {
      "tema": "Indicadores Financeiros e de Desempenho",
      "duracao": "02:00:00",
      "data": "2026-10-13",
      "objetivo": "Controle financeiro e fluxo de caixa."
    },
    {
      "tema": "Estruturando um Negócio para Crescer",
      "duracao": "02:00:00",
      "data": "2026-10-20",
      "objetivo": "Gestão baseada em dados."
    },
    {
      "tema": "Dashboards e Indicadores",
      "duracao": "02:00:00",
      "data": "2026-10-27",
      "objetivo": "Monitoramento dos resultados."
    },
    {
      "tema": "Marketing Digital para Startups",
      "duracao": "02:00:00",
      "data": "2026-11-03",
      "objetivo": "Viabilidade econômica da startup."
    }
  ]
};

// --- Dados complementares (mockup) -------------------------------------------
// Visitas técnicas por tipo de instituição — soma = 432 visitas do acumulado.
window.APP_DATA.educacao.visitasPorInstituicao = [
  { instituicao: "Escolas públicas", valor: 168 },
  { instituicao: "Escolas privadas", valor: 74 },
  { instituicao: "Universidades", valor: 66 },
  { instituicao: "Empresas", valor: 62 },
  { instituicao: "Órgãos públicos", valor: 34 },
  { instituicao: "Sociedade civil", valor: 28 }
];

// Trilhas do AVA — inscritos somam 1.550, igual ao realizado da meta 3.1.1.
window.APP_DATA.educacao.trilhas = [
  { trilha: "Empreendedorismo Inovador", inscritos: 320, conclusoes: 214 },
  { trilha: "Modelagem de Negócios", inscritos: 286, conclusoes: 181 },
  { trilha: "Validação e MVP", inscritos: 262, conclusoes: 158 },
  { trilha: "Marketing e Vendas", inscritos: 238, conclusoes: 142 },
  { trilha: "Gestão Financeira", inscritos: 224, conclusoes: 126 },
  { trilha: "Indicadores e Dashboards", inscritos: 220, conclusoes: 118 }
];

// Alcance regional dos roteiros pedagógicos — soma = 4.930 (realizado da meta 3.3.1).
window.APP_DATA.educacao.porCidade = [
  { cidade: "Santo André", valor: 1985 },
  { cidade: "São Bernardo do Campo", valor: 1108 },
  { cidade: "São Caetano do Sul", valor: 642 },
  { cidade: "Diadema", valor: 518 },
  { cidade: "Mauá", valor: 383 },
  { cidade: "Ribeirão Pires", valor: 294 }
];
