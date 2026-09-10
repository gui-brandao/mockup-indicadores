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

  function kpiCard({ label, value, sub, trend, hero, id }) {
    const trendHtml = trend
      ? `<span class="kpi-trend ${trend.dir}">${trend.dir === "up" ? "▲" : trend.dir === "down" ? "▼" : "•"} ${esc(
          trend.text
        )}</span>`
      : "";
    return `
      <div class="card kpi-card ${hero ? "is-hero" : ""}" ${id ? `id="${id}"` : ""}>
        <div class="kpi-label">${esc(label)}</div>
        <div class="kpi-value">${value}</div>
        ${sub ? `<div class="kpi-sub">${esc(sub)}</div>` : ""}
        ${trendHtml}
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

  function axisTile({ name, value, sub }) {
    return `
      <div class="axis-tile">
        <div class="axis-name">${esc(name)}</div>
        <div class="axis-value">${value}</div>
        ${sub ? `<div class="axis-sub">${esc(sub)}</div>` : ""}
      </div>`;
  }

  window.UI = { esc, kpiCard, sectionCard, chartBox, progressBar, statusPill, dataTable, axisTile };
})();
