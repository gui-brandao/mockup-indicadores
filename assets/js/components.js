// Componentes de UI reaproveitados pelas views — funções puras que
// devolvem HTML (string) ou usam fmt para número/pct pt-BR.
(function () {
  function esc(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // Minigráfico de tendência em SVG inline: sem instância de biblioteca, sem
  // risco de ficar vazio se algo falhar no carregamento dos gráficos maiores.
  function sparkline(values, opts) {
    const o = Object.assign({ width: 132, height: 34, tone: "navy" }, opts || {});
    const vals = (values || []).filter((v) => typeof v === "number" && !Number.isNaN(v));
    if (vals.length < 2) return "";

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    const stepX = o.width / (vals.length - 1);
    const pad = 3;
    const usable = o.height - pad * 2;

    const pts = vals.map((v, i) => [i * stepX, pad + usable - ((v - min) / span) * usable]);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${line} L${o.width},${o.height} L0,${o.height} Z`;
    const last = pts[pts.length - 1];

    return `
      <svg class="spark spark-${o.tone}" viewBox="0 0 ${o.width} ${o.height}" width="100%" height="${o.height}"
           preserveAspectRatio="none" role="img" aria-label="Tendência dos últimos ${vals.length} meses" focusable="false">
        <path class="spark-area" d="${area}" />
        <path class="spark-line" d="${line}" />
        <circle class="spark-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.6" />
      </svg>`;
  }

  // Barra de progresso compacta para usar dentro de células de tabela.
  function miniBar(value, meta) {
    const pct = meta ? fmt.clamp((value / meta) * 100, 0, 100) : 0;
    const cls = pct >= 100 ? "done" : pct >= 60 ? "" : pct >= 30 ? "warn" : "danger";
    return `
      <div class="mini-bar" title="${fmt.num(value)} de ${fmt.num(meta)}">
        <div class="progress-track"><div class="progress-fill ${cls}" style="width:${pct}%"></div></div>
        <span class="mini-bar-value">${fmt.num1(pct)}%</span>
      </div>`;
  }

  function kpiCard({ label, value, sub, trend, hero, id, spark, sparkTone }) {
    const trendHtml = trend
      ? `<span class="kpi-trend ${trend.dir}">${trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "•"} ${esc(
          trend.text
        )}</span>`
      : "";
    // Só reserva o espaço da sparkline quando ela de fato desenha algo — um
    // período de 1 mês não tem 2 pontos para traçar, e não deve deixar um
    // vão vazio reservado no cartão.
    const sparkSvg = spark ? sparkline(spark, { tone: sparkTone || (hero ? "light" : "navy") }) : "";
    const sparkHtml = sparkSvg ? `<div class="kpi-spark">${sparkSvg}</div>` : "";
    return `
      <div class="card kpi-card ${hero ? "is-hero" : ""}" ${id ? `id="${id}"` : ""}>
        <div class="kpi-label">${esc(label)}</div>
        <div class="kpi-value">${value}</div>
        ${sub ? `<div class="kpi-sub">${esc(sub)}</div>` : ""}
        ${trendHtml}
        ${sparkHtml}
      </div>`;
  }

  function sectionCard({ eyebrow, title, desc, meta, bodyHtml, id, className }) {
    return `
      <div class="card ${className || ""}" ${id ? `id="${id}"` : ""}>
        <div class="card-header">
          <div>
            ${eyebrow ? `<div class="card-eyebrow">${esc(eyebrow)}</div>` : ""}
            <div class="card-title">${esc(title)}</div>
            ${desc ? `<div class="card-desc">${esc(desc)}</div>` : ""}
          </div>
          ${meta ? `<div class="card-meta">${esc(meta)}</div>` : ""}
        </div>
        ${bodyHtml || ""}
      </div>`;
  }

  function chartBox(id, height) {
    return `<div class="chart-box" id="${id}" style="height:${height || 280}px"></div>`;
  }

  function progressBar({ name, value, meta, unit, tone }) {
    const pctVal = meta ? fmt.clamp((value / meta) * 100, 0, 100) : 0;
    const cls = tone || (pctVal >= 100 ? "done" : pctVal >= 60 ? "" : pctVal >= 30 ? "warn" : "danger");
    const valueText = meta
      ? `${fmt.num(value)} / ${fmt.num(meta)}${unit ? " " + unit : ""} · ${fmt.num1(pctVal)}%`
      : `${fmt.num(value)}${unit ? " " + unit : ""}`;
    return `
      <div class="progress-row">
        <div class="progress-head">
          <span class="name">${esc(name)}</span>
          <span class="value">${valueText}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${cls}" style="width:${meta ? pctVal : 100}%"></div>
        </div>
      </div>`;
  }

  function statusPill(status) {
    const map = {
      "Em execução": "yellow",
      "Concluída": "green",
      "Concluído": "green",
      "Finalizado": "green",
      "Não iniciada": "gray",
      "Em negociação": "navy",
      "Em andamento agora": "green",
      "Próximo": "navy",
      "Pendente": "yellow",
      "Agendado": "navy",
      "Aguardando": "gray",
      "Em Andamento": "yellow",
    };
    const tone = map[status] || "gray";
    return `<span class="pill pill-${tone}">${esc(status)}</span>`;
  }

  function dataTable({ columns, rows, numericCols }) {
    numericCols = numericCols || [];
    const thead = columns.map((c) => `<th>${esc(c)}</th>`).join("");
    const body = rows
      .map((row) => {
        const tds = row
          .map((cell, i) => {
            const numCls = numericCols.includes(i) ? " td-num" : "";
            return `<td class="${numCls}">${cell}</td>`;
          })
          .join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");
    return `<div class="table-wrap"><table class="data-table"><thead><tr>${thead}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function axisTile({ name, value, sub, spark, bar }) {
    return `
      <div class="axis-tile">
        <div class="axis-name">${esc(name)}</div>
        <div class="axis-value">${value}</div>
        ${sub ? `<div class="axis-sub">${esc(sub)}</div>` : ""}
        ${bar ? `<div class="progress-track" style="margin-top:10px"><div class="progress-fill ${bar.cls || ""}" style="width:${bar.pct}%"></div></div>` : ""}
        ${spark ? `<div class="tile-spark">${sparkline(spark, { height: 28 })}</div>` : ""}
      </div>`;
  }

  window.UI = { esc, kpiCard, sectionCard, chartBox, progressBar, statusPill, dataTable, axisTile, sparkline, miniBar };
})();
