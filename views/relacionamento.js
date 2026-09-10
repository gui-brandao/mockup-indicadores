// Tela 5 — Relacionamento (CRM): Zoho CRM, onde atendimentos = interações.
(function () {
  const T = APP_THEME;

  function render() {
    const C = APP_DATA.crm;
    const meta111 = APP_DATA.metas.itens.find((m) => m.cod === "1.1.1");
    const parceriasRealizadas = C.parcerias.reduce((s, p) => s + p.realizado, 0);
    const parceriasMeta = C.parcerias.reduce((s, p) => s + p.meta, 0);

    const kpis =
      UI.kpiCard({ label: "Interações no período", value: fmt.num(PERIOD.sum(C.series.realizado)), sub: "atendimentos registrados no CRM", hero: true }) +
      UI.kpiCard({ label: "Empresas atendidas", value: fmt.num(C.empresasAtendidas), sub: "carteira ativa, YTD" }) +
      UI.kpiCard({ label: "Oportunidades ativas", value: fmt.num(C.oportunidadesAtivas), sub: "em negociação" }) +
      UI.kpiCard({ label: "Parcerias formalizadas", value: fmt.num(parceriasRealizadas), sub: `de ${fmt.num(parceriasMeta)} planejadas` });

    const parceriasRows = C.parcerias.map((p) => [
      `<span class="td-strong">${p.cod}</span>`,
      UI.esc(p.nome),
      `${fmt.num(p.realizado)} / ${fmt.num(p.meta)}`,
      UI.statusPill(p.status),
    ]);

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Planejado × Realizado",
          title: "Atendimentos de fomento (meta 1.1.1)",
          desc: "Interações do CRM alimentam diretamente a meta anual de fomento aos negócios.",
          bodyHtml: UI.chartBox("chart-crm-pr", 280) +
            UI.progressBar({ name: "Execução da meta anual", value: meta111.realizado, meta: meta111.meta, unit: "interações" }),
        })}
        ${UI.sectionCard({
          eyebrow: "Canais de atendimento",
          title: "Interações por canal",
          desc: "Distribuição do último mês do período selecionado.",
          bodyHtml: UI.chartBox("chart-crm-canal", 280),
        })}
      </div>

      <div class="grid grid-side-wide">
        ${UI.sectionCard({
          eyebrow: "Conversão",
          title: "Funil de relacionamento",
          desc: "Do primeiro contato ao encaminhamento para a incubação.",
          bodyHtml: UI.chartBox("chart-crm-funil", 260),
        })}
        ${UI.sectionCard({
          eyebrow: "Ecossistema de parcerias",
          title: "Parcerias para fomento ao ecossistema",
          desc: "Base para conversas com outras incubadoras e investidores.",
          bodyHtml: UI.dataTable({ columns: ["Cód.", "Parceria", "Realizado/Meta", "Status"], rows: parceriasRows }),
        })}
      </div>
    `;
  }

  function mount({ registerChart }) {
    const C = APP_DATA.crm;

    const chartPR = registerChart(echarts.init(document.getElementById("chart-crm-pr")));
    chartPR.setOption({
      color: [T.COLORS.gray300, T.COLORS.navy600],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(PERIOD.slice(C.monthLabels)),
      yAxis: T.valueAxis(),
      series: [
        { name: "Planejado", type: "bar", data: PERIOD.slice(C.series.planejado), barMaxWidth: 22 },
        { name: "Realizado", type: "bar", data: PERIOD.slice(C.series.realizado), barMaxWidth: 22 },
      ],
    });

    const chartCanal = registerChart(echarts.init(document.getElementById("chart-crm-canal")));
    chartCanal.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      legend: { ...T.legendDefaults({ bottom: 0, top: "auto", left: "center" }) },
      series: [
        {
          type: "pie",
          radius: ["44%", "70%"],
          center: ["50%", "42%"],
          itemStyle: { borderColor: "#fff", borderWidth: 2 },
          label: { formatter: "{d}%", fontSize: 11, fontWeight: 700, color: "#fff", position: "inside" },
          labelLine: { show: false },
          data: C.porCanal.map((c) => ({ name: c.canal, value: c.valor })),
        },
      ],
    });

    const chartFunil = registerChart(echarts.init(document.getElementById("chart-crm-funil")));
    chartFunil.setOption({
      color: [T.COLORS.navy600],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      series: [
        {
          type: "funnel",
          left: "6%",
          right: "6%",
          top: 6,
          bottom: 6,
          minSize: "36%",
          maxSize: "100%",
          gap: 6,
          label: { formatter: "{b}: {c}", color: "#fff", fontSize: 12, fontWeight: 700 },
          itemStyle: { borderColor: "#fff", borderWidth: 1 },
          data: C.funil.map((f, i) => ({
            name: f.etapa,
            value: f.valor,
            itemStyle: { color: T.SERIES_PALETTE[i % T.SERIES_PALETTE.length] },
          })),
        },
      ],
    });
  }

  window.VIEW_RELACIONAMENTO = {
    title: "Relacionamento (CRM)",
    subtitle: "Zoho CRM — atendimentos registrados como interações",
    render,
    mount,
  };
})();
