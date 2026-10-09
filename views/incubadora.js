// Tela 2 — Incubadora & Jornada: metodologia (fases e ciclos) e carteira de
// startups. Também é a única tela do painel da equipe (equipe.html).
(function () {
  const T = APP_THEME;

  // "2026-09-10" → "10/09/2026" sem passar por Date (que converteria de UTC e
  // mostraria o dia anterior no fuso de Brasília).
  function dataBr(iso) {
    const [a, m, d] = String(iso || "").split("-");
    return d ? `${d}/${m}/${a}` : "";
  }

  // Nada de número escrito à mão aqui: contagens, datas e meses vêm de
  // APP_DATA.incubadora (planilha ou mock) e do período selecionado.
  function render() {
    const I = APP_DATA.incubadora;
    const soma = (arr) => arr.reduce((s, v) => s + v, 0);
    const mesFim = PERIOD.slice(I.monthLabels).slice(-1)[0] || "";
    const ultimoCiclo = I.ciclos.length ? I.ciclos[I.ciclos.length - 1].nome : "";
    const aulasPlanejadas = soma(I.aulasColetivas.map((a) => a.total));
    const totalAcoes = I.totalAcoes ?? soma(I.fases.map((f) => f.individual + f.coletivo)) + I.acoesTransversais;
    const diagnosticadas = I.kpis.startupsDiagnosticadas ?? I.kpis.startupsAtivas;
    const plano = I.planoTrabalho;
    const fomentoPeriodo = PERIOD.delta(I.fomentoCaptadoMensal);
    const empregosPeriodo = PERIOD.delta(I.empregosGeradosMensal);
    const familiasPeriodo = PERIOD.delta(I.familiasAtingidasMensal);

    const kpis =
      UI.kpiCard({
        label: "Startups ativas",
        value: fmt.num(PERIOD.last(I.serieMensal.startupsAtivas)),
        sub: `no fim de ${mesFim.toLowerCase()} · hoje ${fmt.num(I.kpis.startupsAtivas)} (${dataBr(I.dataReferencia)})`,
        hero: true,
        spark: PERIOD.slice(I.serieMensal.startupsAtivas),
      }) +
      UI.kpiCard({
        label: "Mentorias realizadas",
        value: fmt.num(PERIOD.sum(I.serieMensal.mentorias)),
        sub: "atendimentos individuais no período",
        spark: PERIOD.slice(I.serieMensal.mentorias),
      }) +
      UI.kpiCard({
        label: "Aulas coletivas ministradas",
        value: fmt.num(PERIOD.sum(I.serieMensal.aulas)),
        sub: `no período · ${fmt.num(aulasPlanejadas)} planejadas na metodologia`,
        spark: PERIOD.slice(I.serieMensal.aulas),
      }) +
      UI.kpiCard({
        label: "Entregas do plano concluídas",
        value: fmt.num(plano.concluida),
        sub: `de ${fmt.num(plano.concluida + plano.emExecucao + plano.naoIniciada)} com status definido`,
      }) +
      UI.kpiCard({
        label: "Graduandas previstas",
        value: fmt.num(I.kpis.graduandasPrevistas),
        sub: `startups ativas no ciclo ${ultimoCiclo}`,
      });

    const impactoKpis =
      UI.kpiCard({
        label: "Fomento captado no período",
        value: fmt.currency(fomentoPeriodo),
        sub: `${fmt.currency(PERIOD.last(I.fomentoCaptadoMensal))} acumulado em ${I.periodo.ano} até ${mesFim.toLowerCase()}`,
        hero: true,
        spark: PERIOD.slice(I.fomentoCaptadoMensal),
      }) +
      UI.kpiCard({
        label: "Empregos gerados no período",
        value: fmt.num(empregosPeriodo),
        sub: `≈ ${fmt.num(familiasPeriodo)} famílias atingidas · ${fmt.num(PERIOD.last(I.empregosGeradosMensal))} em ${I.periodo.ano} até ${mesFim.toLowerCase()}`,
        spark: PERIOD.slice(I.empregosGeradosMensal),
      });

    const kanban = I.ciclos
      .map((c) =>
        UI.kanbanColumn({
          nome: c.nome,
          cor: T.COLORS.navy500,
          cards: I.startups
            .filter((s) => s.cicloAtual === c.nome)
            .map((s) => ({
              nome: s.nome,
              descricao: `${s.setor} · ${fmt.currency(s.fomentoCaptado)} captado`,
              responsavel: s.responsavel,
              data: dataBr(s.dataEntrada),
            })),
        })
      )
      .join("");

    const trilho = I.ciclos
      .map(
        (c, idx) => `
      <div class="axis-tile" style="text-align:center" title="${UI.esc(c.nome)}">
        <div class="pill pill-navy" style="margin-bottom:6px">Ciclo ${idx + 1}</div>
        <div class="axis-name" style="font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${UI.esc(c.nome)}</div>
        <div class="axis-value" style="font-size:20px">${fmt.num(c.empresas)}</div>
        <div class="axis-sub">${UI.esc(c.semanas)}</div>
      </div>`
      )
      .join("");

    const entregasRows = I.ciclos.map((c) => [UI.esc(c.nome), UI.esc(c.semanas), UI.esc(c.entrega), `<span class="td-strong">${fmt.num(c.empresas)}</span>`]);

    const aulasRows = I.aulasColetivas.map((a) => [UI.esc(a.fase), `${a.prontas}/${a.total}`, UI.miniBar(a.prontas, a.total)]);
    const semanasJornada = Math.max(0, ...I.ciclos.map((c) => Number((String(c.semanas).match(/\d+/g) || [0]).slice(-1)[0])));
    const nCiclos = I.ciclos.length;
    const primeiraFase = I.fases[0] ? I.fases[0].nome : "";
    const ultimaFase = I.fases.length ? I.fases[I.fases.length - 1].nome : "";

    return `
      <div class="grid kpi-grid">${kpis}</div>

      <div class="grid grid-2">${impactoKpis}</div>

      ${UI.sectionCard({
        eyebrow: `Metodologia · ${fmt.num(semanasJornada)} semanas`,
        title: `Jornada da incubação — ${fmt.num(nCiclos)} ciclos`,
        desc: "Da entrada por edital até a graduação, com número de empresas ativas em cada etapa.",
        bodyHtml: `<div class="grid" style="grid-template-columns:repeat(${nCiclos},minmax(0,1fr));gap:10px">${trilho}</div>`,
      })}

      ${UI.sectionCard({
        eyebrow: `${fmt.num(I.kpis.startupsAtivas)} startups ativas · situação em ${dataBr(I.dataReferencia)}`,
        title: "Kanban da jornada — startup a startup",
        desc: "Cada cartão é uma startup ativa: setor, fomento captado e responsável, agrupados pelo ciclo atual.",
        bodyHtml: `<div class="kanban-board">${kanban}</div>`,
      })}

      ${UI.sectionCard({
        eyebrow: "Captação por segmento",
        title: "Fomento captado por setor",
        desc: "Soma do fomento já captado pelas startups ativas, agrupado por setor de atuação.",
        bodyHtml: UI.chartBox("chart-inc-fomento-setor", 280),
      })}

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: `${fmt.num(totalAcoes)} ações mapeadas`,
          title: "Ações por fase — Individual × Coletivo",
          desc: `${primeiraFase} → ${ultimaFase}, consultoria semana a semana.`,
          bodyHtml: UI.chartBox("chart-inc-fases", 300),
        })}
        ${UI.sectionCard({
          eyebrow: "Material didático",
          title: "Aulas coletivas por fase",
          desc: "% de aulas com material pronto, por fase da jornada.",
          bodyHtml: UI.dataTable({ columns: ["Fase", "Prontas", "Progresso"], rows: aulasRows }),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Distribuição por etapa",
          title: `Empresas ativas nos ${fmt.num(nCiclos)} ciclos`,
          desc: "Da entrada à graduação — ciclos mais longos concentram mais empresas simultâneas, não é atrito de uma única turma.",
          bodyHtml: UI.chartBox("chart-inc-funil", 320),
        })}
        ${UI.sectionCard({
          eyebrow: "Carteira atual",
          title: "Setores das startups ativas",
          bodyHtml: UI.chartBox("chart-inc-setores", 320),
        })}
      </div>

      <div class="grid grid-main-side">
        ${UI.sectionCard({
          eyebrow: "Cadência de apoio",
          title: "Mentorias e aulas coletivas por mês",
          desc: "Mentorias individuais e aulas coletivas ministradas em cada mês do período.",
          bodyHtml: UI.chartBox("chart-inc-cadencia", 280),
        })}
        ${UI.sectionCard({
          eyebrow: "Diagnóstico multidimensional",
          title: "Maturidade média das startups",
          desc: `Diagnóstico mais recente de ${fmt.num(diagnosticadas)} startups ativas, por dimensão (0 a 100).`,
          bodyHtml: UI.chartBox("chart-inc-maturidade", 280),
        })}
      </div>

      ${UI.sectionCard({
        eyebrow: "Cronograma da incubadora",
        title: "Entregas-chave por ciclo",
        bodyHtml: UI.dataTable({
          columns: ["Ciclo", "Semanas", "Entrega principal", "Empresas"],
          rows: entregasRows,
          numericCols: [3],
        }),
      })}
    `;
  }

  function mount({ registerChart }) {
    const I = APP_DATA.incubadora;

    const chart = registerChart(echarts.init(document.getElementById("chart-inc-fases")));
    chart.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[3]],
      tooltip: T.tooltipDefaults({
        formatter: (params) => {
          const fase = I.fases[params[0].dataIndex];
          const rows = params.map((p) => `${p.marker} ${p.seriesName}: <b>${p.value}</b>`).join("<br/>");
          return `<b>${fase.nome}</b> · ${fase.estagio}<br/>${rows}`;
        },
      }),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(I.fases.map((f) => f.id), { axisLabel: { ...T.axisText(), interval: 0, fontWeight: 700 } }),
      yAxis: T.valueAxis(),
      series: [
        { name: "Individual", type: "bar", stack: "total", data: I.fases.map((f) => f.individual), barMaxWidth: 40, itemStyle: T.stackedItemStyle() },
        {
          name: "Coletivo",
          type: "bar",
          stack: "total",
          data: I.fases.map((f) => f.coletivo),
          barMaxWidth: 40,
          itemStyle: Object.assign({ borderRadius: T.barRadius() }, T.stackedItemStyle()),
        },
      ],
    });

    // Empresas por ciclo — barras na ordem da jornada (não um funil: os valores
    // não são monotônicos, já que ciclos mais longos acumulam várias turmas
    // simultâneas; um funil aqui sugeriria atrito que não existe nos dados).
    const ciclosOrd = [...I.ciclos].reverse();
    const chartFunil = registerChart(echarts.init(document.getElementById("chart-inc-funil")));
    chartFunil.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> empresa(s)` }),
      grid: T.baseGrid({ top: 10, right: 24 }),
      xAxis: T.valueAxis(),
      yAxis: T.categoryAxis(ciclosOrd.map((c) => c.nome), { axisLabel: { ...T.axisText(), interval: 0 } }),
      series: [
        {
          type: "bar",
          data: ciclosOrd.map((c) => c.empresas),
          barMaxWidth: 20,
          itemStyle: { borderRadius: T.barRadius("horizontal") },
          label: { show: true, position: "right", formatter: (p) => fmt.num(p.value), color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
        },
      ],
    });

    // Rosca de setores — legenda sempre presente (>=2 séries), rótulo direto.
    const chartSetores = registerChart(echarts.init(document.getElementById("chart-inc-setores")));
    chartSetores.setOption({
      color: T.SERIES_PALETTE,
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.num(p.value)}</b> startups (${p.percent}%)` }),
      legend: T.legendDefaults({ top: "auto", bottom: 0, left: "center", type: "scroll" }),
      series: [
        {
          type: "pie",
          radius: ["46%", "70%"],
          center: ["50%", "42%"],
          itemStyle: { borderColor: T.COLORS.surface, borderWidth: 2 },
          label: { formatter: "{d}%", color: "#fff", fontSize: 11.5, fontWeight: 700, position: "inside" },
          labelLine: { show: false },
          data: I.setores.map((s) => ({ name: s.setor, value: s.valor })),
        },
      ],
    });

    // Fomento captado por setor — soma direta de startups[], mesmo padrão de
    // agregação estática já usado na rosca de setores acima.
    const fomentoPorSetor = {};
    I.startups.forEach((s) => (fomentoPorSetor[s.setor] = (fomentoPorSetor[s.setor] || 0) + s.fomentoCaptado));
    const setoresOrd = Object.entries(fomentoPorSetor).sort((a, b) => a[1] - b[1]);
    const chartFomentoSetor = registerChart(echarts.init(document.getElementById("chart-inc-fomento-setor")));
    chartFomentoSetor.setOption({
      color: [T.SERIES_PALETTE[3]],
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${p.name}<br/><b>${fmt.currency(p.value)}</b>` }),
      grid: T.baseGrid({ top: 10, right: 24 }),
      xAxis: T.valueAxis({ axisLabel: { ...T.axisText(), formatter: (v) => fmt.currencyCompact(v) } }),
      yAxis: T.categoryAxis(setoresOrd.map(([nome]) => nome), { axisLabel: { ...T.axisText(), interval: 0 } }),
      series: [
        {
          type: "bar",
          data: setoresOrd.map(([, valor]) => valor),
          barMaxWidth: 20,
          itemStyle: { borderRadius: T.barRadius("horizontal"), color: T.SERIES_PALETTE[3] },
        },
      ],
    });

    // Mentorias × aulas por mês — mesmo eixo de valor (nunca eixo duplo);
    // barras agrupadas comparam as duas cadências lado a lado, com clareza.
    const chartCadencia = registerChart(echarts.init(document.getElementById("chart-inc-cadencia")));
    chartCadencia.setOption({
      color: [T.SERIES_PALETTE[0], T.SERIES_PALETTE[3]],
      tooltip: T.tooltipDefaults(),
      legend: T.legendDefaults(),
      grid: T.baseGrid({ top: 40 }),
      xAxis: T.categoryAxis(PERIOD.slice(I.monthLabels)),
      yAxis: T.valueAxis(),
      series: [
        { name: "Mentorias individuais", type: "bar", data: PERIOD.slice(I.serieMensal.mentorias), barMaxWidth: 16, itemStyle: { borderRadius: T.barRadius() } },
        { name: "Aulas coletivas", type: "bar", data: PERIOD.slice(I.serieMensal.aulas), barMaxWidth: 16, itemStyle: { borderRadius: T.barRadius() } },
      ],
    });

    // Radar de maturidade — polígono único, rótulo direto nos vértices.
    const chartMaturidade = registerChart(echarts.init(document.getElementById("chart-inc-maturidade")));
    chartMaturidade.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item" }),
      radar: T.radarBase(I.maturidade.map((m) => ({ name: m.dimensao, max: 100 }))),
      series: [
        {
          type: "radar",
          data: [
            {
              value: I.maturidade.map((m) => m.valor),
              name: "Média das startups",
              areaStyle: { color: "rgba(47,122,184,0.22)" },
              lineStyle: { width: 2 },
              symbolSize: 7,
              label: { show: true, formatter: (p) => p.value, color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
            },
          ],
        },
      ],
    });
  }

  window.VIEW_INCUBADORA = {
    title: "Incubadora & Jornada",
    subtitle: "Metodologia de incubação replicável — da entrada à graduação",
    render,
    mount,
  };
})();
