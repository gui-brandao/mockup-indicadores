// Tela 8 — Parcerias: valor econômico das contrapartidas e quanto o Parque
// devolve para a sociedade de Santo André. Fonte única também da tela
// "Monitoramento de Uso" (data/parcerias.js).
(function () {
  const T = APP_THEME;

  function computeTotals(P) {
    let declarado = 0,
      utilizado = 0,
      itens = 0;
    P.parceiros.forEach((p) =>
      p.contrapartidas.forEach((c) => {
        declarado += c.valorEconomico;
        utilizado += (c.quantidadeUtilizada / c.quantidadePrevista) * c.valorEconomico;
        itens++;
      })
    );
    return { declarado, utilizado: Math.round(utilizado), saldo: declarado - Math.round(utilizado), itens };
  }

  function render() {
    const P = APP_DATA.parcerias;
    const totals = computeTotals(P);
    const formalizados = P.parceiros.filter((p) => p.statusFormalizacao === "Ativa").length;

    const kpis =
      UI.kpiCard({
        label: "Valor total declarado",
        value: fmt.currency(totals.declarado),
        sub: `${fmt.num(P.parceiros.length)} parceiros · ${fmt.num(totals.itens)} itens de apoio`,
        hero: true,
        spark: PERIOD.slice(P.valorUtilizadoMensal),
      }) +
      UI.kpiCard({ label: "Parceiros formalizados", value: fmt.num(formalizados), sub: `de ${fmt.num(P.parceiros.length)} mapeados` }) +
      UI.kpiCard({ label: "Valor utilizado", value: fmt.currency(totals.utilizado), sub: "consumido até o momento", spark: PERIOD.slice(P.valorUtilizadoMensal) }) +
      UI.kpiCard({ label: "Saldo disponível", value: fmt.currency(totals.saldo), sub: "declarado menos utilizado" });

    const cards = P.parceiros
      .map((p) => {
        const valorParceiro = p.contrapartidas.reduce((s, c) => s + c.valorEconomico, 0);
        const detailHtml = p.contrapartidas
          .map((c) => {
            const pct = fmt.num1(fmt.clamp((c.quantidadeUtilizada / c.quantidadePrevista) * 100, 0, 100));
            return `
          <div class="partner-detail-row">
            <div>
              <div class="name">${UI.esc(c.categoria)}</div>
              <div class="meta">${UI.esc(c.descricao)} · ${fmt.num(c.quantidadeUtilizada)}/${fmt.num(c.quantidadePrevista)} ${UI.esc(c.unidade)} (${pct}%)</div>
            </div>
            <div class="value">${fmt.currency(c.valorEconomico)}</div>
          </div>`;
          })
          .join("");
        return UI.partnerCard({
          id: p.id,
          nome: p.nome,
          sigla: p.sigla,
          valorLabel: fmt.currency(valorParceiro),
          itens: p.contrapartidas.length,
          status: p.statusFormalizacao,
          detailHtml,
        });
      })
      .join("");

    return `
      <div class="grid kpi-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${kpis}</div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Carteira de parcerias",
          title: "Parceiros e contrapartidas",
          desc: "Clique em um parceiro para ver o detalhe das contrapartidas oferecidas.",
          bodyHtml: `<div class="grid grid-2">${cards}</div>`,
        })}
        ${UI.sectionCard({
          eyebrow: "Composição declarada",
          title: "Valor por categoria de contrapartida",
          bodyHtml: UI.chartBox("chart-prc-categoria", 320),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "Evolução no ano",
        title: "Valor econômico utilizado, acumulado",
        desc: "Soma do valor das contrapartidas efetivamente consumidas, mês a mês.",
        bodyHtml: UI.chartBox("chart-prc-evolucao", 260),
      })}
    `;
  }

  function mount({ registerChart }) {
    const P = APP_DATA.parcerias;

    // Accordion dos cartões de parceiro — um único listener delegado.
    const grid = document.querySelector(".partner-card")?.closest(".grid-2");
    if (grid) {
      grid.addEventListener("click", (e) => {
        const head = e.target.closest(".partner-card-head");
        if (!head) return;
        const card = head.closest(".partner-card");
        const detail = card.querySelector(".partner-card-detail");
        const expanded = head.getAttribute("aria-expanded") === "true";
        head.setAttribute("aria-expanded", String(!expanded));
        detail.hidden = expanded;
      });
    }

    const porCategoria = {};
    P.parceiros.forEach((p) =>
      p.contrapartidas.forEach((c) => {
        porCategoria[c.categoria] = (porCategoria[c.categoria] || 0) + c.valorEconomico;
      })
    );

    const chartCategoria = registerChart(echarts.init(document.getElementById("chart-prc-categoria")));
    chartCategoria.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.currency(p.value)}</b> (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center", type: "scroll" }),
      series: [
        {
          type: "pie",
          radius: ["46%", "70%"],
          center: ["50%", "42%"],
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11.5, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: Object.entries(porCategoria).map(([name, value]) => ({ name, value })),
        },
      ],
    });

    const chartEvolucao = registerChart(echarts.init(document.getElementById("chart-prc-evolucao")));
    chartEvolucao.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ formatter: (p) => `${p[0].axisValueLabel}<br/><b>${fmt.currency(p[0].value)}</b>` }),
      grid: T.baseGrid({ top: 12 }),
      xAxis: T.categoryAxis(P.monthLabels),
      yAxis: T.valueAxis({ axisLabel: { ...T.axisText(), formatter: (v) => fmt.currencyCompact(v) } }),
      series: [
        {
          type: "line",
          data: P.valorUtilizadoMensal,
          smooth: 0.3,
          symbol: "circle",
          symbolSize: 7,
          lineStyle: { width: 2.5, color: T.SERIES_PALETTE[0] },
          areaStyle: { color: "rgba(47,122,184,0.16)" },
        },
      ],
    });
  }

  window.VIEW_PARCERIAS = {
    title: "Parcerias",
    subtitle: "Valor econômico das contrapartidas — captação e retorno para a sociedade",
    render,
    mount,
  };
})();
