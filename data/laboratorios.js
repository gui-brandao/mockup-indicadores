// Dados mockados do Painel Consolidado — Parque Tecnológico
// Uso técnico dos laboratórios — 100% estimado/ilustrativo. Reaproveita os
// 3 laboratórios que já existem como dado real em data/metas.js (eixo 2:
// Conectividade, Inteligência Artificial, Manufatura Avançada), sem inventar
// um 4º nome. "Uso" (últimos 30 dias) e "% de utilização" são um retrato fixo
// — mesmo padrão já usado em data/os.js `snapshot` — enquanto `usosMensal` é
// a série acumulada do ano (lida com PERIOD.last(), como startupsAtivas).

window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.laboratorios = {
  months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"],
  monthLabels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"],
  referencia: "Últimos 30 dias · 12/08/2026 a 10/09/2026",
  laboratorios: [
    {
      nome: "Manufatura Avançada",
      usos: 18,
      horasPeriodo: 210,
      utilizacaoPct: 72,
      usosMensal: [15, 32, 48, 63, 80, 97, 113, 128, 142],
    },
    {
      nome: "Inteligência Artificial",
      usos: 21,
      horasPeriodo: 168,
      utilizacaoPct: 58,
      usosMensal: [18, 38, 58, 79, 100, 119, 138, 155, 168],
    },
    {
      nome: "Conectividade",
      usos: 9,
      horasPeriodo: 96,
      utilizacaoPct: 41,
      usosMensal: [8, 16, 25, 33, 42, 50, 58, 64, 71],
    },
  ],
  solicitacoes: [
    { id: "LAB-01", cliente: "VitaCare Diagnósticos", laboratorio: "Inteligência Artificial", projeto: "Modelo preditivo de diagnóstico por imagem", elegibilidade: "Elegível", data: "2026-09-15", respTecnico: "Rafael Prado", status: "Agendado", horas: null },
    { id: "LAB-02", cliente: "NeuroScan Labs", laboratorio: "Inteligência Artificial", projeto: "Classificador de sinais biomédicos", elegibilidade: "Elegível", data: "2026-09-05", respTecnico: "Rafael Prado", status: "Concluído", horas: 12 },
    { id: "LAB-03", cliente: "GrupoNex Engenharia", laboratorio: "Manufatura Avançada", projeto: "Peça sob medida — protótipo funcional", elegibilidade: "Elegível", data: "2026-09-03", respTecnico: "Diego Nakamura", status: "Concluído", horas: 8 },
    { id: "LAB-04", cliente: "AgroSensa Monitoramento", laboratorio: "Conectividade", projeto: "Sensor de umidade de solo em campo", elegibilidade: "Em análise", data: "2026-08-28", respTecnico: "Diego Nakamura", status: "Em atendimento", horas: 6 },
    { id: "LAB-05", cliente: "ForjaTech Automação", laboratorio: "Manufatura Avançada", projeto: "Estrutura para braço robótico", elegibilidade: "Elegível", data: "2026-08-25", respTecnico: "Diego Nakamura", status: "Concluído", horas: 15 },
    { id: "LAB-06", cliente: "Instituto Federal ABC", laboratorio: "Inteligência Artificial", projeto: "Dataset anotado para pesquisa aplicada", elegibilidade: "Elegível", data: "2026-08-20", respTecnico: "Rafael Prado", status: "Concluído", horas: 20 },
    { id: "LAB-07", cliente: "PrecisaMake", laboratorio: "Manufatura Avançada", projeto: "Ferramental para linha de montagem", elegibilidade: "Elegível", data: "2026-08-12", respTecnico: "Diego Nakamura", status: "Concluído", horas: 18 },
    { id: "LAB-08", cliente: "PagaFácil Fintech", laboratorio: "Conectividade", projeto: "Testes de latência para pagamento por proximidade", elegibilidade: "Elegível", data: "2026-08-05", respTecnico: "Camila Reis", status: "Concluído", horas: 10 },
  ],
};
