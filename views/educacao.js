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
        spark: PERIOD.slice(E.series.ava.map((v, i) => v + E.series.estudantes[i] + E.series.roteiros[i])),
      }) +
      UI.kpiCard({ label: "Visitas técnicas guiadas", value: fmt.num(PERIOD.sum(E.series.visitas)), sub: "empresas, universidades e grupos", spark: PERIOD.slice(E.series.visitas) }) +
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

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Sazonalidade",
          title: "Visitas técnicas e roteiros pedagógicos, mês a mês",
          bodyHtml: UI.chartBox("chart-edu-serie", 280),
        })}
        ${UI.sectionCard({
          eyebrow: "Perfil das visitas",
          title: "Visitas técnicas por tipo de instituição",
          bodyHtml: UI.chartBox("chart-edu-instituicao", 280),
        })}
      </div>

      <div class="grid grid-2">
        ${UI.sectionCard({
          eyebrow: "AVA",
          title: "Inscritos × conclusões por trilha",
          desc: "As seis trilhas do Ambiente Virtual de Aprendizagem.",
          bodyHtml: UI.chartBox("chart-edu-trilhas", 300),
        })}
        ${UI.sectionCard({
          eyebrow: "Alcance regional",
          title: "Roteiros pedagógicos por cidade do Grande ABC",
          bodyHtml: UI.chartBox("chart-edu-cidade", 300),
        })}
      </div>

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
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(E.publicoPorPerfil.map((p) => p.perfil)),
      series: [{ type: "bar", data: E.publicoPorPerfil.map((p) => p.valor), barMaxWidth: 20, itemStyle: { borderRadius: T.barRadius("horizontal") } }],
    });

    const chartSerie = registerChart(echarts.init(document.getElementById("chart-edu-serie")));
    chartSerie.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[3]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(PERIOD.slice(E.monthLabels)),
      yAxis: T.valueAxis(),
      series: [
        T.lineSeriesDefaults({ name: "Visitas técnicas", data: PERIOD.slice(E.series.visitas), itemStyle: { color: T.SERIES_PALETTE[0] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[0] } }),
        T.lineSeriesDefaults({ name: "Roteiros pedagógicos", data: PERIOD.slice(E.series.roteiros), itemStyle: { color: T.SERIES_PALETTE[3] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[3] } }),
      ],
    });

    const chartInstituicao = registerChart(echarts.init(document.getElementById("chart-edu-instituicao")));
    chartInstituicao.setOption({
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
          data: E.visitasPorInstituicao.map((v) => ({ name: v.instituicao, value: v.valor })),
        },
      ],
    });

    // Barras horizontais — nomes de trilha são longos e rotacionar rótulos
    // verticais colidia; categorias no eixo Y resolvem sem truncar nada.
    const trilhasOrd = [...E.trilhas].reverse();
    const chartTrilhas = registerChart(echarts.init(document.getElementById("chart-edu-trilhas")));
    chartTrilhas.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[2]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(trilhasOrd.map((t) => t.trilha), { axisLabel: { ...T.axisText(), interval: 0 } }),
      series: [
        { name: "Inscritos", type: "bar", data: trilhasOrd.map((t) => t.inscritos), barMaxWidth: 14, itemStyle: { borderRadius: T.barRadius("horizontal") } },
        { name: "Conclusões", type: "bar", data: trilhasOrd.map((t) => t.conclusoes), barMaxWidth: 14, itemStyle: { borderRadius: T.barRadius("horizontal") } },
      ],
    });

    const cidade = [...E.porCidade].sort((a, b) => a.valor - b.valor);
    const chartCidade = registerChart(echarts.init(document.getElementById("chart-edu-cidade")));
    chartCidade.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10, right: 60 }),
      xAxis: T.valueAxis({ axisLabel: { show: false }, splitLine: { show: false } }),
      yAxis: T.categoryAxis(cidade.map((c) => c.cidade)),
      series: [
        {
          type: "bar",
          data: cidade.map((c) => c.valor),
          barMaxWidth: 18,
          itemStyle: { borderRadius: T.barRadius("horizontal") },
          label: { show: true, position: "right", formatter: (p) => fmt.num(p.value), color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
        },
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
