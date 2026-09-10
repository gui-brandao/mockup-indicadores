// Dados mockados do Painel Consolidado — Parque Tecnológico
// Fonte: números reais do Sistema de Agenda / Sistema de O.S. (prints) e planilhas do plano FINEP (Consultores na Incubadora, BI Atendimento Empreendedorismo).
// Séries mensais e canais estimados de forma plausível onde não há dado real disponível.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.incubadora = {
  "fases": [
    {
      "id": "S1",
      "nome": "S1 · Sentir",
      "estagio": "Ideação",
      "individual": 12,
      "coletivo": 14
    },
    {
      "id": "S2",
      "nome": "S2 · Arquitetar",
      "estagio": "Início da Validação",
      "individual": 69,
      "coletivo": 27
    },
    {
      "id": "S3",
      "nome": "S3 · Validar",
      "estagio": "Conclusão da Validação",
      "individual": 70,
      "coletivo": 26
    },
    {
      "id": "S4",
      "nome": "S4 · Operar",
      "estagio": "Operação",
      "individual": 71,
      "coletivo": 25
    },
    {
      "id": "S5",
      "nome": "S5 · Colher Resultados",
      "estagio": "Tração",
      "individual": 70,
      "coletivo": 26
    },
    {
      "id": "S6",
      "nome": "S6 · Ampliar",
      "estagio": "Escala",
      "individual": 69,
      "coletivo": 27
    }
  ],
  "acoesTransversais": 5,
  "totalAcoesIndividual": 363,
  "totalAcoesColetivo": 147,
  "ciclos": [
    {
      "nome": "Entrada",
      "semanas": "Semana 1",
      "entrega": "Startup credenciada",
      "empresas": 2
    },
    {
      "nome": "Diagnóstico",
      "semanas": "Semana 2",
      "entrega": "Diagnóstico concluído",
      "empresas": 3
    },
    {
      "nome": "Onboarding",
      "semanas": "Semana 3",
      "entrega": "Plano Individual de Incubação (PII) aprovado",
      "empresas": 2
    },
    {
      "nome": "Pré-Incubação",
      "semanas": "Semanas 4 a 15",
      "entrega": "Modelo de negócio validado",
      "empresas": 9
    },
    {
      "nome": "Validação",
      "semanas": "Semanas 16 a 27",
      "entrega": "MVP validado com clientes",
      "empresas": 7
    },
    {
      "nome": "Operação",
      "semanas": "Semanas 28 a 37",
      "entrega": "Operação estruturada",
      "empresas": 6
    },
    {
      "nome": "Tração",
      "semanas": "Semanas 38 a 47",
      "entrega": "Crescimento consistente",
      "empresas": 3
    },
    {
      "nome": "Escala",
      "semanas": "Semanas 48 a 51",
      "entrega": "Empresa preparada para expansão",
      "empresas": 1
    },
    {
      "nome": "Graduação",
      "semanas": "Semana 52",
      "entrega": "Avaliação final",
      "empresas": 1
    }
  ],
  "aulasColetivas": [
    {
      "fase": "S1 · Ideação",
      "total": 6,
      "prontas": 3
    },
    {
      "fase": "S2 · Início Validação",
      "total": 6,
      "prontas": 2
    },
    {
      "fase": "S3 · Conclusão Validação",
      "total": 6,
      "prontas": 0
    },
    {
      "fase": "S4 · Operação",
      "total": 7,
      "prontas": 0
    },
    {
      "fase": "S5 · Tração",
      "total": 6,
      "prontas": 0
    },
    {
      "fase": "S6 · Escala",
      "total": 6,
      "prontas": 0
    }
  ],
  "kpis": {
    "startupsAtivas": 34,
    "mentoriasRealizadas": 142,
    "aulasMinistradas": 5,
    "entregasConcluidas": 30,
    "graduandasPrevistas": 1
  },
  "planoTrabalho": {
    "concluida": 30,
    "emExecucao": 13,
    "naoIniciada": 2,
    "semStatus": 54
  }
};

// --- Dados complementares (mockup) -------------------------------------------
// Setores das 34 startups ativas — soma = 34.
window.APP_DATA.incubadora.setores = [
  { setor: "IndTech / Manufatura", valor: 7 },
  { setor: "HealthTech", valor: 6 },
  { setor: "EdTech", valor: 5 },
  { setor: "Economia Criativa", valor: 5 },
  { setor: "AgTech / Meio Ambiente", valor: 4 },
  { setor: "Outros (GovTech, Fintech)", valor: 7 }
];

// Diagnóstico multidimensional — média das startups ativas (0 a 100).
window.APP_DATA.incubadora.maturidade = [
  { dimensao: "Modelo de negócio", valor: 72 },
  { dimensao: "Solução / Tecnologia", valor: 65 },
  { dimensao: "Time e gestão", valor: 61 },
  { dimensao: "Mercado e clientes", valor: 58 },
  { dimensao: "Financeiro", valor: 48 },
  { dimensao: "Propriedade intelectual", valor: 39 }
];

// Séries mensais — somas batem com os KPIs (142 mentorias, 5 aulas ministradas).
window.APP_DATA.incubadora.serieMensal = {
  mentorias: [8, 10, 12, 14, 18, 20, 16, 22, 22],
  aulas: [0, 0, 0, 1, 1, 1, 0, 1, 1],
  startupsAtivas: [18, 21, 23, 25, 27, 29, 30, 32, 34]
};
