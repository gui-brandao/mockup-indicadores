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
      "Em andamento": "yellow",
      "Em atendimento": "yellow",
      "Ativa": "green",
      "Encerrada": "gray",
      "Fora do SLA": "red",
      "Inscrições abertas": "yellow",
      "Realizado": "green",
      "Programado": "navy",
    };
    const tone = map[status] || "gray";
    return `<span class="pill pill-${tone}">${esc(status)}</span>`;
  }

  // Tons fixos para avatares de iniciais — paleta própria, nunca reaproveita
  // SERIES_PALETTE (séries de gráfico) nem STATUS (semântica de estado).
  const AVATAR_TONES = ["navy", "gold", "aqua", "coral", "violet", "green"];

  function hashCode(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return h;
  }

  // Avatar de iniciais coloridas — usado quando não há logo real de parceiro.
  // O tom é escolhido de forma determinística a partir do nome (mesmo parceiro
  // sempre com a mesma cor), não aleatório.
  function avatarInitials(nome, tone) {
    const parts = (nome || "").trim().split(/\s+/).filter(Boolean);
    const initials = parts.length >= 2 ? parts[0][0] + parts[1][0] : (parts[0] || "?").slice(0, 2);
    const chosenTone = tone || AVATAR_TONES[Math.abs(hashCode(nome || "")) % AVATAR_TONES.length];
    return `<span class="avatar-initials avatar-tone-${chosenTone}">${esc(initials.toUpperCase())}</span>`;
  }

  // Cartão de parceiro clicável (tela de Parcerias) — expande/recolhe as
  // contrapartidas via toggle de classe (sem biblioteca de modal).
  function partnerCard({ id, nome, sigla, valorLabel, itens, status, detailHtml }) {
    return `
      <div class="partner-card" data-partner-id="${esc(id)}">
        <button class="partner-card-head" type="button" aria-expanded="false">
          ${avatarInitials(sigla || nome)}
          <div class="partner-card-info">
            <div class="partner-card-name">${esc(nome)}</div>
            <div class="partner-card-meta">${fmt.num(itens)} ite${itens === 1 ? "m" : "ns"} de apoio · ${esc(valorLabel)}</div>
          </div>
          ${status ? statusPill(status) : ""}
          <span class="partner-card-toggle">▾</span>
        </button>
        <div class="partner-card-detail" hidden>${detailHtml || ""}</div>
      </div>`;
  }

  // Coluna do Kanban de startups por ciclo — somente leitura, sem drag-and-drop.
  function kanbanColumn({ nome, cor, cards }) {
    const cardsHtml = (cards || [])
      .map(
        (c) => `
      <div class="kanban-card">
        <div class="kanban-card-name">${esc(c.nome)}</div>
        ${c.descricao ? `<div class="kanban-card-desc">${esc(c.descricao)}</div>` : ""}
        <div class="kanban-card-foot">
          ${c.responsavel ? `<span>👤 ${esc(c.responsavel)}</span>` : ""}
          ${c.data ? `<span>${esc(c.data)}</span>` : ""}
        </div>
      </div>`
      )
      .join("");
    return `
      <div class="kanban-column">
        <div class="kanban-column-head">
          <span class="kanban-dot" style="background:${esc(cor)}"></span>
          <span class="kanban-column-name">${esc(nome)}</span>
          <span class="kanban-column-count">${fmt.num((cards || []).length)}</span>
        </div>
        <div class="kanban-column-body">${cardsHtml || '<div class="kanban-empty">Sem startups nesta fase</div>'}</div>
      </div>`;
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

  window.UI = {
    esc,
    kpiCard,
    sectionCard,
    chartBox,
    progressBar,
    statusPill,
    dataTable,
    axisTile,
    sparkline,
    miniBar,
    avatarInitials,
    partnerCard,
    kanbanColumn,
  };
})();
