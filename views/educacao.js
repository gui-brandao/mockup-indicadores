// Tela 6 — Educação & Visitas: AVA, roteiros pedagógicos, visitas técnicas e eventos.
(function () {
  const T = APP_THEME;

  function render() {
    const E = APP_DATA.educacao;
    const M = APP_DATA.metas;
    const metasEdu = ["3.1.1", "3.2.1", "3.3.1", "3.4.1", "3.5.1", "3.6.1"].map((cod) => M.itens.find((m) => m.cod === cod));

    const kpis =
      UI.kpiCard({
        label: "Atendimentos em educação",
        value: fmt.num(PERIOD.sum(E.series.ava) + PERIOD.sum(E.series.estudantes) + PERIOD.sum(E.series.roteiros)),
        sub: "AVA + estudantes parceiros + roteiros",
        hero: true,
      }) +
      UI.kpiCard({ label: "Visitas técnicas guiadas", value: fmt.num(PERIOD.sum(E.series.visitas)), sub: "empresas, universidades e grupos" }) +
      UI.kpiCard({ label: "Público impactado (estimado)", value: fmt.num(E.publicoPorPerfil.reduce((s, p) => s + p.valor, 0)), sub: "todos os perfis, YTD" }) +
      UI.kpiCard({ label: "Temas no catálogo do AVA", value: fmt.num(E.catalogoAva.length), sub: "trilha de 2h cada" });

    const progressBars = metasEdu
      .map((m) => UI.progressBar({ name: m.objetivo, value: m.realizado, meta: m.meta, unit: m.unidade.replace("/ano", "") }))
      .join("");

    const catalogoRows = E.catalogoAva.map((t) => [
      UI.esc(t.tema),
      t.data ? new Date(t.data).toLocaleDateString("pt-BR") : "<span class='td-muted'>a definir</span>",
      UI.esc(t.duracao.slice(0, 5)),
      UI.esc(t.objetivo),
    ]);

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Metas 3.x · Educação e Difusão",
          title: "Execução das metas do eixo",
          desc: "Realizado acumulado (Jan–Set/2026) sobre a meta anual do plano FINEP.",
          bodyHtml: progressBars,
        })}
        ${UI.sectionCard({
          eyebrow: "Perfis atendidos",
          title: "Público por perfil",
          bodyHtml: UI.chartBox("chart-edu-perfil", 280),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "Sazonalidade",
        title: "Visitas técnicas e roteiros pedagógicos, mês a mês",
        bodyHtml: UI.chartBox("chart-edu-serie", 280),
      })}

      ${UI.sectionCard({
        eyebrow: "Materiais disponíveis no AVA",
        title: "Catálogo de temas — trilha de atendimento diagnóstico",
        desc: "17 temas de 2h, com objetivo de aprendizagem e cronograma sugerido.",
        bodyHtml: UI.dataTable({ columns: ["Tema", "Data prevista", "Duração", "Objetivo"], rows: catalogoRows }),
      })}
    `;
  }

  function mount({ registerChart }) {
    const E = APP_DATA.educacao;

    const chartPerfil = registerChart(echarts.init(document.getElementById("chart-edu-perfil")));
    chartPerfil.setOption({
      color: [T.COLORS.navy600],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(E.publicoPorPerfil.map((p) => p.perfil)),
      series: [{ type: "bar", data: E.publicoPorPerfil.map((p) => p.valor), barMaxWidth: 20, itemStyle: { borderRadius: [0, 6, 6, 0] } }],
    });

    const chartSerie = registerChart(echarts.init(document.getElementById("chart-edu-serie")));
    chartSerie.setOption({
      color: [T.COLORS.navy600, T.COLORS.yellow500],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(PERIOD.slice(E.monthLabels)),
      yAxis: T.valueAxis(),
      series: [
        { name: "Visitas técnicas", type: "line", data: PERIOD.slice(E.series.visitas), smooth: 0.3, symbol: "circle", symbolSize: 6 },
        { name: "Roteiros pedagógicos", type: "line", data: PERIOD.slice(E.series.roteiros), smooth: 0.3, symbol: "circle", symbolSize: 6 },
      ],
    });
  }

  window.VIEW_EDUCACAO = {
    title: "Educação & Visitas",
    subtitle: "AVA, roteiros pedagógicos, visitas técnicas e eventos de CT&I",
    render,
    mount,
  };
})();
