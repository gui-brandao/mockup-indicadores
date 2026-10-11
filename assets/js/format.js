// Formatação pt-BR reutilizada por todas as views.
(function () {
  const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
  const nfCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const nfCurrencyCompact = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 });

  function num(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return "—";
    return nf0.format(v);
  }

  function num1(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return "—";
    return nf1.format(v);
  }

  function pct(v, digits) {
    if (v === null || v === undefined || Number.isNaN(v)) return "—";
    return (digits === 1 ? nf1.format(v) : nf0.format(v)) + "%";
  }

  function compact(v) {
    if (v === null || v === undefined) return "—";
    if (v >= 1000) return nf1.format(v / 1000) + " mil";
    return nf0.format(v);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function currency(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return "—";
    return nfCurrency.format(v);
  }

  function currencyCompact(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return "—";
    return nfCurrencyCompact.format(v);
  }

  // Datas vêm como "AAAA-MM-DD" (sem fuso). Formatadas por texto/UTC — nunca
  // por new Date(iso) local, que no fuso de Brasília mostraria o dia anterior.
  const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const MESES_ABREV = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  function dataBr(iso) {
    const [a, m, d] = String(iso || "").split("-");
    return d ? `${d}/${m}/${a}` : "";
  }

  // "2026-10-14" → "qua, 14/out"
  function dataCurta(iso) {
    const [a, m, d] = String(iso || "").split("-").map(Number);
    if (!d) return "";
    const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
    return `${DIAS_SEMANA[dia]}, ${String(d).padStart(2, "0")}/${MESES_ABREV[m - 1]}`;
  }

  // Diferença em dias entre duas datas ISO (b − a).
  function diasEntre(a, b) {
    return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
  }

  // 0 → "hoje", 1 → "ontem", 12 → "há 12 dias"
  function haDias(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    if (n <= 0) return "hoje";
    if (n === 1) return "ontem";
    return `há ${nf0.format(n)} dias`;
  }

  window.fmt = { num, num1, pct, compact, clamp, currency, currencyCompact, dataBr, dataCurta, diasEntre, haDias };
})();
