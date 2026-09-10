// Dados mockados do Painel Consolidado — Parque Tecnológico
// Fonte: números reais do Sistema de Agenda / Sistema de O.S. (prints) e planilhas do plano FINEP (Consultores na Incubadora, BI Atendimento Empreendedorismo).
// Séries mensais e canais estimados de forma plausível onde não há dado real disponível.

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.metas = {
  "eixos": {
    "1": "Negócios e Empreendedorismo",
    "2": "Tecnologia e Laboratórios",
    "3": "Educação e Difusão",
    "4": "Gestão e Infraestrutura"
  },
  "itens": [
    {
      "cod": "1.1.1",
      "objetivo": "Atendimento especializado de fomento aos negócios",
      "eixo": 1,
      "meta": 6300,
      "realizado": 4654,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 73.9
    },
    {
      "cod": "1.1.2",
      "objetivo": "Incubadora de negócios e startups",
      "eixo": 1,
      "meta": 3360,
      "realizado": 2210,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 65.8
    },
    {
      "cod": "1.2.1",
      "objetivo": "Ciclo de aceleração de negócios e startups",
      "eixo": 1,
      "meta": 480,
      "realizado": 310,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 64.6
    },
    {
      "cod": "1.3.1",
      "objetivo": "Suporte à logística de ocupação e locação de espaços",
      "eixo": 1,
      "meta": 20600,
      "realizado": 12772,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 62.0
    },
    {
      "cod": "1.4.1",
      "objetivo": "Suporte aos demonstradores de soluções inovadoras",
      "eixo": 1,
      "meta": 8,
      "realizado": 5,
      "status": "Em execução",
      "unidade": "demonstradores",
      "pct": 62.5
    },
    {
      "cod": "2.1.1",
      "objetivo": "Suporte ao Programa de Inovação Aberta",
      "eixo": 2,
      "meta": 1,
      "realizado": 1,
      "status": "Em execução",
      "unidade": "plataforma",
      "pct": 60.0
    },
    {
      "cod": "2.2.1",
      "objetivo": "Operação do Laboratório de Conectividade",
      "eixo": 2,
      "meta": 10,
      "realizado": 6,
      "status": "Em execução",
      "unidade": "meses em operação",
      "pct": 60.0
    },
    {
      "cod": "2.2.2",
      "objetivo": "Operação do Laboratório de Inteligência Artificial",
      "eixo": 2,
      "meta": 10,
      "realizado": 7,
      "status": "Em execução",
      "unidade": "meses em operação",
      "pct": 70.0
    },
    {
      "cod": "2.2.3",
      "objetivo": "Operação do Laboratório de Manufatura Avançada",
      "eixo": 2,
      "meta": 10,
      "realizado": 5,
      "status": "Em execução",
      "unidade": "meses em operação",
      "pct": 50.0
    },
    {
      "cod": "2.2.4",
      "objetivo": "Suporte à transformação tecnológica (Indústria 4.0)",
      "eixo": 2,
      "meta": 4,
      "realizado": 0,
      "status": "Não iniciada",
      "unidade": "recursos IoT",
      "pct": 0.0
    },
    {
      "cod": "2.4.1",
      "objetivo": "Busca ativa de recursos e projetos de fomento",
      "eixo": 2,
      "meta": 2,
      "realizado": 1,
      "status": "Em execução",
      "unidade": "projetos submetidos",
      "pct": 50.0
    },
    {
      "cod": "2.4.2",
      "objetivo": "Parcerias com ICT fornecedoras de serviços tecnológicos",
      "eixo": 2,
      "meta": 3,
      "realizado": 2,
      "status": "Em execução",
      "unidade": "parcerias",
      "pct": 66.7
    },
    {
      "cod": "2.4.3",
      "objetivo": "Parceria com investidor de startups e negócios",
      "eixo": 2,
      "meta": 1,
      "realizado": 0,
      "status": "Em negociação",
      "unidade": "parcerias",
      "pct": 0.0
    },
    {
      "cod": "2.4.4",
      "objetivo": "Parcerias com rede de coworkings",
      "eixo": 2,
      "meta": 2,
      "realizado": 0,
      "status": "Não iniciada",
      "unidade": "coworkings",
      "pct": 0.0
    },
    {
      "cod": "3.1.1",
      "objetivo": "Ambiente Virtual de Aprendizagem (AVA)",
      "eixo": 3,
      "meta": 2500,
      "realizado": 1550,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 62.0
    },
    {
      "cod": "3.2.1",
      "objetivo": "Suporte a estudantes da educação formal (EJA/UNIVESP)",
      "eixo": 3,
      "meta": 1200,
      "realizado": 600,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 50.0
    },
    {
      "cod": "3.3.1",
      "objetivo": "Roteiros e oficinas pedagógicos de ciência e tecnologia",
      "eixo": 3,
      "meta": 8500,
      "realizado": 4930,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 58.0
    },
    {
      "cod": "3.4.1",
      "objetivo": "Visitas técnicas guiadas",
      "eixo": 3,
      "meta": 800,
      "realizado": 432,
      "status": "Em execução",
      "unidade": "atendimentos/ano",
      "pct": 54.0
    },
    {
      "cod": "3.5.1",
      "objetivo": "Eventos de ciência, tecnologia e empreendedorismo no CITE",
      "eixo": 3,
      "meta": 10,
      "realizado": 0,
      "status": "Não iniciada",
      "unidade": "eventos/ano",
      "pct": 0.0
    },
    {
      "cod": "3.6.1",
      "objetivo": "Participação em eventos externos de CT&I",
      "eixo": 3,
      "meta": 6,
      "realizado": 0,
      "status": "Não iniciada",
      "unidade": "eventos/ano",
      "pct": 0.0
    },
    {
      "cod": "4.1.1",
      "objetivo": "Formação continuada e planejamento das equipes",
      "eixo": 4,
      "meta": 12,
      "realizado": 8,
      "status": "Em execução",
      "unidade": "encontros",
      "pct": 66.7
    },
    {
      "cod": "4.2.1",
      "objetivo": "Controle de acessos e agendamento",
      "eixo": 4,
      "meta": null,
      "realizado": null,
      "status": "Em execução",
      "unidade": "",
      "pct": null
    },
    {
      "cod": "4.3.1",
      "objetivo": "Preservação de acervos",
      "eixo": 4,
      "meta": null,
      "realizado": null,
      "status": "Em execução",
      "unidade": "",
      "pct": null
    },
    {
      "cod": "4.4.1",
      "objetivo": "Portal digital de soluções e softwares integrados",
      "eixo": 4,
      "meta": null,
      "realizado": null,
      "status": "Em execução",
      "unidade": "",
      "pct": null
    },
    {
      "cod": "4.5.1",
      "objetivo": "Ações de comunicação (alcance digital)",
      "eixo": 4,
      "meta": 50000,
      "realizado": 54200,
      "status": "Concluída",
      "unidade": "visualizações",
      "pct": 108.4
    }
  ]
};
