// Tela 4 — Operação (O.S.): espelha o Sistema de O.S. / Central Operacional.
(function () {
  const T = APP_THEME;

  function render() {
    const O = APP_DATA.os;
    const s = O.snapshot;

    const kpis =
      UI.kpiCard({ label: "Total de registros", value: fmt.num(s.total), sub: `Média de ${fmt.num1(s.mediaDia)} por dia`, hero: true }) +
      UI.kpiCard({ label: "Em aberto", value: fmt.num(s.emAberto), sub: `${fmt.num1((s.emAberto / s.total) * 100)}% do volume` }) +
      UI.kpiCard({ label: "Finalizados", value: fmt.num(s.finalizados), sub: `Taxa de ${fmt.num1((s.finalizados / s.total) * 100)}%` }) +
      UI.kpiCard({ label: "Urgentes em aberto", value: fmt.num(s.urgentes), sub: "atenção" }) +
      UI.kpiCard({ label: "Sem responsável", value: fmt.num(s.semResponsavel), sub: "registros abertos não atribuídos" });

    const catRows = O.categorias.map((c) => [UI.esc(c.categoria), `<span class="td-strong">${fmt.num(c.valor)}</span>`]);

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
          bodyHtml: UI.dataTable({ columns: ["Categoria", "Registros"], rows: catRows, numericCols: [1] }),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "Selecionado no topo",
        title: "Volume de registros por mês",
        desc: "Soma mensal conforme o período selecionado — mostra a sazonalidade do fluxo de solicitações.",
        bodyHtml: UI.chartBox("chart-os-monthly", 260),
      })}
    `;
  }

  function mount({ registerChart }) {
    const O = APP_DATA.os;
    const s = O.snapshot;

    const chartTrend = registerChart(echarts.init(document.getElementById("chart-os-trend")));
    chartTrend.setOption({
      color: [T.COLORS.navy600],
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
          areaStyle: { color: "rgba(11,78,134,0.14)" },
          lineStyle: { width: 2.5 },
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
          progress: { show: true, width: 16, itemStyle: { color: T.COLORS.red500 } },
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
      color: [T.COLORS.green600],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(s.porStatus.map((p) => p.status)),
      series: [{ type: "bar", data: s.porStatus.map((p) => p.valor), barMaxWidth: 22, itemStyle: { borderRadius: [0, 6, 6, 0] } }],
    });

    const chartMonthly = registerChart(echarts.init(document.getElementById("chart-os-monthly")));
    chartMonthly.setOption({
      color: [T.COLORS.navy600],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 20 }),
      xAxis: T.categoryAxis(PERIOD.slice(O.monthLabels)),
      yAxis: T.valueAxis(),
      series: [{ type: "bar", data: PERIOD.slice(O.series.registros), barMaxWidth: 34, itemStyle: { borderRadius: [6, 6, 0, 0] } }],
    });
  }

  window.VIEW_OPERACAO = {
    title: "Operação (O.S.)",
    subtitle: "Sistema de O.S. — gestão operacional de projetos",
    render,
    mount,
  };
})();
