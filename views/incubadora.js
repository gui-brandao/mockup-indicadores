// Tela 2 — Incubadora & Jornada: metodologia replicável (S1–S6, 9 ciclos).
(function () {
  const T = APP_THEME;

  function render() {
    const I = APP_DATA.incubadora;

    const kpis =
      UI.kpiCard({
        label: "Startups ativas",
        value: fmt.num(I.kpis.startupsAtivas),
        sub: "Entrada → Escala, em 10/09/2026",
        hero: true,
        spark: I.serieMensal.startupsAtivas,
      }) +
      UI.kpiCard({
        label: "Mentorias realizadas",
        value: fmt.num(I.kpis.mentoriasRealizadas),
        sub: "Atendimentos individuais no ano",
        spark: I.serieMensal.mentorias,
      }) +
      UI.kpiCard({
        label: "Aulas coletivas ministradas",
        value: fmt.num(I.kpis.aulasMinistradas),
        sub: `de ${fmt.num(I.aulasColetivas.reduce((s, a) => s + a.total, 0))} planejadas`,
      }) +
      UI.kpiCard({
        label: "Entregas do plano concluídas",
        value: fmt.num(I.planoTrabalho.concluida),
        sub: `de ${fmt.num(I.planoTrabalho.concluida + I.planoTrabalho.emExecucao + I.planoTrabalho.naoIniciada)} com status definido`,
      }) +
      UI.kpiCard({ label: "Graduandas previstas", value: fmt.num(I.kpis.graduandasPrevistas), sub: "Ciclo Escala/Graduação — 52 semanas" });

    const trilho = I.ciclos
      .map(
        (c, idx) => `
      <div class="axis-tile" style="text-align:center" title="${UI.esc(c.nome)}">
        <div class="pill pill-navy" style="margin-bottom:6px">Ciclo ${idx + 1}</div>
        <div class="axis-name" style="font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${UI.esc(c.nome)}</div>
        <div class="axis-value" style="font-size:20px">${fmt.num(c.empresas)}</div>
        <div class="axis-sub">${UI.esc(c.semanas)}</div>
      </div>`
      )
      .join("");

    const entregasRows = I.ciclos.map((c) => [UI.esc(c.nome), UI.esc(c.semanas), UI.esc(c.entrega), `<span class="td-strong">${fmt.num(c.empresas)}</span>`]);

    const aulasRows = I.aulasColetivas.map((a) => {
      const pct = (a.prontas / a.total) * 100;
      return [UI.esc(a.fase), `${a.prontas}/${a.total}`, UI.miniBar(a.prontas, a.total)];
    });

    return `
      <div class="grid kpi-grid">${kpis}</div>

      ${UI.sectionCard({
        eyebrow: "Metodologia · 52 semanas",
        title: "Jornada da incubação — 9 ciclos",
        desc: "Da entrada por edital até a graduação, com número de empresas ativas em cada etapa.",
        bodyHtml: `<div class="grid" style="grid-template-columns:repeat(9,minmax(0,1fr));gap:10px">${trilho}</div>`,
      })}

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "511 ações mapeadas",
          title: "Ações por fase — Individual × Coletivo",
          desc: "S1 Sentir → S6 Ampliar, consultoria semana a semana.",
          bodyHtml: UI.chartBox("chart-inc-fases", 300),
        })}
        ${UI.sectionCard({
          eyebrow: "Material didático",
          title: "Aulas coletivas por fase",
          desc: "% de aulas com material pronto, por fase da jornada.",
          bodyHtml: UI.dataTable({ columns: ["Fase", "Prontas", "Progresso"], rows: aulasRows }),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Distribuição por etapa",
          title: "Empresas ativas nos 9 ciclos",
          desc: "Da entrada à graduação — ciclos mais longos concentram mais empresas simultâneas, não é atrito de uma única turma.",
          bodyHtml: UI.chartBox("chart-inc-funil", 320),
        })}
        ${UI.sectionCard({
          eyebrow: "Carteira atual",
          title: "Setores das startups ativas",
          bodyHtml: UI.chartBox("chart-inc-setores", 320),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Cadência de apoio",
          title: "Mentorias e aulas coletivas por mês",
          desc: "Volume de atendimentos individuais e de encontros coletivos ministrados.",
          bodyHtml: UI.chartBox("chart-inc-cadencia", 280),
        })}
        ${UI.sectionCard({
          eyebrow: "Diagnóstico multidimensional",
          title: "Maturidade média das startups",
          desc: "Média das 34 startups ativas, por dimensão avaliada (0 a 100).",
          bodyHtml: UI.chartBox("chart-inc-maturidade", 280),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "Cronograma da incubadora",
        title: "Entregas-chave por ciclo",
        bodyHtml: UI.dataTable({
          columns: ["Ciclo", "Semanas", "Entrega principal", "Empresas"],
          rows: entregasRows,
          numericCols: [3],
        }),
      })}
    `;
  }

  function mount({ registerChart }) {
    const I = APP_DATA.incubadora;

    const chart = registerChart(echarts.init(document.getElementById("chart-inc-fases")));
    chart.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[3]],
      tooltip: T.tooltipDefaults({
        formatter: (params) => {
          const fase = I.fases[params[0].dataIndex];
          const rows = params.map((p) => `${p.marker} ${p.seriesName}: <b>${p.value}</b>`).join("<br/>");
          return `<b>${fase.nome}</b> · ${fase.estagio}<br/>${rows}`;
        },
      }),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(I.fases.map((f) => f.id), { axisLabel: { ...T.axisText(), interval: 0, fontWeight: 700 } }),
      yAxis: T.valueAxis(),
      series: [
        { name: "Individual", type: "bar", stack: "total", data: I.fases.map((f) => f.individual), barMaxWidth: 40, itemStyle: T.stackedItemStyle() },
        {
          name: "Coletivo",
          type: "bar",
          stack: "total",
          data: I.fases.map((f) => f.coletivo),
          barMaxWidth: 40,
          itemStyle: Object.assign({ borderRadius: T.barRadius() }, T.stackedItemStyle()),
        },
      ],
    });

    // Empresas por ciclo — barras na ordem da jornada (não um funil: os valores
    // não são monotônicos, já que ciclos mais longos acumulam várias turmas
    // simultâneas; um funil aqui sugeriria atrito que não existe nos dados).
    const ciclosOrd = [...I.ciclos].reverse();
    const chartFunil = registerChart(echarts.init(document.getElementById("chart-inc-funil")));
    chartFunil.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> empresa(s)` }),
      grid: T.baseGrid({ top: 10, right: 24 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(ciclosOrd.map((c) => c.nome), { axisLabel: { ...T.axisText(), interval: 0 } }),
      series: [
        {
          type: "bar",
          data: ciclosOrd.map((c) => c.empresas),
          barMaxWidth: 20,
          itemStyle: { borderRadius: T.barRadius("horizontal") },
          label: { show: true, position: "right", formatter: (p) => fmt.num(p.value), color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
        },
      ],
    });

    // Rosca de setores — legenda sempre presente (>=2 séries), rótulo direto.
    const chartSetores = registerChart(echarts.init(document.getElementById("chart-inc-setores")));
    chartSetores.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> startups (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center", type: "scroll" }),
      series: [
        {
          type: "pie",
          radius: ["46%", "70%"],
          center: ["50%", "42%"],
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11.5, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: I.setores.map((s) => ({ name: s.setor, value: s.valor })),
        },
      ],
    });

    // Mentorias × aulas por mês — mesmo eixo de valor (nunca eixo duplo);
    // barras agrupadas comparam as duas cadências lado a lado, com clareza.
    const chartCadencia = registerChart(echarts.init(document.getElementById("chart-inc-cadencia")));
    chartCadencia.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[3]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(APP_DATA.agenda.monthLabels),
      yAxis: T.valueAxis(),
      series: [
        { name: "Mentorias individuais", type: "bar", data: I.serieMensal.mentorias, barMaxWidth: 16, itemStyle: { borderRadius: T.barRadius() } },
        { name: "Aulas coletivas", type: "bar", data: I.serieMensal.aulas, barMaxWidth: 16, itemStyle: { borderRadius: T.barRadius() } },
      ],
    });

    // Radar de maturidade — polígono único, rótulo direto nos vértices.
    const chartMaturidade = registerChart(echarts.init(document.getElementById("chart-inc-maturidade")));
    chartMaturidade.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      radar: T.radarBase(I.maturidade.map((m) => ({ name: m.dimensao, max: 100 }))),
      series: [
        {
          type: "radar",
          data: [
            {
              value: I.maturidade.map((m) => m.valor),
              name: "Média das startups",
              areaStyle: { color: "rgba(47,122,184,0.22)" },
              lineStyle: { width: 2 },
              symbolSize: 7,
              label: { show: true, formatter: (p) => p.value, color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
            },
          ],
        },
      ],
    });
  }

  window.VIEW_INCUBADORA = {
    title: "Incubadora & Jornada",
    subtitle: "Metodologia de incubação replicável — da entrada à graduação",
    render,
    mount,
  };
})();
