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

// --- Dados por startup (mockup) -----------------------------------------------
// 34 registros individuais — a contagem por cicloAtual bate exatamente com
// ciclos[].empresas e a contagem por setor bate exatamente com `setores` acima,
// para o Kanban da tela nunca divergir do trilho/rosca já existentes.
window.APP_DATA.incubadora.startups = [
  { id: "STU-01", nome: "ForjaTech Automação", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Entrada", fomentoCaptado: 0, dataEntrada: "2026-09-10", responsavel: "Rafael Prado", empregosGerados: 0 },
  { id: "STU-02", nome: "VitaCare Diagnósticos", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Entrada", fomentoCaptado: 0, dataEntrada: "2026-09-17", responsavel: "Diego Nakamura", empregosGerados: 0 },
  { id: "STU-03", nome: "AprendeMais EdTech", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Diagnóstico", fomentoCaptado: 5000, dataEntrada: "2026-09-24", responsavel: "Camila Reis", empregosGerados: 1 },
  { id: "STU-04", nome: "AteliêDigital Design", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Diagnóstico", fomentoCaptado: 4500, dataEntrada: "2026-09-07", responsavel: "Marina Duarte", empregosGerados: 0 },
  { id: "STU-05", nome: "AgroSensa Monitoramento", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Diagnóstico", fomentoCaptado: 5500, dataEntrada: "2026-09-14", responsavel: "Rafael Prado", empregosGerados: 0 },
  { id: "STU-06", nome: "PagaFácil Fintech", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Onboarding", fomentoCaptado: 8000, dataEntrada: "2026-08-21", responsavel: "Diego Nakamura", empregosGerados: 1 },
  { id: "STU-07", nome: "PrimeCorte Robótica", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Onboarding", fomentoCaptado: 8000, dataEntrada: "2026-08-04", responsavel: "Camila Reis", empregosGerados: 0 },
  { id: "STU-08", nome: "BioSinal Saúde", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Pré-Incubação", fomentoCaptado: 14000, dataEntrada: "2026-07-11", responsavel: "Marina Duarte", empregosGerados: 1 },
  { id: "STU-09", nome: "EduTrilha", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Pré-Incubação", fomentoCaptado: 16000, dataEntrada: "2026-07-18", responsavel: "Rafael Prado", empregosGerados: 2 },
  { id: "STU-10", nome: "CenaViva Produções", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Pré-Incubação", fomentoCaptado: 15500, dataEntrada: "2026-07-25", responsavel: "Diego Nakamura", empregosGerados: 1 },
  { id: "STU-11", nome: "VerdeTech Soluções", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Pré-Incubação", fomentoCaptado: 14500, dataEntrada: "2026-07-08", responsavel: "Camila Reis", empregosGerados: 1 },
  { id: "STU-12", nome: "CidadeConecta GovTech", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Pré-Incubação", fomentoCaptado: 14000, dataEntrada: "2026-07-15", responsavel: "Marina Duarte", empregosGerados: 2 },
  { id: "STU-13", nome: "AçoNova Manufatura", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Pré-Incubação", fomentoCaptado: 16500, dataEntrada: "2026-07-22", responsavel: "Rafael Prado", empregosGerados: 1 },
  { id: "STU-14", nome: "MedaVida Telemedicina", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Pré-Incubação", fomentoCaptado: 15500, dataEntrada: "2026-07-05", responsavel: "Diego Nakamura", empregosGerados: 1 },
  { id: "STU-15", nome: "SabTech Educação", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Pré-Incubação", fomentoCaptado: 15000, dataEntrada: "2026-07-12", responsavel: "Camila Reis", empregosGerados: 2 },
  { id: "STU-16", nome: "ArteCode Studio", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Pré-Incubação", fomentoCaptado: 14000, dataEntrada: "2026-07-19", responsavel: "Marina Duarte", empregosGerados: 1 },
  { id: "STU-17", nome: "HidroVerde Irrigação", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Validação", fomentoCaptado: 38500, dataEntrada: "2026-06-26", responsavel: "Rafael Prado", empregosGerados: 2 },
  { id: "STU-18", nome: "FinPonto Pagamentos", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Validação", fomentoCaptado: 37000, dataEntrada: "2026-06-09", responsavel: "Diego Nakamura", empregosGerados: 3 },
  { id: "STU-19", nome: "ModulaPeças", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Validação", fomentoCaptado: 35000, dataEntrada: "2026-06-16", responsavel: "Camila Reis", empregosGerados: 2 },
  { id: "STU-20", nome: "SaúdeConecta", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Validação", fomentoCaptado: 33500, dataEntrada: "2026-06-23", responsavel: "Marina Duarte", empregosGerados: 2 },
  { id: "STU-21", nome: "MentoraEdu", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Validação", fomentoCaptado: 31500, dataEntrada: "2026-06-06", responsavel: "Rafael Prado", empregosGerados: 3 },
  { id: "STU-22", nome: "CriaLab Design", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Validação", fomentoCaptado: 37000, dataEntrada: "2026-06-13", responsavel: "Diego Nakamura", empregosGerados: 2 },
  { id: "STU-23", nome: "TerraClima Análises", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Validação", fomentoCaptado: 35500, dataEntrada: "2026-06-20", responsavel: "Camila Reis", empregosGerados: 2 },
  { id: "STU-24", nome: "GovDigital ABC", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Operação", fomentoCaptado: 57500, dataEntrada: "2026-05-03", responsavel: "Marina Duarte", empregosGerados: 4 },
  { id: "STU-25", nome: "FormaTech Industrial", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Operação", fomentoCaptado: 54500, dataEntrada: "2026-05-10", responsavel: "Rafael Prado", empregosGerados: 3 },
  { id: "STU-26", nome: "PulseHealth Monitoramento", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Operação", fomentoCaptado: 64000, dataEntrada: "2026-05-17", responsavel: "Diego Nakamura", empregosGerados: 3 },
  { id: "STU-27", nome: "ClassePlay", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Operação", fomentoCaptado: 61000, dataEntrada: "2026-05-24", responsavel: "Camila Reis", empregosGerados: 4 },
  { id: "STU-28", nome: "MosaicoMídia", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Operação", fomentoCaptado: 58000, dataEntrada: "2026-05-07", responsavel: "Marina Duarte", empregosGerados: 3 },
  { id: "STU-29", nome: "PayLoop Soluções", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Operação", fomentoCaptado: 55000, dataEntrada: "2026-05-14", responsavel: "Rafael Prado", empregosGerados: 3 },
  { id: "STU-30", nome: "PrecisaMake", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Tração", fomentoCaptado: 102500, dataEntrada: "2026-04-21", responsavel: "Diego Nakamura", empregosGerados: 5 },
  { id: "STU-31", nome: "NeuroScan Labs", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Tração", fomentoCaptado: 98000, dataEntrada: "2026-04-04", responsavel: "Camila Reis", empregosGerados: 4 },
  { id: "STU-32", nome: "RegulaTech Compliance", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Tração", fomentoCaptado: 93000, dataEntrada: "2026-04-11", responsavel: "Marina Duarte", empregosGerados: 4 },
  { id: "STU-33", nome: "MetalFlex Componentes", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Escala", fomentoCaptado: 130000, dataEntrada: "2026-03-18", responsavel: "Rafael Prado", empregosGerados: 7 },
  { id: "STU-34", nome: "ImpactoPay Social", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Graduação", fomentoCaptado: 196000, dataEntrada: "2026-02-25", responsavel: "Diego Nakamura", empregosGerados: 8 },];

// Impacto socioeconômico — séries mensais (não são totais fixos: o KPI lê o
// último valor com PERIOD.last(), como startupsAtivas). Família estimada com
// multiplicador de 1,6 pessoa/família por emprego gerado (documentado aqui,
// não em código disperso) — mesma base usada nos KPIs de impacto da Visão Geral.
window.APP_DATA.incubadora.empregosGeradosMensal = [22, 31, 38, 45, 52, 58, 65, 71, 78];
window.APP_DATA.incubadora.familiasAtingidasMensal = [35, 50, 61, 72, 83, 93, 104, 114, 125];

// Fomento captado pelas startups ativas — série acumulada do ano (estoque,
// lida com PERIOD.last()/PERIOD.slice(), como as duas séries acima). O valor
// de setembro bate exatamente com a soma de `startups[].fomentoCaptado`
// (R$ 1.383.500), para a tela de Incubadora nunca divergir do Kanban.
window.APP_DATA.incubadora.fomentoCaptadoMensal = [295000, 430000, 560000, 690000, 820000, 950000, 1080000, 1230000, 1383500];
