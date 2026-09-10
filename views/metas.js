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
          bar: { pct: r.avgPct || 0, cls: (r.avgPct || 0) >= 60 ? "" : "warn" },
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

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "25 metas · Plano de trabalho FINEP",
          title: "% de execução por meta",
          desc: "Metas com indicador numérico definido, coloridas por eixo.",
          bodyHtml: UI.chartBox("chart-metas-pct", 480),
        })}
        ${UI.sectionCard({
          eyebrow: "Panorama de status",
          title: "As 25 metas, por status",
          bodyHtml: UI.chartBox("chart-metas-status", 260) + UI.chartBox("chart-metas-radar", 260),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "5 metas de atendimento com granularidade mensal (1.1.1 · 3.1.1 · 3.2.1 · 3.3.1 · 3.4.1)",
        title: "Planejado × realizado mensal consolidado",
        desc: "Soma das metas de atendimento cuja série mensal está disponível nos sistemas de origem.",
        bodyHtml: UI.chartBox("chart-metas-pr", 280),
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
    const eixoColor = { 1: T.SERIES_PALETTE[0], 2: T.SERIES_PALETTE[1], 3: T.SERIES_PALETTE[3], 4: T.SERIES_PALETTE[2] };
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
          itemStyle: { borderRadius: T.barRadius("horizontal") },
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

    // Rosca de status — as 25 metas por situação atual.
    const statusColor = { "Concluída": T.STATUS.good, "Em execução": T.STATUS.warning, "Não iniciada": T.STATUS.neutral, "Em negociação": T.SERIES_PALETTE[0] };
    const statusCounts = {};
    M.itens.forEach((m) => (statusCounts[m.status] = (statusCounts[m.status] || 0) + 1));
    const chartStatus = registerChart(echarts.init(document.getElementById("chart-metas-status")));
    chartStatus.setOption({
      color: Object.keys(statusCounts).map((s) => statusColor[s] || T.COLORS.gray500),
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> meta(s) (${p.percent}%)` }),
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

    // Radar — % médio de execução por eixo.
    const eixoPct = Object.keys(M.eixos).map((eixo) => {
      const itens = M.itens.filter((m) => String(m.eixo) === eixo && m.pct !== null && m.pct !== undefined);
      return itens.length ? itens.reduce((s, m) => s + m.pct, 0) / itens.length : 0;
    });
    const chartRadar = registerChart(echarts.init(document.getElementById("chart-metas-radar")));
    chartRadar.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      radar: T.radarBase(Object.keys(M.eixos).map((eixo) => ({ name: `Eixo ${eixo}`, max: 100 })), { radius: "62%", center: ["50%", "54%"] }),
      series: [
        {
          type: "radar",
          data: [
            {
              value: eixoPct.map((v) => Number(v.toFixed(1))),
              name: "% de execução",
              areaStyle: { color: "rgba(47,122,184,0.22)" },
              lineStyle: { width: 2 },
              symbolSize: 7,
              label: { show: true, formatter: (p) => fmt.num1(p.value) + "%", color: T.COLORS.gray700, fontSize: 10.5, fontWeight: 700 },
            },
          ],
        },
      ],
    });

    // Planejado × realizado consolidado — só metas com série mensal real disponível.
    const C = APP_DATA.crm,
      E = APP_DATA.educacao;
    const metasComSerie = ["1.1.1", "3.1.1", "3.2.1", "3.3.1", "3.4.1"].map((cod) => M.itens.find((m) => m.cod === cod));
    const planejadoTotal = metasComSerie.reduce((s, m) => s + m.meta, 0) / 9;
    const planejadoSerie = C.monthLabels.map(() => planejadoTotal);
    const realizadoSerie = C.monthLabels.map(
      (_, i) => C.series.realizado[i] + E.series.ava[i] + E.series.estudantes[i] + E.series.roteiros[i] + E.series.visitas[i]
    );

    const chartPR = registerChart(echarts.init(document.getElementById("chart-metas-pr")));
    chartPR.setOption({
      color: [T.COLORS.gray300, T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(C.monthLabels),
      yAxis: T.valueAxis(),
      series: [
        { name: "Planejado (média mensal)", type: "bar", data: planejadoSerie, barMaxWidth: 26, itemStyle: { borderRadius: T.barRadius() } },
        { name: "Realizado", type: "bar", data: realizadoSerie, barMaxWidth: 26, itemStyle: { borderRadius: T.barRadius() } },
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
