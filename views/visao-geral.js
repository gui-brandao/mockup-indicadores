// Tela 1 — Visão Geral: o consolidado para apresentar a outras incubadoras.
(function () {
  const T = APP_THEME;

  // Série mensal de atendimentos somando todas as origens — base do KPI-herói,
  // do minigráfico e do mapa de calor, para que nunca divirjam entre si.
  function serieConsolidada() {
    const A = APP_DATA.agenda,
      E = APP_DATA.educacao,
      C = APP_DATA.crm,
      O = APP_DATA.os;
    return A.monthLabels.map(
      (_, i) =>
        A.series.presencas[i] +
        E.series.ava[i] +
        E.series.estudantes[i] +
        E.series.roteiros[i] +
        E.series.visitas[i] +
        C.series.realizado[i] +
        O.series.registros[i]
    );
  }

  function computeKpis() {
    const A = APP_DATA.agenda,
      C = APP_DATA.crm;

    const atendimentos = PERIOD.sum(serieConsolidada());
    const pessoasImpactadas = Math.round(atendimentos * 0.78);
    const espacosUsados = PERIOD.sum(A.series.espacosUsados);
    const startups = APP_DATA.incubadora.kpis.startupsAtivas;
    const parceriasRealizadas = C.parcerias.reduce((s, p) => s + p.realizado, 0);
    const parceriasMeta = C.parcerias.reduce((s, p) => s + p.meta, 0);

    return { atendimentos, pessoasImpactadas, espacosUsados, startups, parceriasRealizadas, parceriasMeta };
  }

  function render() {
    const k = computeKpis();
    const A = APP_DATA.agenda,
      E = APP_DATA.educacao,
      C = APP_DATA.crm,
      O = APP_DATA.os,
      I = APP_DATA.incubadora,
      M = APP_DATA.metas;

    const consolidada = serieConsolidada();

    const kpis =
      UI.kpiCard({
        label: "Atendimentos consolidados",
        value: fmt.num(k.atendimentos),
        sub: `${PERIOD.PRESETS[PERIOD.key()].label} · todas as origens`,
        hero: true,
        spark: PERIOD.slice(consolidada),
      }) +
      UI.kpiCard({
        label: "Pessoas impactadas (estimado)",
        value: fmt.num(k.pessoasImpactadas),
        sub: "Considera sobreposição entre canais",
        spark: PERIOD.slice(consolidada.map((v) => Math.round(v * 0.78))),
      }) +
      UI.kpiCard({
        label: "Uso de espaços",
        value: fmt.num(k.espacosUsados),
        sub: "Reservas de salas e laboratórios",
        spark: PERIOD.slice(A.series.espacosUsados),
      }) +
      UI.kpiCard({
        label: "Startups incubadas",
        value: fmt.num(k.startups),
        sub: "Ativas em 10/09/2026 · Entrada → Escala",
        spark: PERIOD.slice(I.serieMensal.startupsAtivas),
      }) +
      UI.kpiCard({
        label: "Parcerias formalizadas",
        value: fmt.num(k.parceriasRealizadas),
        sub: `de ${fmt.num(k.parceriasMeta)} planejadas no ano`,
        spark: PERIOD.slice(C.parceriasMensal),
      });

    const impactoKpis =
      UI.kpiCard({
        label: "Empregos gerados",
        value: fmt.num(PERIOD.last(I.empregosGeradosMensal)),
        sub: "pelas startups da incubadora, acumulado no ano",
        hero: true,
        spark: PERIOD.slice(I.empregosGeradosMensal),
      }) +
      UI.kpiCard({
        label: "Famílias atingidas",
        value: fmt.num(PERIOD.last(I.familiasAtingidasMensal)),
        sub: "estimado a partir dos empregos gerados",
        spark: PERIOD.slice(I.familiasAtingidasMensal),
      });

    const fontesCards = [
      { nome: "Sistema de Agenda", serie: A.series.agendamentos, unidade: "agendamentos", icon: "📅" },
      { nome: "Sistema de O.S.", serie: O.series.registros, unidade: "registros", icon: "🛠️" },
      { nome: "Zoho CRM", serie: C.series.realizado, unidade: "interações", icon: "🤝" },
      {
        nome: "AVA (trilhas)",
        serie: E.series.ava.map((v, i) => v + E.series.estudantes[i]),
        unidade: "atendimentos",
        icon: "🎓",
      },
      {
        nome: "Catraca",
        serie: A.series.presencas.map((v) => Math.round(v * 1.35)),
        unidade: "acessos (estimado)",
        icon: "🚪",
      },
    ]
      .map((f) =>
        UI.axisTile({
          name: `${f.icon} ${f.nome}`,
          value: fmt.num(PERIOD.sum(f.serie)),
          sub: `${f.unidade} no período · ainda não integrado`,
          spark: PERIOD.slice(f.serie),
        })
      )
      .join("");

    const destaques = [
      `${fmt.num(A.series.agendamentos[8])} agendamentos em setembro, com ${fmt.num(A.series.presencas[8])} presenças confirmadas (${fmt.num1(
        A.series.presencaPct[8]
      )}%).`,
      `${fmt.num(I.kpis.startupsAtivas)} startups ativas na jornada de incubação, da Entrada à Escala, apoiadas por ${fmt.num(
        I.totalAcoesIndividual + I.totalAcoesColetivo
      )} ações mapeadas em 6 fases.`,
      `Meta de ${fmt.num(M.itens[0].meta)} atendimentos de fomento no ano — ${fmt.num1(M.itens[0].pct)}% já entregues.`,
      `${fmt.num(A.series.espacosUsados[8])} espaços do Parque reservados em setembro, entre salas, laboratórios e auditório.`,
      `Roteiros pedagógicos alcançaram ${fmt.num(E.porCidade.length)} cidades do Grande ABC, com ${fmt.num(
        E.porCidade[0].valor
      )} atendimentos só em ${E.porCidade[0].cidade}.`,
    ]
      .map((t) => `<li>${t}</li>`)
      .join("");

    return `
      <div class="grid kpi-grid">${kpis}</div>

      ${UI.sectionCard({
        eyebrow: "Resumo executivo",
        title: "Impacto para o município",
        desc: "O que o Parque devolve para Santo André, além dos atendimentos.",
        bodyHtml: `<div class="grid grid-2">${impactoKpis}</div>`,
      })}

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Movimentação consolidada",
          title: "Atendimentos por origem, mês a mês",
          desc: "Volume mensal somado das principais fontes do Parque, com a meta acumulada de fomento (1.1.1) como referência.",
          bodyHtml: UI.chartBox("chart-vg-origem", 320),
        })}
        ${UI.sectionCard({
          eyebrow: "Execução do plano FINEP",
          title: "Metas anuais",
          desc: "Média de execução das metas com indicador numérico definido.",
          bodyHtml: UI.chartBox("chart-vg-gauge", 220) +
            `<div class="card-note">🎯 ${fmt.num(M.itens.filter((m) => m.pct !== null && m.pct !== undefined).length)} metas monitoradas de ${fmt.num(
              M.itens.length
            )} no plano de trabalho FINEP.</div>`,
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Composição",
          title: "Distribuição de atendimentos por área",
          desc: "Negócios & Fomento, Espaços & Infraestrutura, Educação & Difusão e Operação interna.",
          bodyHtml: UI.chartBox("chart-vg-area", 300),
        })}
        ${UI.sectionCard({
          eyebrow: "Destaques do período",
          title: "O que aconteceu no Parque",
          bodyHtml: `<ul class="highlight-list">${destaques}</ul>`,
        })}
      </div>

      <div class="grid grid-2">
        ${UI.sectionCard({
          eyebrow: "Equilíbrio entre eixos",
          title: "Execução média por eixo do plano",
          desc: "Quanto cada eixo do projeto FINEP já entregou da sua meta anual.",
          bodyHtml: UI.chartBox("chart-vg-radar", 320),
        })}
        ${UI.sectionCard({
          eyebrow: "Alcance",
          title: "Pessoas alcançadas por tipo de ação",
          desc: "Volume acumulado no período, por frente de atuação.",
          bodyHtml: UI.chartBox("chart-vg-alcance", 320),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "Sazonalidade",
        title: "Mapa de calor — atendimentos por origem e mês",
        desc: "Quanto mais escura a célula, maior o volume de atendimentos daquela origem no mês.",
        bodyHtml: UI.chartBox("chart-vg-heat", 320),
      })}

      ${UI.sectionCard({
        eyebrow: "Maturidade de gestão",
        title: "Fontes de dados integráveis",
        desc: "Cada sistema já produz indicadores próprios — este painel consolida a leitura entre eles.",
        bodyHtml: `<div class="grid grid-4">${fontesCards}</div>`,
      })}
    `;
  }

  function mount({ registerChart }) {
    const A = APP_DATA.agenda,
      E = APP_DATA.educacao,
      C = APP_DATA.crm,
      O = APP_DATA.os,
      M = APP_DATA.metas;

    const months = PERIOD.slice(A.monthLabels);

    // --- Atendimentos por origem (barras empilhadas + linha de meta) ---------
    const serieAgenda = PERIOD.slice(A.series.presencas);
    const serieAva = PERIOD.slice(E.series.ava.map((v, i) => v + E.series.estudantes[i]));
    const serieVisitasRoteiros = PERIOD.slice(E.series.roteiros.map((v, i) => v + E.series.visitas[i]));
    const serieCrm = PERIOD.slice(C.series.realizado);
    const serieOs = PERIOD.slice(O.series.registros);
    const metaAcumulada = (() => {
      let acc = 0;
      const step = M.itens[0].meta / 9;
      return months.map(() => (acc += step));
    })();

    const chartOrigem = registerChart(echarts.init(document.getElementById("chart-vg-origem")));
    chartOrigem.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults({ type: "scroll" }),
      grid: T.baseGrid({ top: 44 }),
      xAxis: T.categoryAxis(months),
      yAxis: T.valueAxis(),
      series: [
        { name: "Agenda (presenças)", type: "bar", stack: "total", data: serieAgenda, barMaxWidth: 28, itemStyle: T.stackedItemStyle() },
        { name: "AVA + Estudantes", type: "bar", stack: "total", data: serieAva, barMaxWidth: 28, itemStyle: T.stackedItemStyle() },
        { name: "Visitas + Roteiros", type: "bar", stack: "total", data: serieVisitasRoteiros, barMaxWidth: 28, itemStyle: T.stackedItemStyle() },
        { name: "CRM (interações)", type: "bar", stack: "total", data: serieCrm, barMaxWidth: 28, itemStyle: T.stackedItemStyle() },
        {
          name: "O.S. (registros)",
          type: "bar",
          stack: "total",
          data: serieOs,
          barMaxWidth: 28,
          itemStyle: Object.assign({ borderRadius: T.barRadius() }, T.stackedItemStyle()),
        },
        {
          name: "Meta fomento (acum.)",
          type: "line",
          data: metaAcumulada,
          symbol: "none",
          lineStyle: { type: "dashed", color: T.COLORS.gray500, width: 2 },
        },
      ],
    });

    // --- Gauge de execução das metas ----------------------------------------
    const validPct = M.itens.filter((m) => m.pct !== null && m.pct !== undefined).map((m) => m.pct);
    const avgPct = validPct.reduce((a, b) => a + b, 0) / validPct.length;
    const chartGauge = registerChart(echarts.init(document.getElementById("chart-vg-gauge")));
    chartGauge.setOption({
      series: [
        {
          type: "gauge",
          min: 0,
          max: 120,
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
          detail: {
            valueAnimation: true,
            formatter: (v) => v.toFixed(1) + "%",
            fontSize: 26,
            fontWeight: 800,
            color: T.COLORS.navy800,
            offsetCenter: [0, "-14%"],
          },
          title: { fontSize: 11, color: T.COLORS.gray500, offsetCenter: [0, "18%"] },
          data: [{ value: avgPct, name: "execução média" }],
        },
      ],
    });

    // --- Rosca de composição por área ---------------------------------------
    const areaData = [
      { name: "Educação & Difusão", value: PERIOD.sum(E.series.ava) + PERIOD.sum(E.series.estudantes) + PERIOD.sum(E.series.roteiros) + PERIOD.sum(E.series.visitas) },
      { name: "Negócios & Fomento", value: PERIOD.sum(C.series.realizado) },
      { name: "Operação interna", value: PERIOD.sum(O.series.registros) },
      { name: "Espaços & Infraestrutura", value: PERIOD.sum(A.series.espacosUsados) },
    ];
    const chartArea = registerChart(echarts.init(document.getElementById("chart-vg-area")));
    chartArea.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center" }),
      series: [
        {
          type: "pie",
          radius: ["46%", "70%"],
          center: ["50%", "43%"],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11.5, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: areaData,
        },
      ],
    });

    // --- Radar de execução por eixo -----------------------------------------
    const eixoPct = Object.keys(M.eixos).map((eixo) => {
      const itens = M.itens.filter((m) => String(m.eixo) === eixo && m.pct !== null && m.pct !== undefined);
      return itens.length ? itens.reduce((s, m) => s + m.pct, 0) / itens.length : 0;
    });
    const chartRadar = registerChart(echarts.init(document.getElementById("chart-vg-radar")));
    chartRadar.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      radar: T.radarBase(
        Object.entries(M.eixos).map(([eixo, nome]) => ({ name: `Eixo ${eixo}\n${nome.split(" e ")[0]}`, max: 100 }))
      ),
      series: [
        {
          type: "radar",
          data: [
            {
              value: eixoPct.map((v) => Number(v.toFixed(1))),
              name: "% de execução",
              areaStyle: { color: "rgba(47,122,184,0.22)" },
              lineStyle: { width: 2 },
              symbolSize: 8,
              label: { show: true, formatter: (p) => fmt.num1(p.value) + "%", color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
            },
          ],
        },
      ],
    });

    // --- Alcance por tipo de ação (barras horizontais) ----------------------
    const alcance = [
      { nome: "Roteiros pedagógicos", valor: PERIOD.sum(E.series.roteiros) },
      { nome: "Atendimentos de fomento", valor: PERIOD.sum(C.series.realizado) },
      { nome: "Trilhas do AVA", valor: PERIOD.sum(E.series.ava) },
      { nome: "Presenças em eventos", valor: PERIOD.sum(A.series.presencas) },
      { nome: "Estudantes parceiros", valor: PERIOD.sum(E.series.estudantes) },
      { nome: "Visitas técnicas", valor: PERIOD.sum(E.series.visitas) },
    ].sort((a, b) => a.valor - b.valor);

    const chartAlcance = registerChart(echarts.init(document.getElementById("chart-vg-alcance")));
    chartAlcance.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> pessoas` }),
      grid: T.baseGrid({ top: 12, right: 68 }),
      xAxis: T.valueAxis({ axisLabel: Object.assign(T.axisText(), { show: false }), splitLine: { show: false } }),
      yAxis: T.categoryAxis(alcance.map((a) => a.nome), { axisLabel: Object.assign(T.axisText(), { interval: 0 }) }),
      series: [
        {
          type: "bar",
          data: alcance.map((a) => a.valor),
          barMaxWidth: 16,
          itemStyle: { borderRadius: T.barRadius("horizontal") },
          label: { show: true, position: "right", formatter: (p) => fmt.num(p.value), color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
        },
      ],
    });

    // --- Mapa de calor origem × mês -----------------------------------------
    const origens = [
      { nome: "Agenda", serie: A.series.presencas },
      { nome: "AVA", serie: E.series.ava },
      { nome: "Estudantes", serie: E.series.estudantes },
      { nome: "Roteiros", serie: E.series.roteiros },
      { nome: "Visitas", serie: E.series.visitas },
      { nome: "CRM", serie: C.series.realizado },
      { nome: "O.S.", serie: O.series.registros },
    ];
    const heatData = [];
    let heatMax = 0;
    origens.forEach((o, y) => {
      PERIOD.slice(o.serie).forEach((v, x) => {
        heatData.push([x, y, v]);
        if (v > heatMax) heatMax = v;
      });
    });

    const chartHeat = registerChart(echarts.init(document.getElementById("chart-vg-heat")));
    chartHeat.setOption({
      tooltip: T.tooltipDefaults({
        trigger: "item",
        formatter: (p) => `${origens[p.value[1]].nome} · ${months[p.value[0]]}<br/><b>${fmt.num(p.value[2])}</b> atendimentos`,
      }),
      grid: T.baseGrid({ top: 12, bottom: 46, left: 8 }),
      xAxis: T.categoryAxis(months, { splitArea: { show: false } }),
      yAxis: T.categoryAxis(origens.map((o) => o.nome), { splitArea: { show: false } }),
      visualMap: T.heatVisualMap(heatMax),
      series: [
        {
          type: "heatmap",
          data: heatData,
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2, borderRadius: 3 },
          emphasis: { itemStyle: { borderColor: T.COLORS.navy800, borderWidth: 2 } },
        },
      ],
    });
  }

  window.VIEW_VISAO_GERAL = {
    title: "Visão Geral",
    subtitle: "Consolidado de tudo o que acontece no Parque Tecnológico",
    render,
    mount,
  };
})();
