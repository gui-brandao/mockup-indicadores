// Tela 11 — Pós-Atendimento: pesquisas de satisfação e follow-ups depois do
// atendimento. NPS calculado pela definição padrão (%promotores −
// %detratores), a partir da nota individual de cada pesquisa — nunca um
// número digitado fixo.
(function () {
  const T = APP_THEME;

  function npsClass(nps) {
    if (nps >= 9) return "promotor";
    if (nps >= 7) return "neutro";
    return "detrator";
  }

  function computeKpis(pesquisas) {
    const satisfacaoMedia = pesquisas.reduce((s, p) => s + p.satisfacao, 0) / pesquisas.length;
    const promotores = pesquisas.filter((p) => npsClass(p.nps) === "promotor").length;
    const neutros = pesquisas.filter((p) => npsClass(p.nps) === "neutro").length;
    const detratores = pesquisas.filter((p) => npsClass(p.nps) === "detrator").length;
    const npsMedio = ((promotores - detratores) / pesquisas.length) * 100;
    const pendentes = pesquisas.filter((p) => p.retorno && (p.resultado === "Pendente" || p.resultado === "Em andamento")).length;
    const resolvidos = pesquisas.filter((p) => p.retorno && (p.resultado === "Concluído" || p.resultado === "Fora do SLA"));
    const positivos = resolvidos.filter((p) => p.resultado === "Concluído");
    const retornoPositivoPct = resolvidos.length ? (positivos.length / resolvidos.length) * 100 : 0;
    return { satisfacaoMedia, promotores, neutros, detratores, npsMedio, pendentes, retornoPositivoPct };
  }

  function render() {
    const P = APP_DATA.posatendimento;
    const k = computeKpis(P.pesquisas);
    const total = P.pesquisas.length;

    const kpis =
      UI.kpiCard({ label: "Pesquisas respondidas", value: fmt.num(PERIOD.sum(P.pesquisasMensal)), sub: "no período", spark: PERIOD.slice(P.pesquisasMensal) }) +
      UI.kpiCard({ label: "Satisfação média", value: fmt.num1(k.satisfacaoMedia) + " / 5", sub: `${fmt.num(total)} pesquisas respondidas`, hero: true }) +
      UI.kpiCard({ label: "NPS médio", value: fmt.num1(k.npsMedio), sub: "% promotores − % detratores" }) +
      UI.kpiCard({ label: "Follow-ups pendentes", value: fmt.num(k.pendentes), sub: "retorno solicitado, ainda sem resultado" }) +
      UI.kpiCard({ label: "Retorno positivo", value: fmt.num1(k.retornoPositivoPct) + "%", sub: "entre os follow-ups já resolvidos" });

    const npsTotal = k.promotores + k.neutros + k.detratores || 1;
    const npsBar = `
      <div class="nps-bar">
        <div class="nps-bar-segment" style="width:${(k.promotores / npsTotal) * 100}%;background:${T.STATUS.good}"></div>
        <div class="nps-bar-segment" style="width:${(k.neutros / npsTotal) * 100}%;background:${T.STATUS.warning}"></div>
        <div class="nps-bar-segment" style="width:${(k.detratores / npsTotal) * 100}%;background:${T.STATUS.critical}"></div>
      </div>
      <div class="nps-legend">
        <span><span class="nps-legend-dot" style="background:${T.STATUS.good}"></span>Promotores (9–10) · ${fmt.num(k.promotores)}</span>
        <span><span class="nps-legend-dot" style="background:${T.STATUS.warning}"></span>Neutros (7–8) · ${fmt.num(k.neutros)}</span>
        <span><span class="nps-legend-dot" style="background:${T.STATUS.critical}"></span>Detratores (0–6) · ${fmt.num(k.detratores)}</span>
      </div>`;

    const rows = P.pesquisas.map((p) => [
      `<span class="td-strong">${UI.esc(p.cliente)}</span>`,
      UI.esc(p.servico),
      new Date(p.data).toLocaleDateString("pt-BR"),
      `${fmt.num(p.satisfacao)} / 5`,
      fmt.num(p.nps),
      p.followUpData ? new Date(p.followUpData).toLocaleDateString("pt-BR") : "<span class='td-muted'>—</span>",
      UI.esc(p.responsavel),
      UI.statusPill(p.resultado),
    ]);

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(5,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Net Promoter Score",
          title: "Distribuição de NPS",
          desc: "Classificação de cada pesquisa pela nota de recomendação (0–10).",
          bodyHtml: npsBar,
        })}
        ${UI.sectionCard({
          eyebrow: "Volume mensal",
          title: "Pesquisas respondidas por mês",
          bodyHtml: UI.chartBox("chart-pos-mensal", 240),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: `${fmt.num(total)} pesquisas`,
        title: "Pesquisas e follow-ups",
        desc: "Satisfação, NPS e status do retorno solicitado após o atendimento.",
        bodyHtml: UI.dataTable({
          columns: ["Cliente", "Serviço", "Data", "Satisfação", "NPS", "Follow-up", "Responsável", "Resultado"],
          rows,
        }),
      })}
    `;
  }

  function mount({ registerChart }) {
    const P = APP_DATA.posatendimento;

    const chartMensal = registerChart(echarts.init(document.getElementById("chart-pos-mensal")));
    chartMensal.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 12 }),
      xAxis: T.categoryAxis(P.monthLabels),
      yAxis: T.valueAxis(),
      series: [{ type: "bar", data: P.pesquisasMensal, barMaxWidth: 26, itemStyle: { borderRadius: T.barRadius() } }],
    });
  }

  window.VIEW_POSATENDIMENTO = {
    title: "Pós-Atendimento",
    subtitle: "Satisfação, NPS e follow-ups após o atendimento",
    render,
    mount,
  };
})();
