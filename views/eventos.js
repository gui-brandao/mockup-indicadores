// Tela 10 — Eventos: agenda de eventos promovidos/incentivados pelo Parque e
// alcance de networking. "Densidade de rede" não simula conexões individuais
// reais — é a soma, por evento realizado, das combinações possíveis entre
// perfis diferentes presentes (parceiro×startup, parceiro×investidor,
// startup×investidor), como indicador de potencial de networking gerado.
(function () {
  const T = APP_THEME;

  function densidadeRede(lista) {
    return lista
      .filter((e) => e.status === "Realizado")
      .reduce((s, e) => s + e.parceirosPresentes * e.startupsPresentes + e.parceirosPresentes * e.investidoresPresentes + e.startupsPresentes * e.investidoresPresentes, 0);
  }

  function taxaPresenca(lista) {
    const realizados = lista.filter((e) => e.status === "Realizado");
    const inscritos = realizados.reduce((s, e) => s + e.inscritos, 0);
    const presentes = realizados.reduce((s, e) => s + (e.presentes || 0), 0);
    return inscritos ? (presentes / inscritos) * 100 : 0;
  }

  function render() {
    const E = APP_DATA.eventos;

    const kpis =
      UI.kpiCard({ label: "Eventos no período", value: fmt.num(PERIOD.sum(E.eventosMensal)), sub: "promovidos ou incentivados", spark: PERIOD.slice(E.eventosMensal) }) +
      UI.kpiCard({ label: "Participantes", value: fmt.num(PERIOD.sum(E.participantesMensal)), sub: "presenças confirmadas", hero: true, spark: PERIOD.slice(E.participantesMensal) }) +
      UI.kpiCard({ label: "Taxa de presença", value: fmt.num1(taxaPresenca(E.lista)) + "%", sub: "presentes sobre inscritos, eventos realizados" }) +
      UI.kpiCard({ label: "Encaminhamentos gerados", value: fmt.num(PERIOD.sum(E.encaminhamentosMensal)), sub: "para incubadora, fomento, laboratórios etc.", spark: PERIOD.slice(E.encaminhamentosMensal) }) +
      UI.kpiCard({ label: "Densidade de rede", value: fmt.num(densidadeRede(E.lista)), sub: "combinações entre perfis diferentes presentes" });

    const cards = E.lista
      .map((e) => {
        const stats =
          e.presentes !== null
            ? `${fmt.num(e.presentes)} de ${fmt.num(e.inscritos)} presentes`
            : `${fmt.num(e.inscritos)} inscritos · aguardando realização`;
        return `
      <div class="event-card">
        <div class="event-card-head">
          <div>
            <div class="event-card-title">${UI.esc(e.nome)}</div>
            <div class="event-card-date">${new Date(e.data).toLocaleDateString("pt-BR")} · ${UI.esc(e.local)}</div>
          </div>
          ${UI.statusPill(e.status)}
        </div>
        <div class="event-card-tags">
          <span class="pill pill-gray">${UI.esc(e.tipoPublico)}</span>
          ${e.gratuito ? '<span class="pill pill-green">Gratuito</span>' : ""}
        </div>
        <div class="event-card-stats">${stats}</div>
      </div>`;
      })
      .join("");

    const inscricaoRows = E.inscricoes.map((i) => [
      `<span class="td-strong">${UI.esc(i.evento)}</span>`,
      UI.esc(i.participante),
      `<span class="pill pill-gray">${UI.esc(i.perfil)}</span>`,
      i.inscrito ? "✔" : "—",
      i.presente === null ? "—" : i.presente ? "✔" : "✘",
      UI.esc(i.interesse),
      UI.esc(i.encaminhamento),
    ]);

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(5,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-2">
        ${UI.sectionCard({
          eyebrow: "Volume mensal",
          title: "Eventos por mês",
          bodyHtml: UI.chartBox("chart-evt-eventos", 240),
        })}
        ${UI.sectionCard({
          eyebrow: "Alcance mensal",
          title: "Participantes por mês",
          bodyHtml: UI.chartBox("chart-evt-participantes", 240),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: `${fmt.num(E.lista.length)} eventos`,
          title: "Agenda de eventos",
          desc: "Realizados, programados e com inscrições abertas.",
          bodyHtml: `<div class="grid grid-2">${cards}</div>`,
        })}
        ${UI.sectionCard({
          eyebrow: "Perfil de público",
          title: "Eventos por tipo de público",
          bodyHtml: UI.chartBox("chart-evt-publico", 300),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: `${fmt.num(E.inscricoes.length)} registros`,
        title: "Últimas inscrições",
        desc: "Participantes de destaque e para onde foram encaminhados após o evento.",
        bodyHtml: UI.dataTable({
          columns: ["Evento", "Participante", "Perfil", "Inscrito?", "Presente?", "Interesse", "Encaminhamento"],
          rows: inscricaoRows,
        }),
      })}
    `;
  }

  function mount({ registerChart }) {
    const E = APP_DATA.eventos;

    const chartEventos = registerChart(echarts.init(document.getElementById("chart-evt-eventos")));
    chartEventos.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 12 }),
      xAxis: T.categoryAxis(E.monthLabels),
      yAxis: T.valueAxis(),
      series: [{ type: "bar", data: E.eventosMensal, barMaxWidth: 26, itemStyle: { borderRadius: T.barRadius() } }],
    });

    const chartParticipantes = registerChart(echarts.init(document.getElementById("chart-evt-participantes")));
    chartParticipantes.setOption({
      color: [T.SERIES_PALETTE[2]],
      tooltip: T.tooltipDefaults(),
      grid: T.baseGrid({ top: 12 }),
      xAxis: T.categoryAxis(E.monthLabels),
      yAxis: T.valueAxis(),
      series: [T.lineSeriesDefaults({ data: E.participantesMensal, itemStyle: { color: T.SERIES_PALETTE[2] }, lineStyle: { width: 2.5, color: T.SERIES_PALETTE[2] }, areaStyle: { color: "rgba(27,175,122,0.16)" } })],
    });

    const porPublico = {};
    E.lista.forEach((e) => (porPublico[e.tipoPublico] = (porPublico[e.tipoPublico] || 0) + 1));
    const chartPublico = registerChart(echarts.init(document.getElementById("chart-evt-publico")));
    chartPublico.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> evento(s) (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center", type: "scroll" }),
      series: [
        {
          type: "pie",
          radius: ["46%", "70%"],
          center: ["50%", "42%"],
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11.5, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: Object.entries(porPublico).map(([name, value]) => ({ name, value })),
        },
      ],
    });
  }

  window.VIEW_EVENTOS = {
    title: "Eventos",
    subtitle: "Eventos promovidos e incentivados pelo Parque — alcance e networking",
    render,
    mount,
  };
})();
