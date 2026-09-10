// Tela 4 — Operação (O.S.): espelha o Sistema de O.S. / Central Operacional.
(function () {
  const T = APP_THEME;

  function render() {
    const O = APP_DATA.os;
    const s = O.snapshot;

    const kpis =
      UI.kpiCard({ label: "Total de registros", value: fmt.num(s.total), sub: `Média de ${fmt.num1(s.mediaDia)} por dia`, hero: true, spark: PERIOD.slice(O.series.registros) }) +
      UI.kpiCard({ label: "Em aberto", value: fmt.num(s.emAberto), sub: `${fmt.num1((s.emAberto / s.total) * 100)}% do volume`, spark: O.serieEmAberto }) +
      UI.kpiCard({ label: "Finalizados", value: fmt.num(s.finalizados), sub: `Taxa de ${fmt.num1((s.finalizados / s.total) * 100)}%`, spark: O.serieFinalizados }) +
      UI.kpiCard({ label: "Urgentes em aberto", value: fmt.num(s.urgentes), sub: "atenção", spark: O.serieUrgentes }) +
      UI.kpiCard({ label: "Sem responsável", value: fmt.num(s.semResponsavel), sub: "registros abertos não atribuídos", spark: O.serieSemResponsavel });

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(5,minmax(0,1fr))">${kpis}</div>
      <div class="card-note">📌 ${UI.esc(s.referencia)} — indicadores desta faixa são fixos, como no sistema original.</div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Volume de entrada",
          title: "Tendência do período",
          desc: "Evolução dos registros criados dentro da janela de 30 dias.",
          bodyHtml: UI.chartBox("chart-os-trend", 300),
        })}
        ${UI.sectionCard({
          eyebrow: "Nível de atenção",
          title: "Pressão de urgência",
          desc: "Percentual de registros marcados como urgentes.",
          bodyHtml: UI.chartBox("chart-os-gauge", 220),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Distribuição da fila",
          title: "Panorama por status",
          desc: "Comparação direta entre as etapas do atendimento.",
          bodyHtml: UI.chartBox("chart-os-status", 260),
        })}
        ${UI.sectionCard({
          eyebrow: "Classificação",
          title: "Registros por categoria",
          meta: `Tempo médio: ${fmt.num1(O.tempoMedioResolucaoDias)} dias`,
          bodyHtml: UI.chartBox("chart-os-categoria", 260),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Carga de trabalho",
          title: "Registros por equipe responsável",
          bodyHtml: UI.chartBox("chart-os-equipe", 280),
        })}
        ${UI.sectionCard({
          eyebrow: "Qualidade do atendimento",
          title: "Tempo médio de resolução, mês a mês",
          desc: "Dias corridos entre abertura e conclusão do registro.",
          bodyHtml: UI.chartBox("chart-os-tempo", 280),
        })}
      </div>

      <div class="grid grid-2">
        ${UI.sectionCard({
          eyebrow: "Selecionado no topo",
          title: "Volume de registros por mês",
          desc: "Soma mensal conforme o período selecionado — mostra a sazonalidade do fluxo de solicitações.",
          bodyHtml: UI.chartBox("chart-os-monthly", 260),
        })}
        ${UI.sectionCard({
          eyebrow: "Cumprimento de prazo",
          title: "SLA — dentro × fora do prazo",
          desc: "Registros concluídos dentro do prazo combinado, por mês.",
          bodyHtml: UI.chartBox("chart-os-sla", 260),
        })}
      </div>
    `;
  }

  function mount({ registerChart }) {
    const O = APP_DATA.os;
    const s = O.snapshot;

    const chartTrend = registerChart(echarts.init(document.getElementById("chart-os-trend")));
    chartTrend.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 20 }),
      xAxis: T.categoryAxis(s.tendencia.dias, { axisLabel: { ...T.axisText(), interval: 2 } }),
      yAxis: T.valueAxis(),
      series: [
        {
          type: "line",
          data: s.tendencia.valores,
          smooth: 0.35,
          symbol: "none",
          areaStyle: { color: "rgba(47,122,184,0.14)" },
          lineStyle: { width: 2.5, color: T.SERIES_PALETTE[0] },
        },
      ],
    });

    const chartGauge = registerChart(echarts.init(document.getElementById("chart-os-gauge")));
    chartGauge.setOption({
      series: [
        {
          type: "gauge",
          min: 0,
          max: 15,
          startAngle: 200,
          endAngle: -20,
          radius: "100%",
          center: ["50%", "70%"],
          progress: { show: true, width: 16, itemStyle: { color: T.STATUS.critical } },
          axisLine: { lineStyle: { width: 16, color: [[1, T.COLORS.gray200]] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { formatter: (v) => v.toFixed(1) + "%", fontSize: 26, fontWeight: 800, color: T.COLORS.navy800, offsetCenter: [0, "-8%"] },
          title: { fontSize: 11, color: T.COLORS.gray500, offsetCenter: [0, "24%"] },
          data: [{ value: s.urgenciaPct, name: `${s.urgentes} urgente(s) no período` }],
        },
      ],
    });

    const chartStatus = registerChart(echarts.init(document.getElementById("chart-os-status")));
    chartStatus.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(s.porStatus.map((p) => p.status)),
      series: [{ type: "bar", data: s.porStatus.map((p) => p.valor), barMaxWidth: 22, itemStyle: { borderRadius: T.barRadius("horizontal") } }],
    });

    const chartCategoria = registerChart(echarts.init(document.getElementById("chart-os-categoria")));
    chartCategoria.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> registros (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center", type: "scroll" }),
      series: [
        {
          type: "pie",
          radius: ["46%", "70%"],
          center: ["50%", "42%"],
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11.5, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: O.categorias.map((c) => ({ name: c.categoria, value: c.valor })),
        },
      ],
    });

    const equipe = [...O.porEquipe].sort((a, b) => a.valor - b.valor);
    const chartEquipe = registerChart(echarts.init(document.getElementById("chart-os-equipe")));
    chartEquipe.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10, right: 24 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(equipe.map((e) => e.equipe)),
      series: [
        {
          type: "bar",
          data: equipe.map((e) => e.valor),
          barMaxWidth: 18,
          itemStyle: { borderRadius: T.barRadius("horizontal") },
          label: { show: true, position: "right", formatter: (p) => fmt.num(p.value), color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
        },
      ],
    });

    const chartTempo = registerChart(echarts.init(document.getElementById("chart-os-tempo")));
    chartTempo.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 20 }),
      xAxis: T.categoryAxis(O.monthLabels),
      yAxis: T.valueAxis(),
      series: [T.lineSeriesDefaults({ data: O.serieTempoMedio, itemStyle: { color: T.SERIES_PALETTE[0] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[0] } })],
    });

    const chartMonthly = registerChart(echarts.init(document.getElementById("chart-os-monthly")));
    chartMonthly.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 20 }),
      xAxis: T.categoryAxis(PERIOD.slice(O.monthLabels)),
      yAxis: T.valueAxis(),
      series: [{ type: "bar", data: PERIOD.slice(O.series.registros), barMaxWidth: 34, itemStyle: { borderRadius: T.barRadius() } }],
    });

    const chartSla = registerChart(echarts.init(document.getElementById("chart-os-sla")));
    chartSla.setOption({
      color: [T.STATUS.good, T.STATUS.critical],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(O.monthLabels),
      yAxis: T.valueAxis(),
      series: [
        { name: "Dentro do prazo", type: "bar", stack: "sla", data: O.slaMensal.dentro, barMaxWidth: 26, itemStyle: T.stackedItemStyle() },
        {
          name: "Fora do prazo",
          type: "bar",
          stack: "sla",
          data: O.slaMensal.fora,
          barMaxWidth: 26,
          itemStyle: Object.assign({ borderRadius: T.barRadius() }, T.stackedItemStyle()),
        },
      ],
    });
  }

  window.VIEW_OPERACAO = {
    title: "Operação (O.S.)",
    subtitle: "Sistema de O.S. — gestão operacional de projetos",
    render,
    mount,
  };
})();
