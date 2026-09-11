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

  window.fmt = { num, num1, pct, compact, clamp, currency, currencyCompact };
})();
