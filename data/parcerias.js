// Dados mockados do Painel Consolidado — Parque Tecnológico
// Base de parceiros e contrapartidas — 100% estimado/ilustrativo (não há hoje uma
// planilha real de valor econômico de parcerias; nomes de empresas são fictícios).
// Fonte única também para a tela "Monitoramento de Uso" (achata `contrapartidas`
// de todos os parceiros numa tabela só) — não duplicar em outro arquivo.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.parcerias = {
  months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"],
  monthLabels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"],
  // Valor econômico utilizado, acumulado no ano — métrica de "estoque" (como
  // startupsAtivas), por isso é lida com PERIOD.last(), não PERIOD.sum().
  valorUtilizadoMensal: [44000, 83000, 122000, 160000, 205000, 250000, 300000, 355000, 413800],
  parceiros: [
    {
      id: "PRC-01",
      sigla: "TB",
      nome: "TechBridge Soluções",
      razaoSocial: "TechBridge Soluções em TI Ltda.",
      segmento: "Consultoria em TI",
      statusFormalizacao: "Ativa",
      contrapartidas: [
        { categoria: "Mentoria", descricao: "Mentorias técnicas para startups em fase de validação", quantidadePrevista: 24, quantidadeUtilizada: 14, unidade: "sessões", valorEconomico: 48000, vigenciaMeses: 12 },
        { categoria: "Solução tecnológica", descricao: "Licenças de plataforma de gestão de projetos", quantidadePrevista: 20, quantidadeUtilizada: 20, unidade: "licenças", valorEconomico: 36000, vigenciaMeses: 12 },
        { categoria: "Hora de palestra", descricao: "Palestras sobre transformação digital", quantidadePrevista: 8, quantidadeUtilizada: 5, unidade: "horas", valorEconomico: 12000, vigenciaMeses: 12 },
      ],
    },
    {
      id: "PRC-02",
      sigla: "VD",
      nome: "Instituto Vetor Digital",
      razaoSocial: "Instituto Vetor Digital de Pesquisa Aplicada",
      segmento: "ICT / Pesquisa",
      statusFormalizacao: "Ativa",
      contrapartidas: [
        { categoria: "Bolsa de estudo", descricao: "Bolsas de iniciação científica em tecnologia", quantidadePrevista: 10, quantidadeUtilizada: 6, unidade: "bolsas", valorEconomico: 90000, vigenciaMeses: 12 },
        { categoria: "Infraestrutura física", descricao: "Cessão de laboratório de prototipagem", quantidadePrevista: 500, quantidadeUtilizada: 210, unidade: "horas técnicas", valorEconomico: 175000, vigenciaMeses: 24 },
        { categoria: "Serviço", descricao: "Consultoria em propriedade intelectual", quantidadePrevista: 40, quantidadeUtilizada: 12, unidade: "horas", valorEconomico: 20000, vigenciaMeses: 12 },
      ],
    },
    {
      id: "PRC-03",
      sigla: "GN",
      nome: "GrupoNex Engenharia",
      razaoSocial: "GrupoNex Engenharia e Manufatura S.A.",
      segmento: "Indústria / Manufatura",
      statusFormalizacao: "Em negociação",
      contrapartidas: [
        { categoria: "Notebooks/Equipamentos", descricao: "Doação de notebooks recondicionados para a incubadora", quantidadePrevista: 15, quantidadeUtilizada: 0, unidade: "notebooks", valorEconomico: 22500, vigenciaMeses: 12 },
        { categoria: "Infraestrutura física", descricao: "Cessão de galpão para testes de protótipo", quantidadePrevista: 300, quantidadeUtilizada: 0, unidade: "horas", valorEconomico: 60000, vigenciaMeses: 12 },
      ],
    },
    {
      id: "PRC-04",
      sigla: "CT",
      nome: "Cidadania Tech",
      razaoSocial: "Associação Cidadania Tech Santo André",
      segmento: "Terceiro setor",
      statusFormalizacao: "Ativa",
      contrapartidas: [
        { categoria: "Evento gratuito", descricao: "Oficinas gratuitas de programação para jovens de Santo André", quantidadePrevista: 12, quantidadeUtilizada: 9, unidade: "edições", valorEconomico: 54000, vigenciaMeses: 12 },
        { categoria: "Bolsa de estudo", descricao: "Bolsas de curso técnico para moradores do entorno", quantidadePrevista: 30, quantidadeUtilizada: 22, unidade: "bolsas", valorEconomico: 45000, vigenciaMeses: 12 },
      ],
    },
    {
      id: "PRC-05",
      sigla: "PC",
      nome: "Polo Consultoria Empresarial",
      razaoSocial: "Polo Consultoria Empresarial Ltda.",
      segmento: "Consultoria de negócios",
      statusFormalizacao: "Ativa",
      contrapartidas: [
        { categoria: "Serviço", descricao: "Consultoria em modelagem de negócios", quantidadePrevista: 60, quantidadeUtilizada: 38, unidade: "horas", valorEconomico: 30000, vigenciaMeses: 12 },
        { categoria: "Mentoria", descricao: "Mentoria em captação de investimento", quantidadePrevista: 18, quantidadeUtilizada: 10, unidade: "sessões", valorEconomico: 27000, vigenciaMeses: 12 },
      ],
    },
    {
      id: "PRC-06",
      sigla: "NR",
      nome: "NovaRede Conecta",
      razaoSocial: "NovaRede Conecta Telecomunicações Ltda.",
      segmento: "Telecom",
      statusFormalizacao: "Encerrada",
      contrapartidas: [
        { categoria: "Solução tecnológica", descricao: "Internet dedicada para o coworking", quantidadePrevista: 12, quantidadeUtilizada: 12, unidade: "meses", valorEconomico: 28800, vigenciaMeses: 12 },
      ],
    },
    {
      id: "PRC-07",
      sigla: "FE",
      nome: "Fábrica ABC Equipamentos",
      razaoSocial: "Fábrica ABC Equipamentos Industriais Ltda.",
      segmento: "Indústria",
      statusFormalizacao: "Ativa",
      contrapartidas: [
        { categoria: "Notebooks/Equipamentos", descricao: "Fornecimento de impressoras 3D para laboratório de manufatura", quantidadePrevista: 4, quantidadeUtilizada: 4, unidade: "equipamentos", valorEconomico: 68000, vigenciaMeses: 24 },
        { categoria: "Hora de palestra", descricao: "Palestras técnicas sobre manufatura avançada", quantidadePrevista: 6, quantidadeUtilizada: 3, unidade: "horas", valorEconomico: 9000, vigenciaMeses: 12 },
      ],
    },
  ],
};
