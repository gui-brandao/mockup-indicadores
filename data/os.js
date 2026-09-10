// Dados mockados do Painel Consolidado — Parque Tecnológico
// Fonte: números reais do Sistema de Agenda / Sistema de O.S. (prints) e planilhas do plano FINEP (Consultores na Incubadora, BI Atendimento Empreendedorismo).
// Séries mensais e canais estimados de forma plausível onde não há dado real disponível.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.os = {
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
    "registros": [
      62,
      58,
      71,
      65,
      83,
      76,
      54,
      97,
      144
    ]
  },
  "snapshot": {
    "referencia": "Últimos 30 dias · 12/08/2026 a 10/09/2026",
    "total": 144,
    "emAberto": 135,
    "finalizados": 9,
    "urgentes": 3,
    "semResponsavel": 134,
    "mediaDia": 4.8,
    "porStatus": [
      {
        "status": "Pendente",
        "valor": 49
      },
      {
        "status": "Em Andamento",
        "valor": 0
      },
      {
        "status": "Aguardando",
        "valor": 0
      },
      {
        "status": "Agendado",
        "valor": 86
      },
      {
        "status": "Finalizado",
        "valor": 9
      }
    ],
    "urgenciaPct": 2.8,
    "tendencia": {
      "dias": [
        "12/08",
        "13/08",
        "14/08",
        "15/08",
        "16/08",
        "17/08",
        "18/08",
        "19/08",
        "20/08",
        "21/08",
        "22/08",
        "23/08",
        "24/08",
        "25/08",
        "26/08",
        "27/08",
        "28/08",
        "29/08",
        "30/08",
        "31/08",
        "01/09",
        "02/09",
        "03/09",
        "04/09",
        "05/09",
        "06/09",
        "07/09",
        "08/09",
        "09/09",
        "10/09"
      ],
      "valores": [
        0,
        0,
        0,
        0,
        0,
        3,
        7,
        4,
        2,
        0,
        0,
        0,
        0,
        0,
        1,
        4,
        2,
        1,
        0,
        1,
        0,
        62,
        60,
        58,
        3,
        0,
        0,
        0,
        2,
        1
      ]
    }
  },
  "categorias": [
    {
      "categoria": "Manutenção predial",
      "valor": 41
    },
    {
      "categoria": "TI e Conectividade",
      "valor": 33
    },
    {
      "categoria": "Limpeza e Facilities",
      "valor": 24
    },
    {
      "categoria": "Apoio a eventos",
      "valor": 22
    },
    {
      "categoria": "Laboratórios",
      "valor": 15
    },
    {
      "categoria": "Outros",
      "valor": 9
    }
  ],
  "tempoMedioResolucaoDias": 3.4
};

// --- Dados complementares (mockup) -------------------------------------------
// Tempo médio de resolução (dias) — termina em 3,4, igual ao KPI do snapshot.
window.APP_DATA.os.serieTempoMedio = [4.2, 4.0, 3.9, 4.1, 3.8, 3.6, 3.7, 3.5, 3.4];

// Carga por equipe — soma = 710 registros do acumulado 2026.
window.APP_DATA.os.porEquipe = [
  { equipe: "Facilities", valor: 198 },
  { equipe: "TI e Conectividade", valor: 162 },
  { equipe: "Laboratórios", valor: 112 },
  { equipe: "Apoio a eventos", valor: 96 },
  { equipe: "Zeladoria", valor: 82 },
  { equipe: "Sem responsável", valor: 60 }
];

// SLA mensal — dentro + fora do prazo = registros do mês.
window.APP_DATA.os.slaMensal = {
  dentro: [54, 51, 62, 58, 73, 68, 49, 85, 123],
  fora: [8, 7, 9, 7, 10, 8, 5, 12, 21]
};

// Séries mensais para os minigráficos dos KPIs (terminam nos valores do snapshot).
window.APP_DATA.os.serieEmAberto = [55, 51, 63, 58, 74, 68, 48, 88, 135];
window.APP_DATA.os.serieFinalizados = [7, 7, 8, 7, 9, 8, 6, 9, 9];
window.APP_DATA.os.serieUrgentes = [2, 1, 3, 2, 3, 2, 1, 4, 3];
window.APP_DATA.os.serieSemResponsavel = [48, 44, 57, 52, 69, 63, 44, 84, 134];
