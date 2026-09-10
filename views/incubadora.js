// Tela 2 — Incubadora & Jornada: metodologia replicável (S1–S6, 9 ciclos).
(function () {
  const T = APP_THEME;

  function render() {
    const I = APP_DATA.incubadora;

    const kpis =
      UI.kpiCard({ label: "Startups ativas", value: fmt.num(I.kpis.startupsAtivas), sub: "Entrada → Escala, em 10/09/2026", hero: true }) +
      UI.kpiCard({ label: "Mentorias realizadas", value: fmt.num(I.kpis.mentoriasRealizadas), sub: "Atendimentos individuais no ano" }) +
      UI.kpiCard({ label: "Aulas coletivas ministradas", value: fmt.num(I.kpis.aulasMinistradas), sub: `de ${fmt.num(
        I.aulasColetivas.reduce((s, a) => s + a.total, 0)
      )} planejadas` }) +
      UI.kpiCard({ label: "Entregas do plano concluídas", value: fmt.num(I.planoTrabalho.concluida), sub: `de ${fmt.num(
        I.planoTrabalho.concluida + I.planoTrabalho.emExecucao + I.planoTrabalho.naoIniciada
      )} com status definido` }) +
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
      return [UI.esc(a.fase), `${a.prontas}/${a.total}`, `
        <div class="progress-track" style="width:160px">
          <div class="progress-fill ${pct >= 100 ? "done" : pct > 0 ? "warn" : "danger"}" style="width:${pct}%"></div>
        </div>`];
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
      color: [T.COLORS.navy600, T.COLORS.yellow500],
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
        { name: "Individual", type: "bar", stack: "total", data: I.fases.map((f) => f.individual), barMaxWidth: 40 },
        { name: "Coletivo", type: "bar", stack: "total", data: I.fases.map((f) => f.coletivo), barMaxWidth: 40 },
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
