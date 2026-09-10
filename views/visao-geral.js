// Tela 1 — Visão Geral: o consolidado para apresentar a outras incubadoras.
(function () {
  const T = APP_THEME;

  function computeKpis() {
    const A = APP_DATA.agenda,
      E = APP_DATA.educacao,
      C = APP_DATA.crm,
      O = APP_DATA.os;

    const atendimentos =
      PERIOD.sum(A.series.presencas) +
      PERIOD.sum(E.series.ava) +
      PERIOD.sum(E.series.estudantes) +
      PERIOD.sum(E.series.roteiros) +
      PERIOD.sum(E.series.visitas) +
      PERIOD.sum(C.series.realizado) +
      PERIOD.sum(O.series.registros);

    const pessoasImpactadas = Math.round(atendimentos * 0.78);
    const espacosUsados = PERIOD.sum(A.series.espacosUsados);
    const startups = APP_DATA.incubadora.kpis.startupsAtivas;
    const parceriasRealizadas = APP_DATA.crm.parcerias.reduce((s, p) => s + p.realizado, 0);
    const parceriasMeta = APP_DATA.crm.parcerias.reduce((s, p) => s + p.meta, 0);

    return { atendimentos, pessoasImpactadas, espacosUsados, startups, parceriasRealizadas, parceriasMeta };
  }

  function render() {
    const k = computeKpis();
    const A = APP_DATA.agenda,
      E = APP_DATA.educacao,
      C = APP_DATA.crm,
      O = APP_DATA.os,
      M = APP_DATA.metas;

    const kpis = UI.kpiCard({
      label: "Atendimentos consolidados",
      value: fmt.num(k.atendimentos),
      sub: `${PERIOD.PRESETS[PERIOD.key()].label} · todas as origens`,
      hero: true,
    }) +
      UI.kpiCard({ label: "Pessoas impactadas (estimado)", value: fmt.num(k.pessoasImpactadas), sub: "Considera sobreposição entre canais" }) +
      UI.kpiCard({ label: "Uso de espaços", value: fmt.num(k.espacosUsados), sub: "Reservas de salas e laboratórios" }) +
      UI.kpiCard({ label: "Startups incubadas", value: fmt.num(k.startups), sub: "Ativas em 10/09/2026 · Entrada → Escala" }) +
      UI.kpiCard({
        label: "Parcerias formalizadas",
        value: fmt.num(k.parceriasRealizadas),
        sub: `de ${fmt.num(k.parceriasMeta)} planejadas no ano`,
      });

    const fontesCards = [
      { nome: "Sistema de Agenda", valor: PERIOD.sum(A.series.agendamentos), unidade: "agendamentos", icon: "📅" },
      { nome: "Sistema de O.S.", valor: PERIOD.sum(O.series.registros), unidade: "registros", icon: "🛠️" },
      { nome: "Zoho CRM", valor: PERIOD.sum(C.series.realizado), unidade: "interações", icon: "🤝" },
      {
        nome: "AVA (trilhas)",
        valor: PERIOD.sum(E.series.ava) + PERIOD.sum(E.series.estudantes),
        unidade: "atendimentos",
        icon: "🎓",
      },
      { nome: "Catraca", valor: Math.round(PERIOD.sum(A.series.presencas) * 1.35), unidade: "acessos (estimado)", icon: "🚪" },
    ]
      .map(
        (f) => `
        <div class="axis-tile">
          <div class="flex items-center gap-8" style="justify-content:space-between">
            <span class="axis-name">${f.icon} ${UI.esc(f.nome)}</span>
            <span class="pill pill-green">sincronizado</span>
          </div>
          <div class="axis-value">${fmt.num(f.valor)}</div>
          <div class="axis-sub">${UI.esc(f.unidade)} no período · mockup manual</div>
        </div>`
      )
      .join("");

    const destaques = [
      `${fmt.num(A.series.agendamentos[8])} agendamentos em setembro, com ${fmt.num(A.series.presencas[8])} presenças confirmadas (${fmt.num1(
        A.series.presencaPct[8]
      )}%).`,
      `${fmt.num(APP_DATA.incubadora.kpis.startupsAtivas)} startups ativas na jornada de incubação, da Entrada à Escala, apoiadas por ${fmt.num(
        APP_DATA.incubadora.totalAcoesIndividual + APP_DATA.incubadora.totalAcoesColetivo
      )} ações mapeadas em 6 fases.`,
      `Meta de ${fmt.num(M.itens[0].meta)} atendimentos de fomento no ano — ${fmt.num1(M.itens[0].pct)}% já entregues.`,
      `${fmt.num(A.series.espacosUsados[8])} espaços do Parque reservados em setembro, entre salas, laboratórios e auditório.`,
      `${fmt.num(E.metas.roteiros)} atendimentos/ano previstos em roteiros pedagógicos de ciência e tecnologia para escolas da região.`,
    ]
      .map((t) => `<li>${t}</li>`)
      .join("");

    return `
      <div class="grid kpi-grid">${kpis}</div>

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
          bodyHtml: UI.chartBox("chart-vg-area", 280),
        })}
        ${UI.sectionCard({
          eyebrow: "Destaques do período",
          title: "O que aconteceu no Parque",
          bodyHtml: `<ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--gray-900)">${destaques}</ul>`,
        })}
      </div>

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
    const chartOrigem = registerChart(echarts.init(document.getElementById("chart-vg-origem")));
    const serieAgenda = PERIOD.slice(A.series.presencas);
    const serieAva = PERIOD.slice(E.series.ava).map((v, i) => v + PERIOD.slice(E.series.estudantes)[i]);
    const serieVisitasRoteiros = PERIOD.slice(E.series.roteiros).map((v, i) => v + PERIOD.slice(E.series.visitas)[i]);
    const serieCrm = PERIOD.slice(C.series.realizado);
    const serieOs = PERIOD.slice(O.series.registros);
    const metaAcumulada = (() => {
      let acc = 0;
      const step = M.itens[0].meta / 9;
      return months.map(() => (acc += step));
    })();

    chartOrigem.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(months),
      yAxis: T.valueAxis(),
      series: [
        { name: "Agenda (presenças)", type: "bar", stack: "total", data: serieAgenda, barMaxWidth: 26 },
        { name: "AVA + Estudantes", type: "bar", stack: "total", data: serieAva, barMaxWidth: 26 },
        { name: "Visitas + Roteiros", type: "bar", stack: "total", data: serieVisitasRoteiros, barMaxWidth: 26 },
        { name: "CRM (interações)", type: "bar", stack: "total", data: serieCrm, barMaxWidth: 26 },
        { name: "O.S. (registros)", type: "bar", stack: "total", data: serieOs, barMaxWidth: 26 },
        {
          name: "Meta fomento (acum.)",
          type: "line",
          data: metaAcumulada,
          symbol: "none",
          lineStyle: { type: "dashed", color: T.COLORS.gray500, width: 2 },
        },
      ],
    });

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
          progress: { show: true, width: 16, itemStyle: { color: T.COLORS.green600 } },
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

    // Cálculo direto (mais legível que compor via metas): soma por área a
    // partir das próprias séries mensais de cada origem.
    const eixoNegocios = PERIOD.sum(C.series.realizado);
    const eixoEspacos = PERIOD.sum(A.series.espacosUsados); // reservas de espaço no período
    const eixoEducacao =
      PERIOD.sum(E.series.ava) + PERIOD.sum(E.series.estudantes) + PERIOD.sum(E.series.roteiros) + PERIOD.sum(E.series.visitas);
    const eixoOperacao = PERIOD.sum(O.series.registros);

    const chartArea = registerChart(echarts.init(document.getElementById("chart-vg-area")));
    chartArea.setOption({
      tooltip: { trigger: "item", ...T.tooltipDefaults({ trigger: "item" }) },
      legend: { ...T.legendDefaults({ top: "auto", bottom: 0, left: "center" }) },
      color: T.SERIES_PALETTE,
      series: [
        {
          type: "pie",
          radius: ["48%", "72%"],
          center: ["50%", "44%"],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: "#fff", borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: [
            { name: "Negócios & Fomento", value: eixoNegocios },
            { name: "Espaços & Infraestrutura", value: eixoEspacos },
            { name: "Educação & Difusão", value: eixoEducacao },
            { name: "Operação interna", value: eixoOperacao },
          ],
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
