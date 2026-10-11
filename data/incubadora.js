// Dados mockados do Painel Consolidado — Parque Tecnológico
// Fonte: números reais do Sistema de Agenda / Sistema de O.S. (prints) e planilhas do plano FINEP (Consultores na Incubadora, BI Atendimento Empreendedorismo).
// Séries mensais e canais estimados de forma plausível onde não há dado real disponível.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.incubadora = {
  // Período e data de referência — com a planilha conectada (equipe.html), vêm
  // do servidor (Jan até o mês corrente); aqui, o recorte do mock (Jan–Set/2026).
  "months": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"],
  "monthLabels": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"],
  "periodo": { "ano": 2026, "mesReferencia": 9 },
  "dataReferencia": "2026-09-10",
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
  "totalAcoes": 511,
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
    "graduandasPrevistas": 1,
    "aulasPlanejadas": 37,
    "startupsDiagnosticadas": 34
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
  { id: "STU-01", nome: "ForjaTech Automação", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Entrada", fomentoCaptado: 0, dataEntrada: "2026-09-10", responsavel: "Rafael Prado", empregosGerados: 0, mentoriasRealizadas: 1, ultimaMentoria: "2026-09-10", proximaMentoria: null, diasSemMentoria: 0, precisaAtencao: false, maturidade: null, dataDiagnostico: "" },
  { id: "STU-02", nome: "VitaCare Diagnósticos", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Entrada", fomentoCaptado: 0, dataEntrada: "2026-09-17", responsavel: "Diego Nakamura", empregosGerados: 0, mentoriasRealizadas: 0, ultimaMentoria: "", proximaMentoria: null, diasSemMentoria: 0, precisaAtencao: false, maturidade: null, dataDiagnostico: "" },
  { id: "STU-03", nome: "AprendeMais EdTech", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Diagnóstico", fomentoCaptado: 5000, dataEntrada: "2026-09-24", responsavel: "Camila Reis", empregosGerados: 1, mentoriasRealizadas: 0, ultimaMentoria: "", proximaMentoria: null, diasSemMentoria: 0, precisaAtencao: false, maturidade: null, dataDiagnostico: "" },
  { id: "STU-04", nome: "AteliêDigital Design", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Diagnóstico", fomentoCaptado: 4500, dataEntrada: "2026-09-07", responsavel: "Marina Duarte", empregosGerados: 0, mentoriasRealizadas: 1, ultimaMentoria: "2026-09-07", proximaMentoria: null, diasSemMentoria: 3, precisaAtencao: false, maturidade: null, dataDiagnostico: "" },
  { id: "STU-05", nome: "AgroSensa Monitoramento", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Diagnóstico", fomentoCaptado: 5500, dataEntrada: "2026-09-14", responsavel: "Rafael Prado", empregosGerados: 0, mentoriasRealizadas: 0, ultimaMentoria: "", proximaMentoria: null, diasSemMentoria: 0, precisaAtencao: false, maturidade: null, dataDiagnostico: "" },
  { id: "STU-06", nome: "PagaFácil Fintech", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Onboarding", fomentoCaptado: 8000, dataEntrada: "2026-08-21", responsavel: "Diego Nakamura", empregosGerados: 1, mentoriasRealizadas: 1, ultimaMentoria: "2026-08-21", proximaMentoria: null, diasSemMentoria: 20, precisaAtencao: false, maturidade: 46, dataDiagnostico: "2026-08-28" },
  { id: "STU-07", nome: "PrimeCorte Robótica", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Onboarding", fomentoCaptado: 8000, dataEntrada: "2026-08-04", responsavel: "Camila Reis", empregosGerados: 0, mentoriasRealizadas: 2, ultimaMentoria: "2026-09-04", proximaMentoria: null, diasSemMentoria: 6, precisaAtencao: false, maturidade: 40, dataDiagnostico: "2026-08-11" },
  { id: "STU-08", nome: "BioSinal Saúde", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Pré-Incubação", fomentoCaptado: 14000, dataEntrada: "2026-07-11", responsavel: "Marina Duarte", empregosGerados: 1, mentoriasRealizadas: 2, ultimaMentoria: "2026-08-27", proximaMentoria: { data: "2026-09-15", hora: "15:30", consultor: "Marina Duarte", tema: "Design Sprint", formato: "Presencial" }, diasSemMentoria: 14, precisaAtencao: false, maturidade: 46, dataDiagnostico: "2026-07-18" },
  { id: "STU-09", nome: "EduTrilha", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Pré-Incubação", fomentoCaptado: 16000, dataEntrada: "2026-07-18", responsavel: "Rafael Prado", empregosGerados: 2, mentoriasRealizadas: 2, ultimaMentoria: "2026-09-01", proximaMentoria: { data: "2026-09-18", hora: "14:00", consultor: "Rafael Prado", tema: "Crescimento para Startups (Growth)", formato: "Online" }, diasSemMentoria: 9, precisaAtencao: false, maturidade: 47, dataDiagnostico: "2026-07-25" },
  { id: "STU-10", nome: "CenaViva Produções", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Pré-Incubação", fomentoCaptado: 15500, dataEntrada: "2026-07-25", responsavel: "Diego Nakamura", empregosGerados: 1, mentoriasRealizadas: 2, ultimaMentoria: "2026-09-02", proximaMentoria: { data: "2026-09-23", hora: "10:30", consultor: "Diego Nakamura", tema: "Business Model Canvas", formato: "Presencial" }, diasSemMentoria: 8, precisaAtencao: false, maturidade: 48, dataDiagnostico: "2026-08-01" },
  { id: "STU-11", nome: "VerdeTech Soluções", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Pré-Incubação", fomentoCaptado: 14500, dataEntrada: "2026-07-08", responsavel: "Camila Reis", empregosGerados: 1, mentoriasRealizadas: 2, ultimaMentoria: "2026-08-25", proximaMentoria: { data: "2026-09-11", hora: "10:30", consultor: "Camila Reis", tema: "CRM e Gestão Comercial", formato: "Presencial" }, diasSemMentoria: 16, precisaAtencao: false, maturidade: 49, dataDiagnostico: "2026-07-15" },
  { id: "STU-12", nome: "CidadeConecta GovTech", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Pré-Incubação", fomentoCaptado: 14000, dataEntrada: "2026-07-15", responsavel: "Marina Duarte", empregosGerados: 2, mentoriasRealizadas: 2, ultimaMentoria: "2026-08-28", proximaMentoria: { data: "2026-09-16", hora: "09:00", consultor: "Marina Duarte", tema: "Propriedade Intelectual", formato: "Online" }, diasSemMentoria: 13, precisaAtencao: false, maturidade: 50, dataDiagnostico: "2026-07-22" },
  { id: "STU-13", nome: "AçoNova Manufatura", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Pré-Incubação", fomentoCaptado: 16500, dataEntrada: "2026-07-22", responsavel: "Rafael Prado", empregosGerados: 1, mentoriasRealizadas: 2, ultimaMentoria: "2026-09-01", proximaMentoria: { data: "2026-09-21", hora: "15:30", consultor: "Rafael Prado", tema: "Dashboards e Indicadores", formato: "Presencial" }, diasSemMentoria: 9, precisaAtencao: false, maturidade: 51, dataDiagnostico: "2026-07-29" },
  { id: "STU-14", nome: "MedaVida Telemedicina", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Pré-Incubação", fomentoCaptado: 15500, dataEntrada: "2026-07-05", responsavel: "Diego Nakamura", empregosGerados: 1, mentoriasRealizadas: 2, ultimaMentoria: "2026-08-24", proximaMentoria: null, diasSemMentoria: 17, precisaAtencao: false, maturidade: 45, dataDiagnostico: "2026-07-12" },
  { id: "STU-15", nome: "SabTech Educação", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Pré-Incubação", fomentoCaptado: 15000, dataEntrada: "2026-07-12", responsavel: "Camila Reis", empregosGerados: 2, mentoriasRealizadas: 2, ultimaMentoria: "2026-08-31", proximaMentoria: { data: "2026-09-17", hora: "10:30", consultor: "Camila Reis", tema: "Vendas para Startups", formato: "Presencial" }, diasSemMentoria: 10, precisaAtencao: false, maturidade: 46, dataDiagnostico: "2026-07-19" },
  { id: "STU-16", nome: "ArteCode Studio", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Pré-Incubação", fomentoCaptado: 14000, dataEntrada: "2026-07-19", responsavel: "Marina Duarte", empregosGerados: 1, mentoriasRealizadas: 2, ultimaMentoria: "2026-09-02", proximaMentoria: { data: "2026-09-24", hora: "14:00", consultor: "Marina Duarte", tema: "Pitch de Validação", formato: "Online" }, diasSemMentoria: 8, precisaAtencao: false, maturidade: 47, dataDiagnostico: "2026-07-26" },
  { id: "STU-17", nome: "HidroVerde Irrigação", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Validação", fomentoCaptado: 38500, dataEntrada: "2026-06-26", responsavel: "Rafael Prado", empregosGerados: 2, mentoriasRealizadas: 3, ultimaMentoria: "2026-09-09", proximaMentoria: null, diasSemMentoria: 1, precisaAtencao: false, maturidade: 53, dataDiagnostico: "2026-07-03" },
  { id: "STU-18", nome: "FinPonto Pagamentos", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Validação", fomentoCaptado: 37000, dataEntrada: "2026-06-09", responsavel: "Diego Nakamura", empregosGerados: 3, mentoriasRealizadas: 3, ultimaMentoria: "2026-09-01", proximaMentoria: { data: "2026-09-22", hora: "09:00", consultor: "Diego Nakamura", tema: "Proposta de Valor", formato: "Online" }, diasSemMentoria: 9, precisaAtencao: false, maturidade: 54, dataDiagnostico: "2026-06-16" },
  { id: "STU-19", nome: "ModulaPeças", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Validação", fomentoCaptado: 35000, dataEntrada: "2026-06-16", responsavel: "Camila Reis", empregosGerados: 2, mentoriasRealizadas: 3, ultimaMentoria: "2026-09-03", proximaMentoria: { data: "2026-09-28", hora: "09:00", consultor: "Camila Reis", tema: "Marketing Digital para Startups", formato: "Online" }, diasSemMentoria: 7, precisaAtencao: false, maturidade: 55, dataDiagnostico: "2026-06-23" },
  { id: "STU-20", nome: "SaúdeConecta", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Validação", fomentoCaptado: 33500, dataEntrada: "2026-06-23", responsavel: "Marina Duarte", empregosGerados: 2, mentoriasRealizadas: 3, ultimaMentoria: "2026-09-08", proximaMentoria: null, diasSemMentoria: 2, precisaAtencao: false, maturidade: 56, dataDiagnostico: "2026-06-30" },
  { id: "STU-21", nome: "MentoraEdu", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Validação", fomentoCaptado: 31500, dataEntrada: "2026-06-06", responsavel: "Rafael Prado", empregosGerados: 3, mentoriasRealizadas: 3, ultimaMentoria: "2026-08-26", proximaMentoria: { data: "2026-09-14", hora: "14:00", consultor: "Rafael Prado", tema: "Indicadores Financeiros e de Desempenho", formato: "Online" }, diasSemMentoria: 15, precisaAtencao: false, maturidade: 50, dataDiagnostico: "2026-06-13" },
  { id: "STU-22", nome: "CriaLab Design", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Validação", fomentoCaptado: 37000, dataEntrada: "2026-06-13", responsavel: "Diego Nakamura", empregosGerados: 2, mentoriasRealizadas: 3, ultimaMentoria: "2026-09-04", proximaMentoria: null, diasSemMentoria: 6, precisaAtencao: false, maturidade: 51, dataDiagnostico: "2026-06-20" },
  { id: "STU-23", nome: "TerraClima Análises", setor: "AgTech / Meio Ambiente", descricaoAtual: "Monitoramento remoto de solo, água e clima", cicloAtual: "Validação", fomentoCaptado: 35500, dataEntrada: "2026-06-20", responsavel: "Camila Reis", empregosGerados: 2, mentoriasRealizadas: 3, ultimaMentoria: "2026-09-08", proximaMentoria: null, diasSemMentoria: 2, precisaAtencao: false, maturidade: 52, dataDiagnostico: "2026-06-27" },
  { id: "STU-24", nome: "GovDigital ABC", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Operação", fomentoCaptado: 57500, dataEntrada: "2026-05-03", responsavel: "Marina Duarte", empregosGerados: 4, mentoriasRealizadas: 5, ultimaMentoria: "2026-08-20", proximaMentoria: null, diasSemMentoria: 21, precisaAtencao: false, maturidade: 58, dataDiagnostico: "2026-05-10" },
  { id: "STU-25", nome: "FormaTech Industrial", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Operação", fomentoCaptado: 54500, dataEntrada: "2026-05-10", responsavel: "Rafael Prado", empregosGerados: 3, mentoriasRealizadas: 5, ultimaMentoria: "2026-09-08", proximaMentoria: null, diasSemMentoria: 2, precisaAtencao: false, maturidade: 59, dataDiagnostico: "2026-05-17" },
  { id: "STU-26", nome: "PulseHealth Monitoramento", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Operação", fomentoCaptado: 64000, dataEntrada: "2026-05-17", responsavel: "Diego Nakamura", empregosGerados: 3, mentoriasRealizadas: 4, ultimaMentoria: "2026-08-19", proximaMentoria: null, diasSemMentoria: 22, precisaAtencao: true, maturidade: 60, dataDiagnostico: "2026-05-24" },
  { id: "STU-27", nome: "ClassePlay", setor: "EdTech", descricaoAtual: "Plataforma de aprendizagem adaptativa para educação básica", cicloAtual: "Operação", fomentoCaptado: 61000, dataEntrada: "2026-05-24", responsavel: "Camila Reis", empregosGerados: 4, mentoriasRealizadas: 4, ultimaMentoria: "2026-09-03", proximaMentoria: { data: "2026-09-29", hora: "10:30", consultor: "Camila Reis", tema: "CRM e Gestão Comercial", formato: "Presencial" }, diasSemMentoria: 7, precisaAtencao: false, maturidade: 61, dataDiagnostico: "2026-05-31" },
  { id: "STU-28", nome: "MosaicoMídia", setor: "Economia Criativa", descricaoAtual: "Produção de conteúdo e design para marcas locais", cicloAtual: "Operação", fomentoCaptado: 58000, dataEntrada: "2026-05-07", responsavel: "Marina Duarte", empregosGerados: 3, mentoriasRealizadas: 5, ultimaMentoria: "2026-09-07", proximaMentoria: null, diasSemMentoria: 3, precisaAtencao: false, maturidade: 55, dataDiagnostico: "2026-05-14" },
  { id: "STU-29", nome: "PayLoop Soluções", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Operação", fomentoCaptado: 55000, dataEntrada: "2026-05-14", responsavel: "Rafael Prado", empregosGerados: 3, mentoriasRealizadas: 5, ultimaMentoria: "2026-09-09", proximaMentoria: null, diasSemMentoria: 1, precisaAtencao: false, maturidade: 56, dataDiagnostico: "2026-05-21" },
  { id: "STU-30", nome: "PrecisaMake", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Tração", fomentoCaptado: 102500, dataEntrada: "2026-04-21", responsavel: "Diego Nakamura", empregosGerados: 5, mentoriasRealizadas: 7, ultimaMentoria: "2026-09-10", proximaMentoria: null, diasSemMentoria: 0, precisaAtencao: false, maturidade: 62, dataDiagnostico: "2026-04-28" },
  { id: "STU-31", nome: "NeuroScan Labs", setor: "HealthTech", descricaoAtual: "Solução digital para diagnóstico e acompanhamento de pacientes", cicloAtual: "Tração", fomentoCaptado: 98000, dataEntrada: "2026-04-04", responsavel: "Camila Reis", empregosGerados: 4, mentoriasRealizadas: 14, ultimaMentoria: "2026-09-02", proximaMentoria: { data: "2026-09-25", hora: "15:30", consultor: "Camila Reis", tema: "Gestão Financeira para Startups", formato: "Presencial" }, diasSemMentoria: 8, precisaAtencao: false, maturidade: 63, dataDiagnostico: "2026-04-11" },
  { id: "STU-32", nome: "RegulaTech Compliance", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Tração", fomentoCaptado: 93000, dataEntrada: "2026-04-11", responsavel: "Marina Duarte", empregosGerados: 4, mentoriasRealizadas: 7, ultimaMentoria: "2026-09-03", proximaMentoria: { data: "2026-09-30", hora: "14:00", consultor: "Marina Duarte", tema: "Indicadores Financeiros e de Desempenho", formato: "Online" }, diasSemMentoria: 7, precisaAtencao: false, maturidade: 64, dataDiagnostico: "2026-04-18" },
  { id: "STU-33", nome: "MetalFlex Componentes", setor: "IndTech / Manufatura", descricaoAtual: "Automação de linha de produção e controle de qualidade", cicloAtual: "Escala", fomentoCaptado: 130000, dataEntrada: "2026-03-18", responsavel: "Rafael Prado", empregosGerados: 7, mentoriasRealizadas: 18, ultimaMentoria: "2026-09-09", proximaMentoria: null, diasSemMentoria: 1, precisaAtencao: false, maturidade: 70, dataDiagnostico: "2026-03-25" },
  { id: "STU-34", nome: "ImpactoPay Social", setor: "Outros (GovTech, Fintech)", descricaoAtual: "Solução digital de pagamentos e serviços públicos", cicloAtual: "Graduação", fomentoCaptado: 196000, dataEntrada: "2026-02-25", responsavel: "Diego Nakamura", empregosGerados: 8, mentoriasRealizadas: 24, ultimaMentoria: "2026-09-07", proximaMentoria: null, diasSemMentoria: 3, precisaAtencao: false, maturidade: 76, dataDiagnostico: "2026-03-04" },
];

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

// --- Cronograma de mentorias (mockup) -----------------------------------------
// Uma linha por mentoria (Realizada / Agendada / Cancelada), como a aba
// Mentorias da planilha. As realizadas por mês batem exatamente com
// serieMensal.mentorias; as agendadas são as próximas 3 semanas a partir de
// dataReferencia. "aConfirmar" = agendada cuja data já passou sem registro.
// Os campos de acompanhamento em startups[] (última/próxima mentoria, dias sem
// mentoria, maturidade) seguem este cronograma.
window.APP_DATA.incubadora.parametros = { alertaDiasSemMentoria: 21 };
Object.assign(window.APP_DATA.incubadora.kpis, {mentoriasAgendadas: 14, mentoriasAConfirmar: 1, startupsPrecisandoAtencao: 1});
window.APP_DATA.incubadora.mentorias = [
  { data: "2026-01-01", hora: "09:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-01-05", hora: "10:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-01-08", hora: "14:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-01-13", hora: "15:30", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-01-16", hora: "09:00", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-01-20", hora: "10:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-01-23", hora: "14:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-01-28", hora: "15:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-02-02", hora: "09:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-02-04", hora: "10:30", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-02-06", hora: "14:00", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-02-10", hora: "15:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-02-12", hora: "09:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-02-16", hora: "10:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-02-18", hora: "14:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-02-20", hora: "15:30", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-02-24", hora: "09:00", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-02-26", hora: "10:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-03-02", hora: "14:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-03-03", hora: "15:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-03-05", hora: "09:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-03-09", hora: "10:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-03-11", hora: "14:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-03-13", hora: "15:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-03-17", hora: "09:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-03-18", hora: "10:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-03-20", hora: "14:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-03-24", hora: "15:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-03-26", hora: "09:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-03-30", hora: "10:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-04-01", hora: "14:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-04-02", hora: "15:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-04-06", hora: "09:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-04-07", hora: "10:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-04-09", hora: "14:00", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-04-10", hora: "15:30", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-04-14", hora: "09:00", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-04-16", hora: "10:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-04-17", hora: "14:00", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-04-21", hora: "15:30", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-04-22", hora: "09:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-04-24", hora: "10:30", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-04-27", hora: "14:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-04-29", hora: "15:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-05-01", hora: "09:00", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-05-04", hora: "10:30", startupId: "STU-24", startup: "GovDigital ABC", consultor: "Marina Duarte", fase: "S4", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-05-05", hora: "14:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-05-06", hora: "15:30", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-05-07", hora: "09:00", startupId: "STU-28", startup: "MosaicoMídia", consultor: "Marina Duarte", fase: "S4", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-05-08", hora: "10:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-05-12", hora: "14:00", startupId: "STU-25", startup: "FormaTech Industrial", consultor: "Rafael Prado", fase: "S4", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-05-13", hora: "15:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-05-14", hora: "09:00", startupId: "STU-29", startup: "PayLoop Soluções", consultor: "Rafael Prado", fase: "S4", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-05-15", hora: "10:30", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-05-18", hora: "14:00", startupId: "STU-26", startup: "PulseHealth Monitoramento", consultor: "Diego Nakamura", fase: "S4", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-05-19", hora: "15:30", startupId: "STU-24", startup: "GovDigital ABC", consultor: "Marina Duarte", fase: "S4", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-05-21", hora: "09:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-05-22", hora: "10:30", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-05-25", hora: "14:00", startupId: "STU-27", startup: "ClassePlay", consultor: "Camila Reis", fase: "S4", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-05-26", hora: "15:30", startupId: "STU-28", startup: "MosaicoMídia", consultor: "Marina Duarte", fase: "S4", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-05-27", hora: "09:00", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-05-28", hora: "10:30", startupId: "STU-25", startup: "FormaTech Industrial", consultor: "Rafael Prado", fase: "S4", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-06-01", hora: "14:00", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-06-02", hora: "15:30", startupId: "STU-29", startup: "PayLoop Soluções", consultor: "Rafael Prado", fase: "S4", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-06-03", hora: "09:00", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-06-04", hora: "10:30", startupId: "STU-26", startup: "PulseHealth Monitoramento", consultor: "Diego Nakamura", fase: "S4", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-06-05", hora: "14:00", startupId: "STU-24", startup: "GovDigital ABC", consultor: "Marina Duarte", fase: "S4", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-06-08", hora: "15:30", startupId: "STU-21", startup: "MentoraEdu", consultor: "Rafael Prado", fase: "S2", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-06-09", hora: "09:00", startupId: "STU-18", startup: "FinPonto Pagamentos", consultor: "Diego Nakamura", fase: "S2", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-06-10", hora: "10:30", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-06-11", hora: "14:00", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-06-12", hora: "15:30", startupId: "STU-27", startup: "ClassePlay", consultor: "Camila Reis", fase: "S4", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-06-16", hora: "09:00", startupId: "STU-19", startup: "ModulaPeças", consultor: "Camila Reis", fase: "S2", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-06-17", hora: "10:30", startupId: "STU-22", startup: "CriaLab Design", consultor: "Diego Nakamura", fase: "S2", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-06-18", hora: "14:00", startupId: "STU-28", startup: "MosaicoMídia", consultor: "Marina Duarte", fase: "S4", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-06-19", hora: "15:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-06-22", hora: "09:00", startupId: "STU-23", startup: "TerraClima Análises", consultor: "Camila Reis", fase: "S2", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-06-23", hora: "10:30", startupId: "STU-20", startup: "SaúdeConecta", consultor: "Marina Duarte", fase: "S2", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-06-24", hora: "14:00", startupId: "STU-25", startup: "FormaTech Industrial", consultor: "Rafael Prado", fase: "S4", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-06-25", hora: "15:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-06-26", hora: "09:00", startupId: "STU-17", startup: "HidroVerde Irrigação", consultor: "Rafael Prado", fase: "S2", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-06-29", hora: "10:30", startupId: "STU-29", startup: "PayLoop Soluções", consultor: "Rafael Prado", fase: "S4", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-07-01", hora: "14:00", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-07-02", hora: "15:30", startupId: "STU-26", startup: "PulseHealth Monitoramento", consultor: "Diego Nakamura", fase: "S4", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-07-03", hora: "09:00", startupId: "STU-24", startup: "GovDigital ABC", consultor: "Marina Duarte", fase: "S4", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-07-07", hora: "10:30", startupId: "STU-14", startup: "MedaVida Telemedicina", consultor: "Diego Nakamura", fase: "S1", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-07-08", hora: "14:00", startupId: "STU-11", startup: "VerdeTech Soluções", consultor: "Camila Reis", fase: "S1", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-07-10", hora: "15:30", startupId: "STU-21", startup: "MentoraEdu", consultor: "Rafael Prado", fase: "S2", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-07-13", hora: "09:00", startupId: "STU-08", startup: "BioSinal Saúde", consultor: "Marina Duarte", fase: "S1", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-07-15", hora: "10:30", startupId: "STU-12", startup: "CidadeConecta GovTech", consultor: "Marina Duarte", fase: "S1", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-07-16", hora: "14:00", startupId: "STU-15", startup: "SabTech Educação", consultor: "Camila Reis", fase: "S1", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-07-17", hora: "15:30", startupId: "STU-18", startup: "FinPonto Pagamentos", consultor: "Diego Nakamura", fase: "S2", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-07-21", hora: "09:00", startupId: "STU-09", startup: "EduTrilha", consultor: "Rafael Prado", fase: "S1", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-07-22", hora: "10:30", startupId: "STU-13", startup: "AçoNova Manufatura", consultor: "Rafael Prado", fase: "S1", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-07-24", hora: "14:00", startupId: "STU-16", startup: "ArteCode Studio", consultor: "Marina Duarte", fase: "S1", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-07-27", hora: "15:30", startupId: "STU-10", startup: "CenaViva Produções", consultor: "Diego Nakamura", fase: "S1", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-07-29", hora: "09:00", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-07-30", hora: "10:30", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-03", hora: "14:00", startupId: "STU-27", startup: "ClassePlay", consultor: "Camila Reis", fase: "S4", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-08-03", hora: "15:30", startupId: "STU-19", startup: "ModulaPeças", consultor: "Camila Reis", fase: "S2", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-08-04", hora: "09:00", startupId: "STU-07", startup: "PrimeCorte Robótica", consultor: "Camila Reis", fase: "S1", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-05", hora: "10:30", startupId: "STU-22", startup: "CriaLab Design", consultor: "Diego Nakamura", fase: "S2", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-08-06", hora: "14:00", startupId: "STU-28", startup: "MosaicoMídia", consultor: "Marina Duarte", fase: "S4", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-08-07", hora: "15:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-10", hora: "09:00", startupId: "STU-23", startup: "TerraClima Análises", consultor: "Camila Reis", fase: "S2", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-08-11", hora: "10:30", startupId: "STU-20", startup: "SaúdeConecta", consultor: "Marina Duarte", fase: "S2", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-08-12", hora: "14:00", startupId: "STU-25", startup: "FormaTech Industrial", consultor: "Rafael Prado", fase: "S4", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-13", hora: "15:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-08-14", hora: "09:00", startupId: "STU-17", startup: "HidroVerde Irrigação", consultor: "Rafael Prado", fase: "S2", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-08-17", hora: "10:30", startupId: "STU-29", startup: "PayLoop Soluções", consultor: "Rafael Prado", fase: "S4", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-18", hora: "14:00", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-08-19", hora: "15:30", startupId: "STU-26", startup: "PulseHealth Monitoramento", consultor: "Diego Nakamura", fase: "S4", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-08-20", hora: "09:00", startupId: "STU-24", startup: "GovDigital ABC", consultor: "Marina Duarte", fase: "S4", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-21", hora: "10:30", startupId: "STU-06", startup: "PagaFácil Fintech", consultor: "Diego Nakamura", fase: "S1", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-08-24", hora: "14:00", startupId: "STU-14", startup: "MedaVida Telemedicina", consultor: "Diego Nakamura", fase: "S1", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-08-25", hora: "15:30", startupId: "STU-11", startup: "VerdeTech Soluções", consultor: "Camila Reis", fase: "S1", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-26", hora: "09:00", startupId: "STU-21", startup: "MentoraEdu", consultor: "Rafael Prado", fase: "S2", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-08-27", hora: "10:30", startupId: "STU-08", startup: "BioSinal Saúde", consultor: "Marina Duarte", fase: "S1", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-08-28", hora: "14:00", startupId: "STU-12", startup: "CidadeConecta GovTech", consultor: "Marina Duarte", fase: "S1", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-08-31", hora: "15:30", startupId: "STU-15", startup: "SabTech Educação", consultor: "Camila Reis", fase: "S1", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-01", hora: "09:00", startupId: "STU-18", startup: "FinPonto Pagamentos", consultor: "Diego Nakamura", fase: "S2", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-01", hora: "10:30", startupId: "STU-09", startup: "EduTrilha", consultor: "Rafael Prado", fase: "S1", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-09-01", hora: "14:00", startupId: "STU-13", startup: "AçoNova Manufatura", consultor: "Rafael Prado", fase: "S1", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-02", hora: "09:00", startupId: "STU-10", startup: "CenaViva Produções", consultor: "Diego Nakamura", fase: "S1", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-09-02", hora: "10:30", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-02", hora: "15:30", startupId: "STU-16", startup: "ArteCode Studio", consultor: "Marina Duarte", fase: "S1", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-03", hora: "09:00", startupId: "STU-27", startup: "ClassePlay", consultor: "Camila Reis", fase: "S4", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-03", hora: "14:00", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-03", hora: "15:30", startupId: "STU-19", startup: "ModulaPeças", consultor: "Camila Reis", fase: "S2", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-09-04", hora: "10:30", startupId: "STU-07", startup: "PrimeCorte Robótica", consultor: "Camila Reis", fase: "S1", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-04", hora: "14:00", startupId: "STU-22", startup: "CriaLab Design", consultor: "Diego Nakamura", fase: "S2", tema: "Crescimento para Startups (Growth)", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-09-07", hora: "09:00", startupId: "STU-28", startup: "MosaicoMídia", consultor: "Marina Duarte", fase: "S4", tema: "Proposta de Valor", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-07", hora: "10:30", startupId: "STU-34", startup: "ImpactoPay Social", consultor: "Diego Nakamura", fase: "S6", tema: "Business Model Canvas", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-09-07", hora: "15:30", startupId: "STU-04", startup: "AteliêDigital Design", consultor: "Marina Duarte", fase: "S1", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-08", hora: "09:00", startupId: "STU-25", startup: "FormaTech Industrial", consultor: "Rafael Prado", fase: "S4", tema: "Marketing Digital para Startups", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-09-08", hora: "14:00", startupId: "STU-23", startup: "TerraClima Análises", consultor: "Camila Reis", fase: "S2", tema: "Pitch de Validação", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-08", hora: "15:30", startupId: "STU-20", startup: "SaúdeConecta", consultor: "Marina Duarte", fase: "S2", tema: "Gestão Financeira para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-09", hora: "10:30", startupId: "STU-33", startup: "MetalFlex Componentes", consultor: "Rafael Prado", fase: "S6", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-09", hora: "14:00", startupId: "STU-17", startup: "HidroVerde Irrigação", consultor: "Rafael Prado", fase: "S2", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-09", hora: "15:30", startupId: "STU-29", startup: "PayLoop Soluções", consultor: "Rafael Prado", fase: "S4", tema: "Design Sprint", formato: "Presencial", horas: 1.5, status: "Realizada", aConfirmar: false },
  { data: "2026-09-09", hora: "16:00", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "Pitch de Validação", formato: "Online", horas: 1, status: "Agendada", aConfirmar: true },
  { data: "2026-09-10", hora: "09:00", startupId: "STU-01", startup: "ForjaTech Automação", consultor: "Rafael Prado", fase: "S1", tema: "Propriedade Intelectual", formato: "Presencial", horas: 2, status: "Realizada", aConfirmar: false },
  { data: "2026-09-10", hora: "10:30", startupId: "STU-30", startup: "PrecisaMake", consultor: "Diego Nakamura", fase: "S5", tema: "Vendas para Startups", formato: "Online", horas: 1, status: "Realizada", aConfirmar: false },
  { data: "2026-09-11", hora: "10:30", startupId: "STU-11", startup: "VerdeTech Soluções", consultor: "Camila Reis", fase: "S1", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 1, status: "Agendada", aConfirmar: false },
  { data: "2026-09-14", hora: "14:00", startupId: "STU-21", startup: "MentoraEdu", consultor: "Rafael Prado", fase: "S2", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1.5, status: "Agendada", aConfirmar: false },
  { data: "2026-09-15", hora: "15:30", startupId: "STU-08", startup: "BioSinal Saúde", consultor: "Marina Duarte", fase: "S1", tema: "Design Sprint", formato: "Presencial", horas: 2, status: "Agendada", aConfirmar: false },
  { data: "2026-09-16", hora: "09:00", startupId: "STU-12", startup: "CidadeConecta GovTech", consultor: "Marina Duarte", fase: "S1", tema: "Propriedade Intelectual", formato: "Online", horas: 1, status: "Agendada", aConfirmar: false },
  { data: "2026-09-17", hora: "10:30", startupId: "STU-15", startup: "SabTech Educação", consultor: "Camila Reis", fase: "S1", tema: "Vendas para Startups", formato: "Presencial", horas: 1.5, status: "Agendada", aConfirmar: false },
  { data: "2026-09-18", hora: "14:00", startupId: "STU-09", startup: "EduTrilha", consultor: "Rafael Prado", fase: "S1", tema: "Crescimento para Startups (Growth)", formato: "Online", horas: 2, status: "Agendada", aConfirmar: false },
  { data: "2026-09-21", hora: "15:30", startupId: "STU-13", startup: "AçoNova Manufatura", consultor: "Rafael Prado", fase: "S1", tema: "Dashboards e Indicadores", formato: "Presencial", horas: 1, status: "Agendada", aConfirmar: false },
  { data: "2026-09-22", hora: "09:00", startupId: "STU-18", startup: "FinPonto Pagamentos", consultor: "Diego Nakamura", fase: "S2", tema: "Proposta de Valor", formato: "Online", horas: 1.5, status: "Agendada", aConfirmar: false },
  { data: "2026-09-23", hora: "10:30", startupId: "STU-10", startup: "CenaViva Produções", consultor: "Diego Nakamura", fase: "S1", tema: "Business Model Canvas", formato: "Presencial", horas: 2, status: "Agendada", aConfirmar: false },
  { data: "2026-09-24", hora: "14:00", startupId: "STU-16", startup: "ArteCode Studio", consultor: "Marina Duarte", fase: "S1", tema: "Pitch de Validação", formato: "Online", horas: 1, status: "Agendada", aConfirmar: false },
  { data: "2026-09-25", hora: "15:30", startupId: "STU-31", startup: "NeuroScan Labs", consultor: "Camila Reis", fase: "S5", tema: "Gestão Financeira para Startups", formato: "Presencial", horas: 1.5, status: "Agendada", aConfirmar: false },
  { data: "2026-09-28", hora: "09:00", startupId: "STU-19", startup: "ModulaPeças", consultor: "Camila Reis", fase: "S2", tema: "Marketing Digital para Startups", formato: "Online", horas: 2, status: "Agendada", aConfirmar: false },
  { data: "2026-09-29", hora: "10:30", startupId: "STU-27", startup: "ClassePlay", consultor: "Camila Reis", fase: "S4", tema: "CRM e Gestão Comercial", formato: "Presencial", horas: 1, status: "Agendada", aConfirmar: false },
  { data: "2026-09-30", hora: "14:00", startupId: "STU-32", startup: "RegulaTech Compliance", consultor: "Marina Duarte", fase: "S5", tema: "Indicadores Financeiros e de Desempenho", formato: "Online", horas: 1.5, status: "Agendada", aConfirmar: false },
];
