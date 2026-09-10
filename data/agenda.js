// Dados mockados do Painel Consolidado — Parque Tecnológico
// Fonte: números reais do Sistema de Agenda / Sistema de O.S. (prints) e planilhas do plano FINEP (Consultores na Incubadora, BI Atendimento Empreendedorismo).
// Séries mensais e canais estimados de forma plausível onde não há dado real disponível.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.agenda = {
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
    "agendamentos": [
      58,
      71,
      84,
      77,
      96,
      89,
      62,
      118,
      156
    ],
    "inscricoes": [
      420,
      512,
      610,
      560,
      690,
      655,
      430,
      980,
      1178
    ],
    "presencas": [
      210,
      268,
      325,
      301,
      362,
      344,
      215,
      520,
      946
    ],
    "espacosUsados": [
      51,
      64,
      58,
      70,
      66,
      74,
      49,
      102,
      133
    ],
    "presencaPct": [
      38.2,
      41.5,
      44.0,
      42.8,
      46.1,
      45.0,
      36.5,
      48.2,
      49.7
    ]
  },
  "movimentacaoDiaria": {
    "dias": [
      "01/09",
      "02/09",
      "03/09",
      "04/09",
      "05/09",
      "06/09",
      "07/09",
      "08/09",
      "09/09",
      "10/09",
      "11/09",
      "12/09",
      "13/09",
      "14/09",
      "15/09",
      "16/09",
      "17/09",
      "18/09",
      "19/09",
      "20/09"
    ],
    "agendamentos": [
      4,
      6,
      5,
      9,
      1,
      0,
      0,
      7,
      7,
      7,
      6,
      0,
      0,
      0,
      6,
      7,
      3,
      6,
      0,
      0
    ],
    "inscricoes": [
      15,
      23,
      12,
      405,
      2,
      0,
      0,
      120,
      150,
      140,
      90,
      0,
      0,
      0,
      110,
      95,
      38,
      60,
      0,
      0
    ],
    "presencas": [
      10,
      15,
      8,
      398,
      1,
      0,
      0,
      95,
      120,
      115,
      72,
      0,
      0,
      0,
      88,
      76,
      28,
      45,
      0,
      0
    ]
  },
  "topEspacos": [
    {
      "nome": "Sala de Reunião 09",
      "reservas": 22
    },
    {
      "nome": "Sala de Reunião 08",
      "reservas": 19
    },
    {
      "nome": "Sala de Reunião 07",
      "reservas": 17
    },
    {
      "nome": "Área de Descompressão",
      "reservas": 14
    },
    {
      "nome": "Auditório Principal",
      "reservas": 12
    },
    {
      "nome": "Laboratório de Manufatura Avançada",
      "reservas": 9
    },
    {
      "nome": "Laboratório de IA",
      "reservas": 8
    },
    {
      "nome": "Coworking Térreo",
      "reservas": 7
    }
  ],
  "proximosAgendamentos": [
    {
      "titulo": "COOP - Planejamento Estratégico",
      "local": "Sala de Reunião 09, Área de Descompressão",
      "horario": "Hoje · 08:00–18:00",
      "inscricoes": 36,
      "status": "Em andamento agora"
    },
    {
      "titulo": "RESERVA PARA REUNIÃO - DIRETORIA COOP",
      "local": "Sala de Reunião 08",
      "horario": "Hoje · 08:30–09:00",
      "inscricoes": 1,
      "status": "Em andamento agora"
    },
    {
      "titulo": "Apresentação Rota Gastronômica Grande ABC",
      "local": "Sala de Reunião 07",
      "horario": "Hoje · 10:00–12:00",
      "inscricoes": 0,
      "status": "Próximo"
    },
    {
      "titulo": "Visita Técnica (TECHTOUR + Onboarding)",
      "local": "Trilha de Laboratórios",
      "horario": "Amanhã · 09:00–11:00",
      "inscricoes": 38,
      "status": "Próximo"
    },
    {
      "titulo": "Oficina/Curso: Introdução à IA aplicada",
      "local": "Laboratório de IA",
      "horario": "Amanhã · 14:00–17:00",
      "inscricoes": 32,
      "status": "Próximo"
    },
    {
      "titulo": "Mentoria + Checkpoint S2",
      "local": "Sala de Reunião 07",
      "horario": "Quinta · 09:00–10:00",
      "inscricoes": 6,
      "status": "Próximo"
    }
  ],
  "taxaPresencaEvento": [
    {
      "evento": "COOP - Planejamento Estratégico",
      "inscricoes": 38,
      "presencas": 38
    },
    {
      "evento": "RESERVA PARA REUNIÃO - DIRETORIA COOP",
      "inscricoes": 1,
      "presencas": 1
    },
    {
      "evento": "Apresentação Rota Gastronômica",
      "inscricoes": 0,
      "presencas": 0
    },
    {
      "evento": "ATENDIMENTO COOP Marketing",
      "inscricoes": 0,
      "presencas": 0
    },
    {
      "evento": "Visita Técnica (TECHTOUR+Onboarding) A",
      "inscricoes": 38,
      "presencas": 31
    },
    {
      "evento": "REUNIÃO EXTERNA - SABINA",
      "inscricoes": 0,
      "presencas": 0
    },
    {
      "evento": "Reunião/Atendimento da Empresa",
      "inscricoes": 2,
      "presencas": 2
    },
    {
      "evento": "Reunião de pauta - Comunicação",
      "inscricoes": 0,
      "presencas": 0
    },
    {
      "evento": "Visita Técnica (TECHTOUR+Onboarding) B",
      "inscricoes": 39,
      "presencas": 33
    },
    {
      "evento": "Oficina/Curso: Introdução à IA",
      "inscricoes": 32,
      "presencas": 28
    }
  ]
};
