// Estado do seletor de período + utilitários de agregação das séries mensais.
// Nenhuma view guarda total "fixo": tudo é somado a partir dos arrays mensais
// em data/*.js conforme o período selecionado, então os números nunca
// divergem entre a Visão Geral e as telas de detalhe.
(function () {
  const PRESETS = {
    ytd: { label: "Acumulado 2026 (até Set)", from: 0, to: 8 },
    q3: { label: "3º trimestre 2026 (Jul–Set)", from: 6, to: 8 },
    mes: { label: "Setembro/2026", from: 8, to: 8 },
  };

  let current = "ytd";
  const listeners = [];

  function range() {
    return PRESETS[current];
  }

  function key() {
    return current;
  }

  function set(k) {
    if (!PRESETS[k] || k === current) return;
    current = k;
    listeners.forEach((fn) => fn(k));
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  // Soma um array mensal (9 posições, Jan–Set) dentro do período ativo.
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

  window.PERIOD = { PRESETS, range, key, set, onChange, sum, avg, last, slice, monthsInRange };
})();
