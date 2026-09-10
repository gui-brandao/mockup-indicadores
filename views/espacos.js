// Tela 3 — Espaços & Agenda: espelha o Sistema de Agenda hoje em uso.
(function () {
  const T = APP_THEME;

  function render() {
    const A = APP_DATA.agenda;
    const meta131 = APP_DATA.metas.itens.find((m) => m.cod === "1.3.1");

    const presencaMedia = PERIOD.avg(A.series.presencaPct);

    const kpis =
      UI.kpiCard({
        label: "Agendamentos ativos",
        value: fmt.num(PERIOD.sum(A.series.agendamentos)),
        sub: "no período",
        hero: true,
        spark: PERIOD.slice(A.series.agendamentos),
      }) +
      UI.kpiCard({
        label: "Inscrições",
        value: fmt.num(PERIOD.sum(A.series.inscricoes)),
        sub: "pessoas pré-cadastradas",
        spark: PERIOD.slice(A.series.inscricoes),
      }) +
      UI.kpiCard({
        label: "Presenças",
        value: fmt.num(PERIOD.sum(A.series.presencas)),
        sub: `${fmt.num1(presencaMedia)}% das presenças possíveis`,
        spark: PERIOD.slice(A.series.presencas),
      }) +
      UI.kpiCard({
        label: "Espaços usados",
        value: fmt.num(PERIOD.sum(A.series.espacosUsados)),
        sub: "reservas vinculadas",
        spark: PERIOD.slice(A.series.espacosUsados),
      });

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

      <div class="grid grid-2">
        ${UI.sectionCard({
          eyebrow: `01/09 a 20/09/2026 · exemplo`,
          title: "Agendamentos por dia",
          desc: "Volume diário de agendamentos ativos.",
          bodyHtml: UI.chartBox("chart-esp-mov-ag", 240),
        })}
        ${UI.sectionCard({
          eyebrow: `01/09 a 20/09/2026 · exemplo`,
          title: "Inscrições × presenças por dia",
          desc: "Mesma escala — comparação direta entre inscrito e presente.",
          bodyHtml: UI.chartBox("chart-esp-mov-ip", 240),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Taxa de presença global",
          title: "Presença sobre possibilidades do período",
          bodyHtml: UI.chartBox("chart-esp-gauge", 200) +
            UI.progressBar({ name: "Meta 1.3.1 — uso de espaços", value: meta131.realizado, meta: meta131.meta, unit: "atend." }),
        })}
        ${UI.sectionCard({
          eyebrow: "Ocupação",
          title: "Top espaços por reservas",
          bodyHtml: UI.chartBox("chart-esp-top", 240),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Padrão semanal",
          title: "Ocupação por dia da semana e faixa de horário",
          desc: "Quanto mais escura a célula, maior o volume de reservas naquele intervalo.",
          bodyHtml: UI.chartBox("chart-esp-heat", 300),
        })}
        ${UI.sectionCard({
          eyebrow: "Perfil de uso",
          title: "Reservas por tipo de uso",
          bodyHtml: UI.chartBox("chart-esp-tipo", 300),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Sem eventos já encerrados",
          title: "Próximos agendamentos",
          meta: `${A.proximosAgendamentos.length}`,
          bodyHtml: `<div>${proximos}</div>`,
        })}
        ${UI.sectionCard({
          eyebrow: "Evolução indexada · base 100 = janeiro",
          title: "Agendamentos × presenças, mês a mês",
          desc: "Cada série indexada ao seu próprio início — compara ritmo de crescimento, não volume absoluto.",
          bodyHtml: UI.chartBox("chart-esp-idx", 280),
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

    // Agendamentos por dia + Inscrições×Presenças por dia — dois painéis de
    // eixo único no lugar de um único gráfico de eixo duplo (nunca 2 eixos-Y).
    const chartAg = registerChart(echarts.init(document.getElementById("chart-esp-mov-ag")));
    chartAg.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 12 }),
      xAxis: T.categoryAxis(A.movimentacaoDiaria.dias, { axisLabel: { ...T.axisText(), interval: 2 } }),
      yAxis: T.valueAxis(),
      series: [{ type: "bar", data: A.movimentacaoDiaria.agendamentos, barMaxWidth: 18, itemStyle: { borderRadius: T.barRadius() } }],
    });

    const chartIp = registerChart(echarts.init(document.getElementById("chart-esp-mov-ip")));
    chartIp.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[2]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(A.movimentacaoDiaria.dias, { axisLabel: { ...T.axisText(), interval: 2 } }),
      yAxis: T.valueAxis(),
      series: [
        T.lineSeriesDefaults({ name: "Inscrições", data: A.movimentacaoDiaria.inscricoes, itemStyle: { color: T.SERIES_PALETTE[0] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[0] } }),
        T.lineSeriesDefaults({ name: "Presenças contabilizadas", data: A.movimentacaoDiaria.presencas, itemStyle: { color: T.SERIES_PALETTE[2] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[2] } }),
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
          progress: { show: true, width: 16, itemStyle: { color: T.STATUS.good } },
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
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(top.map((e) => e.nome)),
      series: [{ type: "bar", data: top.map((e) => e.reservas), barMaxWidth: 18, itemStyle: { borderRadius: T.barRadius("horizontal") } }],
    });

    // Mapa de calor dia da semana × faixa de horário.
    const H = A.ocupacaoHeatmap;
    const heatMax = Math.max(...H.valores.map((v) => v[2]));
    const chartHeat = registerChart(echarts.init(document.getElementById("chart-esp-heat")));
    chartHeat.setOption({
      tooltip: T.tooltipDefaults({
        trigger: "item",
        formatter: (p) => `${H.dias[p.value[0]]} · ${H.faixas[p.value[1]]}<br/><b>${fmt.num(p.value[2])}</b> reservas`,
      }),
      grid: T.baseGrid({ top: 12, bottom: 46, left: 8 }),
      xAxis: T.categoryAxis(H.dias, { splitArea: { show: false } }),
      yAxis: T.categoryAxis(H.faixas, { splitArea: { show: false } }),
      visualMap: T.heatVisualMap(heatMax),
      series: [
        {
          type: "heatmap",
          data: H.valores,
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2, borderRadius: 3 },
          emphasis: { itemStyle: { borderColor: T.COLORS.navy800, borderWidth: 2 } },
        },
      ],
    });

    // Rosca por tipo de uso.
    const chartTipo = registerChart(echarts.init(document.getElementById("chart-esp-tipo")));
    chartTipo.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center", type: "scroll" }),
      series: [
        {
          type: "pie",
          radius: ["46%", "70%"],
          center: ["50%", "42%"],
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11.5, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: A.tiposUso.map((t) => ({ name: t.tipo, value: t.valor })),
        },
      ],
    });

    // Evolução indexada (base 100 = janeiro) — evita eixo duplo quando as
    // escalas absolutas de agendamentos e presenças são muito diferentes.
    const idx = (arr) => arr.map((v) => Math.round((v / arr[0]) * 100));
    const chartIdx = registerChart(echarts.init(document.getElementById("chart-esp-idx")));
    chartIdx.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[2]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(A.monthLabels),
      yAxis: T.valueAxis({ name: "índice (Jan = 100)", nameTextStyle: { color: T.COLORS.gray500, fontSize: 10.5 } }),
      series: [
        T.lineSeriesDefaults({ name: "Agendamentos", data: idx(A.series.agendamentos), itemStyle: { color: T.SERIES_PALETTE[0] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[0] } }),
        T.lineSeriesDefaults({ name: "Presenças", data: idx(A.series.presencas), itemStyle: { color: T.SERIES_PALETTE[2] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[2] } }),
      ],
    });

    const evt = A.taxaPresencaEvento;
    const chartTaxa = registerChart(echarts.init(document.getElementById("chart-esp-taxa")));
    chartTaxa.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[2]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(evt.map((e) => e.evento)),
      series: [
        { name: "Inscrições", type: "bar", data: evt.map((e) => e.inscricoes), barMaxWidth: 12, itemStyle: { borderRadius: T.barRadius("horizontal") } },
        { name: "Presenças contabilizadas", type: "bar", data: evt.map((e) => e.presencas), barMaxWidth: 12, itemStyle: { borderRadius: T.barRadius("horizontal") } },
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
