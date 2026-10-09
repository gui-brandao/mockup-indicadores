// Estado do seletor de período + utilitários de agregação das séries mensais.
// Nenhuma view guarda total "fixo": tudo é somado a partir dos arrays mensais
// em data/*.js conforme o período selecionado, então os números nunca
// divergem entre a Visão Geral e as telas de detalhe.
//
// Os meses disponíveis vêm dos dados: por padrão Jan–Set/2026 (o mock da
// apresentação); o painel da equipe chama PERIOD.configurar() com o ano e os
// meses que a planilha trouxe (Jan até o mês corrente).
(function () {
  const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  function montarPresets(ano, monthLabels) {
    const ultimo = monthLabels.length - 1;
    const inicioTri = Math.max(0, ultimo - 2);
    return {
      ytd: { label: `Acumulado ${ano} (até ${MESES_CURTOS[ultimo]})`, from: 0, to: ultimo },
      tri: { label: `Últimos 3 meses (${MESES_CURTOS[inicioTri]}–${MESES_CURTOS[ultimo]})`, from: inicioTri, to: ultimo },
      mes: { label: `${monthLabels[ultimo]}/${ano}`, from: ultimo, to: ultimo },
    };
  }

  let presets = montarPresets(2026, ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro"]);
  let current = "ytd";
  const listeners = [];

  function configurar({ ano, monthLabels }) {
    if (!ano || !monthLabels || !monthLabels.length) return;
    presets = montarPresets(ano, monthLabels);
    if (!presets[current]) current = "ytd";
  }

  function range() {
    return presets[current];
  }

  function key() {
    return current;
  }

  function set(k) {
    if (!presets[k] || k === current) return;
    current = k;
    listeners.forEach((fn) => fn(k));
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  // Soma um array mensal dentro do período ativo.
  function sum(arr) {
    if (!arr) return 0;
    const { from, to } = range();
    let s = 0;
    for (let i = from; i <= to; i++) s += arr[i] || 0;
    return s;
  }

  // Média de um array mensal dentro do período ativo.
  function avg(arr) {
    if (!arr) return 0;
    const { from, to } = range();
    let s = 0,
      n = 0;
    for (let i = from; i <= to; i++) {
      if (arr[i] !== undefined && arr[i] !== null) {
        s += arr[i];
        n++;
      }
    }
    return n ? s / n : 0;
  }

  // Último valor dentro do período ativo (para "snapshot" tipo gauge de %).
  function last(arr) {
    if (!arr) return null;
    const { to } = range();
    return arr[to];
  }

  // Quanto uma série acumulada do ano cresceu dentro do período ativo.
  function delta(arr) {
    if (!arr) return 0;
    const { from, to } = range();
    return (arr[to] || 0) - (from > 0 ? arr[from - 1] || 0 : 0);
  }

  // Fatia os meses (labels/valores) dentro do período ativo, preservando o
  // eixo temporal — usado nos gráficos de tendência.
  function slice(arr) {
    if (!arr) return [];
    const { from, to } = range();
    return arr.slice(from, to + 1);
  }

  function monthsInRange() {
    const { from, to } = range();
    return to - from + 1;
  }

  window.PERIOD = {
    get PRESETS() {
      return presets;
    },
    configurar,
    range,
    key,
    set,
    onChange,
    sum,
    avg,
    last,
    delta,
    slice,
    monthsInRange,
  };
})();
