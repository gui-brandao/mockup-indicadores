// Tela 9 — Monitoramento de Uso: painel interno de acompanhamento das
// contrapartidas declaradas na tela Parcerias, item a item. Mesma fonte de
// dados (data/parcerias.js), achatada aqui — nenhum dataset paralelo.
(function () {
  const T = APP_THEME;

  function flatten(P) {
    const rows = [];
    P.parceiros.forEach((p) => {
      p.contrapartidas.forEach((c) => {
        const status = c.quantidadeUtilizada === 0 ? "Não iniciado" : c.quantidadeUtilizada >= c.quantidadePrevista ? "Concluído" : "Em andamento";
        rows.push({
          parceiroId: p.id,
          parceiro: p.nome,
          categoria: c.categoria,
          descricao: c.descricao,
          previsto: c.quantidadePrevista,
          utilizado: c.quantidadeUtilizada,
          unidade: c.unidade,
          saldo: c.quantidadePrevista - c.quantidadeUtilizada,
          pct: fmt.clamp((c.quantidadeUtilizada / c.quantidadePrevista) * 100, 0, 100),
          status,
        });
      });
    });
    return rows;
  }

  function renderRows(rows, parceiroFiltro) {
    const filtered = parceiroFiltro === "all" ? rows : rows.filter((r) => r.parceiroId === parceiroFiltro);
    return filtered
      .map(
        (r) => `<tr>
      <td class="td-strong">${UI.esc(r.parceiro)}</td>
      <td>${UI.esc(r.categoria)}</td>
      <td class="td-muted">${UI.esc(r.descricao)}</td>
      <td class="td-num">${fmt.num(r.previsto)} ${UI.esc(r.unidade)}</td>
      <td class="td-num">${fmt.num(r.utilizado)} ${UI.esc(r.unidade)}</td>
      <td class="td-num">${fmt.num(r.saldo)} ${UI.esc(r.unidade)}</td>
      <td>${UI.miniBar(r.utilizado, r.previsto)}</td>
      <td>${UI.statusPill(r.status)}</td>
    </tr>`
      )
      .join("");
  }

  function render() {
    const P = APP_DATA.parcerias;
    const rows = flatten(P);
    const naoIniciados = rows.filter((r) => r.status === "Não iniciado").length;
    const emAndamento = rows.filter((r) => r.status === "Em andamento").length;
    const concluidos = rows.filter((r) => r.status === "Concluído").length;
    const utilizacaoMedia = rows.reduce((s, r) => s + r.pct, 0) / rows.length;

    const kpis =
      UI.kpiCard({ label: "Itens não iniciados", value: fmt.num(naoIniciados), sub: `de ${fmt.num(rows.length)} itens mapeados` }) +
      UI.kpiCard({ label: "Itens em andamento", value: fmt.num(emAndamento), sub: "uso parcial da contrapartida", hero: true }) +
      UI.kpiCard({ label: "Itens concluídos", value: fmt.num(concluidos), sub: "100% da quantidade prevista" }) +
      UI.kpiCard({ label: "Utilização média", value: fmt.num1(utilizacaoMedia) + "%", sub: "média simples entre os itens" });

    const chipRow = [{ id: "all", nome: "Todos" }, ...P.parceiros.map((p) => ({ id: p.id, nome: p.sigla }))]
      .map((p) => `<button class="filter-chip ${p.id === "all" ? "is-active" : ""}" data-parceiro="${p.id}">${UI.esc(p.nome)}</button>`)
      .join("");

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Contrapartidas em uso",
          title: "Itens por status de utilização",
          bodyHtml: UI.chartBox("chart-mon-status", 280),
        })}
        ${UI.sectionCard({
          eyebrow: "Ranking",
          title: "% utilizado médio por parceiro",
          bodyHtml: UI.chartBox("chart-mon-parceiro", 280),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: `${fmt.num(rows.length)} itens de contrapartida`,
        title: "Previsto × utilizado × saldo",
        desc: "Mesma base de dados da tela Parcerias, achatada por item de contrapartida. Filtre por parceiro.",
        bodyHtml: `
          <div class="chip-row" id="mon-filter" style="margin-bottom:14px">${chipRow}</div>
          <div id="mon-table-wrap">${UI.dataTable({
            columns: ["Parceiro", "Categoria", "Descrição", "Previsto", "Utilizado", "Saldo", "% utilizado", "Status"],
            rows: [],
          })}</div>`,
      })}
    `;
  }

  function mount({ registerChart }) {
    const P = APP_DATA.parcerias;
    const rows = flatten(P);

    const tableWrap = document.getElementById("mon-table-wrap");
    function paintTable(parceiroId) {
      tableWrap.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr>
        <th>Parceiro</th><th>Categoria</th><th>Descrição</th><th>Previsto</th><th>Utilizado</th><th>Saldo</th><th>% utilizado</th><th>Status</th>
      </tr></thead><tbody>${renderRows(rows, parceiroId)}</tbody></table></div>`;
    }
    paintTable("all");

    document.getElementById("mon-filter").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      document.querySelectorAll("#mon-filter .filter-chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      paintTable(btn.dataset.parceiro);
    });

    const statusCounts = { "Não iniciado": 0, "Em andamento": 0, "Concluído": 0 };
    rows.forEach((r) => statusCounts[r.status]++);
    const statusColor = { "Não iniciado": T.COLORS.gray300, "Em andamento": T.STATUS.warning, "Concluído": T.STATUS.good };
    const chartStatus = registerChart(echarts.init(document.getElementById("chart-mon-status")));
    chartStatus.setOption({
      color: Object.keys(statusCounts).map((s) => statusColor[s]),
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> item(ns) (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center", type: "scroll" }),
      series: [
        {
          type: "pie",
          radius: ["44%", "70%"],
          center: ["50%", "40%"],
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{c}", color: "#fff", fontSize: 12, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
        },
      ],
    });

    const porParceiro = P.parceiros
      .map((p) => {
        const itens = rows.filter((r) => r.parceiroId === p.id);
        const media = itens.reduce((s, r) => s + r.pct, 0) / itens.length;
        return { nome: p.sigla, media };
      })
      .sort((a, b) => a.media - b.media);

    const chartParceiro = registerChart(echarts.init(document.getElementById("chart-mon-parceiro")));
    chartParceiro.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num1(p.value)}%</b>` }),
      grid: T.baseGrid({ top: 10, right: 24 }),
      xAxis: T.valueAxis({ name: "% utilizado", max: 100 }),
      yAxis: T.categoryAxis(porParceiro.map((p) => p.nome), { axisLabel: { ...T.axisText(), fontWeight: 700, interval: 0 } }),
      series: [
        {
          type: "bar",
          data: porParceiro.map((p) => Number(p.media.toFixed(1))),
          barMaxWidth: 16,
          itemStyle: { borderRadius: T.barRadius("horizontal"), color: T.SERIES_PALETTE[0] },
        },
      ],
    });
  }

  window.VIEW_MONITORAMENTO_USO = {
    title: "Monitoramento de Uso",
    subtitle: "Utilização das contrapartidas de parceria, item a item",
    render,
    mount,
  };
})();
