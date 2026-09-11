// Tela 12 — Laboratórios: uso técnico dos 3 laboratórios (mesmos nomes da
// meta real 2.2.x em data/metas.js). Dois tipos de métrica coexistem, sem se
// contradizer: um retrato fixo dos últimos 30 dias (usos/horas/%utilização,
// igual ao `snapshot` de data/os.js) e uma série acumulada do ano
// (usosMensal), lida via PERIOD como startupsAtivas.
(function () {
  const T = APP_THEME;

  const ICONS = { "Manufatura Avançada": "🏭", "Inteligência Artificial": "🤖", "Conectividade": "📡" };

  function elegibilidadePill(elegibilidade) {
    const tone = elegibilidade === "Elegível" ? "green" : elegibilidade === "Em análise" ? "yellow" : "gray";
    return `<span class="pill pill-${tone}">${UI.esc(elegibilidade)}</span>`;
  }

  function combinedUsosMensal(laboratorios) {
    return laboratorios[0].usosMensal.map((_, i) => laboratorios.reduce((s, l) => s + l.usosMensal[i], 0));
  }

  function render() {
    const L = APP_DATA.laboratorios;
    const combinado = combinedUsosMensal(L.laboratorios);
    const usos30d = L.laboratorios.reduce((s, l) => s + l.usos, 0);
    const horas30d = L.laboratorios.reduce((s, l) => s + l.horasPeriodo, 0);
    const utilizacaoMedia = L.laboratorios.reduce((s, l) => s + l.utilizacaoPct, 0) / L.laboratorios.length;
    const emAberto = L.solicitacoes.filter((s) => s.status === "Agendado" || s.status === "Em atendimento").length;

    const kpis =
      UI.kpiCard({ label: "Usos acumulados no ano", value: fmt.num(PERIOD.last(combinado)), sub: "soma dos 3 laboratórios", hero: true, spark: PERIOD.slice(combinado) }) +
      UI.kpiCard({ label: "Usos registrados", value: fmt.num(usos30d), sub: L.referencia }) +
      UI.kpiCard({ label: "Horas no período", value: fmt.num(horas30d), sub: "carga técnica total" }) +
      UI.kpiCard({ label: "Utilização média", value: fmt.num1(utilizacaoMedia) + "%", sub: "média simples entre os laboratórios" }) +
      UI.kpiCard({ label: "Solicitações em aberto", value: fmt.num(emAberto), sub: "agendadas ou em atendimento" });

    const cards = L.laboratorios
      .map(
        (l) => `
      <div class="lab-card">
        <div class="lab-card-icon" style="background:${T.COLORS.gray100}">${ICONS[l.nome] || "🔬"}</div>
        <div class="lab-card-name">${UI.esc(l.nome)}</div>
        <div class="lab-card-sub">${fmt.num(l.usos)} usos · ${fmt.num(l.horasPeriodo)}h no período</div>
        <div class="lab-card-track">
          <div class="progress-track"><div class="progress-fill ${l.utilizacaoPct >= 60 ? "" : l.utilizacaoPct >= 30 ? "warn" : "danger"}" style="width:${l.utilizacaoPct}%"></div></div>
          <span class="lab-card-pct">${fmt.num(l.utilizacaoPct)}%</span>
        </div>
      </div>`
      )
      .join("");

    const rows = L.solicitacoes.map((s) => [
      `<span class="td-strong">${UI.esc(s.cliente)}</span>`,
      UI.esc(s.laboratorio),
      UI.esc(s.projeto),
      elegibilidadePill(s.elegibilidade),
      new Date(s.data).toLocaleDateString("pt-BR"),
      UI.esc(s.respTecnico),
      UI.statusPill(s.status),
      s.horas === null ? "<span class='td-muted'>—</span>" : `${fmt.num(s.horas)}h`,
    ]);

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(5,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-3">${cards}</div>

      ${UI.sectionCard({
        eyebrow: "Evolução no ano",
        title: "Usos acumulados por laboratório",
        desc: "Soma de sessões técnicas registradas, mês a mês.",
        bodyHtml: UI.chartBox("chart-lab-mensal", 280),
      })}

      ${UI.sectionCard({
        eyebrow: `${fmt.num(L.solicitacoes.length)} solicitações`,
        title: "Uso registrado",
        desc: "Solicitações de uso de laboratório por cliente/projeto.",
        bodyHtml: UI.dataTable({
          columns: ["Cliente", "Laboratório", "Projeto", "Elegibilidade", "Data", "Resp. técnico", "Status", "Horas"],
          rows,
        }),
      })}
    `;
  }

  function mount({ registerChart }) {
    const L = APP_DATA.laboratorios;

    const chart = registerChart(echarts.init(document.getElementById("chart-lab-mensal")));
    chart.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(PERIOD.slice(L.monthLabels)),
      yAxis: T.valueAxis(),
      series: L.laboratorios.map((l, i) =>
        T.lineSeriesDefaults({ name: l.nome, data: PERIOD.slice(l.usosMensal), itemStyle: { color: T.SERIES_PALETTE[i] }, lineStyle: { width: 2, color: T.SERIES_PALETTE[i] } })
      ),
    });
  }

  window.VIEW_LABORATORIOS = {
    title: "Laboratórios",
    subtitle: "Uso técnico dos laboratórios do Parque",
    render,
    mount,
  };
})();
