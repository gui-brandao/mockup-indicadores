// Tela 7 — Metas FINEP: tabela mestre das 25 metas do plano de trabalho.
(function () {
  const T = APP_THEME;

  function eixoResumo(M) {
    const out = {};
    Object.keys(M.eixos).forEach((eixo) => {
      const itens = M.itens.filter((m) => String(m.eixo) === eixo);
      const comPct = itens.filter((m) => m.pct !== null && m.pct !== undefined);
      const avgPct = comPct.length ? comPct.reduce((s, m) => s + m.pct, 0) / comPct.length : null;
      out[eixo] = { total: itens.length, avgPct, concluidas: itens.filter((m) => m.status === "Concluída").length };
    });
    return out;
  }

  function farolClass(status, pct) {
    if (status === "Concluída") return "pill-green";
    if (status === "Não iniciada") return "pill-gray";
    if (status === "Em negociação") return "pill-navy";
    if (pct !== null && pct !== undefined && pct < 40) return "pill-red";
    return "pill-yellow";
  }

  function renderRows(M, eixoFiltro) {
    const itens = eixoFiltro === "all" ? M.itens : M.itens.filter((m) => String(m.eixo) === eixoFiltro);
    return itens
      .map((m) => {
        const pctText = m.pct !== null && m.pct !== undefined ? fmt.num1(m.pct) + "%" : "—";
        const realizadoText = m.realizado !== null && m.realizado !== undefined ? fmt.num(m.realizado) : "—";
        const metaText = m.meta !== null && m.meta !== undefined ? fmt.num(m.meta) : "qualitativa";
        return `<tr>
          <td class="td-strong">${m.cod}</td>
          <td>${UI.esc(m.objetivo)}</td>
          <td class="td-muted">${M.eixos[m.eixo]}</td>
          <td class="td-num">${metaText}</td>
          <td class="td-num">${realizadoText}</td>
          <td class="td-num">${pctText}</td>
          <td><span class="pill ${farolClass(m.status, m.pct)}">${UI.esc(m.status)}</span></td>
        </tr>`;
      })
      .join("");
  }

  function render() {
    const M = APP_DATA.metas;
    const resumo = eixoResumo(M);

    const axisCards = Object.entries(M.eixos)
      .map(([eixo, nome]) => {
        const r = resumo[eixo];
        return UI.axisTile({
          name: `Eixo ${eixo} · ${nome}`,
          value: r.avgPct !== null ? fmt.num1(r.avgPct) + "%" : "—",
          sub: `${fmt.num(r.total)} metas · ${fmt.num(r.concluidas)} concluída(s)`,
        });
      })
      .join("");

    const chipRow = ["all", "1", "2", "3", "4"]
      .map(
        (v) =>
          `<button class="filter-chip ${v === "all" ? "is-active" : ""}" data-eixo="${v}">${
            v === "all" ? "Todos os eixos" : "Eixo " + v
          }</button>`
      )
      .join("");

    return `
      <div class="grid grid-4">${axisCards}</div>

      ${UI.sectionCard({
        eyebrow: "25 metas · Plano de trabalho FINEP",
        title: "% de execução por meta",
        desc: "Metas com indicador numérico definido, coloridas por eixo.",
        bodyHtml: UI.chartBox("chart-metas-pct", 480),
      })}

      ${UI.sectionCard({
        eyebrow: "Tabela mestre",
        title: "Metas anuais — realizado × meta",
        bodyHtml: `
          <div class="chip-row" id="metas-filter" style="margin-bottom:14px">${chipRow}</div>
          <div id="metas-table-wrap">${UI.dataTable({
            columns: ["Cód.", "Objetivo específico", "Eixo", "Meta anual", "Realizado", "% Execução", "Status"],
            rows: [],
          })}</div>`,
      })}
    `;
  }

  function mount({ registerChart }) {
    const M = APP_DATA.metas;

    const tableWrap = document.getElementById("metas-table-wrap");
    function paintTable(eixo) {
      tableWrap.innerHTML = `<div class="table-wrap"><table class="data-table"><thead><tr>
        <th>Cód.</th><th>Objetivo específico</th><th>Eixo</th><th>Meta anual</th><th>Realizado</th><th>% Execução</th><th>Status</th>
      </tr></thead><tbody>${renderRows(M, eixo)}</tbody></table></div>`;
    }
    paintTable("all");

    document.getElementById("metas-filter").addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      document.querySelectorAll("#metas-filter .filter-chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      paintTable(btn.dataset.eixo);
    });

    const comPct = M.itens.filter((m) => m.pct !== null && m.pct !== undefined);
    const eixoColor = { 1: T.COLORS.navy600, 2: T.COLORS.navy400, 3: T.COLORS.yellow500, 4: T.COLORS.green600 };
    const chart = registerChart(echarts.init(document.getElementById("chart-metas-pct")));
    chart.setOption({
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      grid: T.baseGrid({ top: 10, right: 24 }),
      xAxis: T.valueAxis({ name: "% execução" }),
      yAxis: T.categoryAxis(comPct.map((m) => m.cod), { axisLabel: { ...T.axisText(), fontWeight: 700, interval: 0 } }),
      series: [
        {
          type: "bar",
          data: comPct.map((m) => ({ value: m.pct, itemStyle: { color: eixoColor[m.eixo] } })),
          barMaxWidth: 14,
          itemStyle: { borderRadius: [0, 6, 6, 0] },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: T.COLORS.gray500, type: "dashed" },
            label: { formatter: "meta 100%", color: T.COLORS.gray500, fontSize: 10 },
            data: [{ xAxis: 100 }],
          },
        },
      ],
    });
  }

  window.VIEW_METAS = {
    title: "Metas FINEP",
    subtitle: "Plano de trabalho — 25 metas em 4 eixos",
    render,
    mount,
  };
})();
