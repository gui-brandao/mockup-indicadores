// Tela 3 — Espaços & Agenda: espelha o Sistema de Agenda hoje em uso.
(function () {
  const T = APP_THEME;

  function render() {
    const A = APP_DATA.agenda;
    const meta131 = APP_DATA.metas.itens.find((m) => m.cod === "1.3.1");

    const presencaMedia = PERIOD.avg(A.series.presencaPct);

    const kpis =
      UI.kpiCard({ label: "Agendamentos ativos", value: fmt.num(PERIOD.sum(A.series.agendamentos)), sub: "no período", hero: true }) +
      UI.kpiCard({ label: "Inscrições", value: fmt.num(PERIOD.sum(A.series.inscricoes)), sub: "pessoas pré-cadastradas" }) +
      UI.kpiCard({ label: "Presenças", value: fmt.num(PERIOD.sum(A.series.presencas)), sub: `${fmt.num1(presencaMedia)}% das presenças possíveis` }) +
      UI.kpiCard({ label: "Espaços usados", value: fmt.num(PERIOD.sum(A.series.espacosUsados)), sub: "reservas vinculadas" });

    const proximos = A.proximosAgendamentos
      .map(
        (p) => `
      <div class="list-item">
        <div class="list-item-top">
          <span class="list-item-time">${UI.esc(p.horario)}</span>
          ${UI.statusPill(p.status)}
        </div>
        <div class="list-item-title">${UI.esc(p.titulo)}</div>
        <div class="list-item-meta"><span>📍 ${UI.esc(p.local)}</span><span>👥 ${fmt.num(p.inscricoes)} inscrição(ões)</span></div>
      </div>`
      )
      .join("");

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: `01/09 a 20/09/2026 · exemplo`,
          title: "Movimentação do período",
          desc: "Agendamentos, inscrições e presenças contabilizadas dia a dia.",
          bodyHtml: UI.chartBox("chart-esp-mov", 300),
        })}
        ${UI.sectionCard({
          eyebrow: "Taxa de presença global",
          title: "Presença sobre possibilidades do período",
          bodyHtml: UI.chartBox("chart-esp-gauge", 200) +
            UI.progressBar({ name: "Meta 1.3.1 — uso de espaços", value: meta131.realizado, meta: meta131.meta, unit: "atend." }),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Ocupação",
          title: "Top espaços por reservas",
          bodyHtml: UI.chartBox("chart-esp-top", 280),
        })}
        ${UI.sectionCard({
          eyebrow: "Sem eventos já encerrados",
          title: "Próximos agendamentos",
          meta: `${A.proximosAgendamentos.length}`,
          bodyHtml: `<div>${proximos}</div>`,
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "Quinta-feira, 10/09/2026",
        title: "Taxa de presença por evento",
        desc: "Inscritos e presenças contabilizadas por agendamento.",
        bodyHtml: UI.chartBox("chart-esp-taxa", 300),
      })}
    `;
  }

  function mount({ registerChart }) {
    const A = APP_DATA.agenda;

    const chartMov = registerChart(echarts.init(document.getElementById("chart-esp-mov")));
    chartMov.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(A.movimentacaoDiaria.dias),
      yAxis: [T.valueAxis(), T.valueAxis({ splitLine: { show: false } })],
      series: [
        { name: "Agendamentos", type: "bar", data: A.movimentacaoDiaria.agendamentos, barMaxWidth: 18, yAxisIndex: 0 },
        { name: "Inscrições", type: "line", data: A.movimentacaoDiaria.inscricoes, yAxisIndex: 1, symbol: "circle", symbolSize: 6 },
        { name: "Presenças contabilizadas", type: "line", data: A.movimentacaoDiaria.presencas, yAxisIndex: 1, symbol: "circle", symbolSize: 6 },
      ],
    });

    const presencaAtual = PERIOD.last(A.series.presencaPct);
    const chartGauge = registerChart(echarts.init(document.getElementById("chart-esp-gauge")));
    chartGauge.setOption({
      series: [
        {
          type: "gauge",
          min: 0,
          max: 100,
          startAngle: 200,
          endAngle: -20,
          radius: "100%",
          center: ["50%", "70%"],
          progress: { show: true, width: 16, itemStyle: { color: T.COLORS.green600 } },
          axisLine: { lineStyle: { width: 16, color: [[1, T.COLORS.gray200]] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { formatter: (v) => v.toFixed(1) + "%", fontSize: 26, fontWeight: 800, color: T.COLORS.navy800, offsetCenter: [0, "-14%"] },
          title: { fontSize: 11, color: T.COLORS.gray500, offsetCenter: [0, "18%"] },
          data: [{ value: presencaAtual, name: "presença global" }],
        },
      ],
    });

    const top = [...A.topEspacos].sort((a, b) => a.reservas - b.reservas);
    const chartTop = registerChart(echarts.init(document.getElementById("chart-esp-top")));
    chartTop.setOption({
      color: [T.COLORS.navy600],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(top.map((e) => e.nome)),
      series: [{ type: "bar", data: top.map((e) => e.reservas), barMaxWidth: 18, itemStyle: { borderRadius: [0, 6, 6, 0] } }],
    });

    const evt = A.taxaPresencaEvento;
    const chartTaxa = registerChart(echarts.init(document.getElementById("chart-esp-taxa")));
    chartTaxa.setOption({
      color: [T.COLORS.navy600, T.COLORS.green600],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(evt.map((e) => e.evento)),
      series: [
        { name: "Inscrições", type: "bar", data: evt.map((e) => e.inscricoes), barMaxWidth: 12 },
        { name: "Presenças contabilizadas", type: "bar", data: evt.map((e) => e.presencas), barMaxWidth: 12 },
      ],
    });
  }

  window.VIEW_ESPACOS = {
    title: "Espaços & Agenda",
    subtitle: "Sistema de Agenda — gestão integrada de uso de espaços",
    render,
    mount,
  };
})();
