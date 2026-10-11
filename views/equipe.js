// Telas do painel da equipe (equipe.html): "Início" (startups + próximas
// mentorias) e "Mentorias" (cronograma completo). Leem só APP_DATA.incubadora
// — vindo da planilha (api/incubadora.js) ou do mock — e nada aqui é número
// escrito à mão: contagens, datas e limites vêm dos dados.
//
// Filtros, busca e mês do calendário são estado de tela (ficam neste módulo e
// redesenham só a parte afetada); o período do topo continua valendo para os
// números "no período".
(function () {
  const T = APP_THEME;

  // ------------------------------------------------------------ utilidades

  function hojeDe(I) {
    return I.dataReferencia;
  }

  function cicloIndex(I) {
    return Object.fromEntries(I.ciclos.map((c, i) => [c.nome, i]));
  }

  // "Hoje" / "Amanhã" / "qua, 14/out"
  function rotuloDia(iso, hoje) {
    const d = fmt.diasEntre(hoje, iso);
    if (d === 0) return "Hoje";
    if (d === 1) return "Amanhã";
    if (d === -1) return "Ontem";
    return fmt.dataCurta(iso);
  }

  function pillMentoria(m) {
    if (m.aConfirmar) return '<span class="pill pill-yellow">! A confirmar</span>';
    if (m.status === "Realizada") return '<span class="pill pill-green">✓ Realizada</span>';
    if (m.status === "Cancelada") return '<span class="pill pill-gray">✕ Cancelada</span>';
    return '<span class="pill pill-navy">◷ Agendada</span>';
  }

  function classeMentoria(m) {
    if (m.aConfirmar) return "is-confirmar";
    return { Realizada: "is-realizada", Cancelada: "is-cancelada" }[m.status] || "is-agendada";
  }

  // Mentorias realizadas dentro do período do seletor (mesmo recorte de PERIOD).
  function realizadasNoPeriodo(I) {
    const { from, to } = PERIOD.range();
    return (I.mentorias || []).filter((m) => {
      if (m.status !== "Realizada" || Number(m.data.slice(0, 4)) !== I.periodo.ano) return false;
      const mes = Number(m.data.slice(5, 7)) - 1;
      return mes >= from && mes <= to;
    });
  }

  function proximasAgendadas(I) {
    const hoje = hojeDe(I);
    return (I.mentorias || []).filter((m) => m.status === "Agendada" && !m.aConfirmar && m.data >= hoje);
  }

  function aConfirmar(I) {
    return (I.mentorias || []).filter((m) => m.aConfirmar);
  }

  function opcoes(valores, selecionado, rotuloTodos) {
    return (
      `<option value="">${UI.esc(rotuloTodos)}</option>` +
      valores.map((v) => `<option value="${UI.esc(v)}" ${v === selecionado ? "selected" : ""}>${UI.esc(v)}</option>`).join("")
    );
  }

  function unicos(lista) {
    return [...new Set(lista.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  // Item de agenda (usado no Início e no cronograma).
  function itemAgenda(m, { mostrarData, ocultarAgendada } = {}) {
    const pill = ocultarAgendada && m.status === "Agendada" && !m.aConfirmar ? "" : pillMentoria(m);
    return `
      <div class="agenda-item ${classeMentoria(m)}">
        <div class="agenda-hora">${m.hora ? UI.esc(m.hora) : "—"}${mostrarData ? `<span>${UI.esc(fmt.dataCurta(m.data))}</span>` : ""}</div>
        <div class="agenda-info">
          <div class="agenda-startup">${UI.esc(m.startup)}</div>
          <div class="agenda-tema">${UI.esc(m.tema || "Mentoria")}</div>
          <div class="agenda-meta">
            ${m.consultor ? `<span>👤 ${UI.esc(m.consultor)}</span>` : ""}
            ${m.formato ? `<span>${m.formato === "Online" ? "💻" : "📍"} ${UI.esc(m.formato)}</span>` : ""}
            ${m.horas ? `<span>⏱ ${fmt.num1(m.horas)} h</span>` : ""}
          </div>
        </div>
        ${pill ? `<div class="agenda-status">${pill}</div>` : ""}
      </div>`;
  }

  // Lista agrupada por dia ("Hoje", "Amanhã", "qua, 14/out").
  function agendaPorDia(itens, hoje, opcoesItem) {
    const grupos = [];
    itens.forEach((m) => {
      const g = grupos[grupos.length - 1];
      if (g && g.data === m.data) g.itens.push(m);
      else grupos.push({ data: m.data, itens: [m] });
    });
    return grupos
      .map(
        (g) => `
        <div class="agenda-dia">
          <div class="agenda-dia-titulo ${g.data === hoje ? "is-hoje" : ""}">${UI.esc(rotuloDia(g.data, hoje))}
            <span>${UI.esc(fmt.dataBr(g.data))}</span></div>
          ${g.itens.map((m) => itemAgenda(m, opcoesItem)).join("")}
        </div>`
      )
      .join("");
  }

  // ------------------------------------------------------------ cartão de startup

  function trilhoJornada(I, s) {
    const idx = cicloIndex(I)[s.cicloAtual];
    const n = I.ciclos.length;
    const segs = I.ciclos.map((c, i) => `<span class="${idx !== undefined && i <= idx ? "is-on" : ""}" title="${UI.esc(c.nome)}"></span>`).join("");
    const rotulo = idx === undefined ? UI.esc(s.cicloAtual || "Ciclo não informado") : `Ciclo ${idx + 1} de ${n} · ${UI.esc(s.cicloAtual)}`;
    return `<div class="jornada" role="img" aria-label="${rotulo}"><div class="jornada-segs">${segs}</div><div class="jornada-rotulo">${rotulo}</div></div>`;
  }

  function startupCard(I, s, aberto) {
    const hoje = hojeDe(I);
    const alerta = I.parametros.alertaDiasSemMentoria;
    const ultima = s.ultimaMentoria
      ? `${fmt.haDias(fmt.diasEntre(s.ultimaMentoria, hoje))} <span class="muted">· ${UI.esc(fmt.dataBr(s.ultimaMentoria).slice(0, 5))}</span>`
      : '<span class="muted">nenhuma ainda</span>';
    const proxima = s.proximaMentoria
      ? `${UI.esc(rotuloDia(s.proximaMentoria.data, hoje))}${s.proximaMentoria.hora ? ` · ${UI.esc(s.proximaMentoria.hora)}` : ""}`
      : '<span class="muted">nada agendado</span>';
    const historico = (I.mentorias || [])
      .filter((m) => m.startupId === s.id && m.status === "Realizada")
      .slice(-3)
      .reverse();
    const semanas = Math.max(0, Math.floor(fmt.diasEntre(s.dataEntrada, hoje) / 7));

    return `
      <article class="startup-card ${s.precisaAtencao ? "is-atencao" : ""} ${aberto ? "is-open" : ""}" data-startup="${UI.esc(s.id)}">
        <button class="startup-card-head" type="button" aria-expanded="${aberto ? "true" : "false"}">
          ${UI.avatarInitials(s.nome)}
          <div class="startup-card-id">
            <div class="startup-card-nome">${UI.esc(s.nome)}</div>
            <div class="startup-card-setor">${UI.esc(s.setor)}</div>
          </div>
          <span class="startup-card-toggle" aria-hidden="true">▾</span>
        </button>
        ${trilhoJornada(I, s)}
        <dl class="startup-card-fatos">
          <div><dt>Última mentoria</dt><dd>${ultima}</dd></div>
          <div><dt>Próxima</dt><dd>${proxima}</dd></div>
        </dl>
        <div class="startup-card-rodape">
          <span>👤 ${s.responsavel ? UI.esc(s.responsavel) : '<span class="muted">sem responsável</span>'}</span>
          <span title="Maturidade (média do último diagnóstico, 0 a 100)">${s.maturidade === null || s.maturidade === undefined ? '<span class="muted">sem diagnóstico</span>' : `🧭 ${fmt.num(s.maturidade)}<span class="muted">/100</span>`}</span>
        </div>
        ${
          s.precisaAtencao
            ? `<div class="startup-card-alerta" title="Mais de ${fmt.num(alerta)} dias sem mentoria e nada agendado">⚠ ${s.ultimaMentoria ? `Sem mentoria ${UI.esc(fmt.haDias(s.diasSemMentoria))}` : `Sem mentoria desde a entrada (${fmt.num(s.diasSemMentoria)} dias)`}</div>`
            : ""
        }
        <div class="startup-card-detalhe" ${aberto ? "" : "hidden"}>
          ${s.descricaoAtual ? `<p>${UI.esc(s.descricaoAtual)}</p>` : ""}
          <div class="startup-card-numeros">
            <span><strong>${fmt.currency(s.fomentoCaptado)}</strong> captados</span>
            <span><strong>${fmt.num(s.empregosGerados)}</strong> empregos</span>
            <span><strong>${fmt.num(s.mentoriasRealizadas)}</strong> mentorias</span>
            <span>na incubadora há <strong>${fmt.num(semanas)}</strong> semanas (desde ${UI.esc(fmt.dataBr(s.dataEntrada))})</span>
          </div>
          ${
            s.proximaMentoria
              ? `<div class="startup-card-sub">Próxima mentoria</div><div class="mini-lista"><div>${UI.esc(fmt.dataBr(s.proximaMentoria.data))}${s.proximaMentoria.hora ? ` · ${UI.esc(s.proximaMentoria.hora)}` : ""} — ${UI.esc(s.proximaMentoria.tema || "Mentoria")}${s.proximaMentoria.consultor ? ` · ${UI.esc(s.proximaMentoria.consultor)}` : ""}</div></div>`
              : ""
          }
          <div class="startup-card-sub">Últimas mentorias</div>
          <div class="mini-lista">${
            historico.length
              ? historico.map((m) => `<div>${UI.esc(fmt.dataBr(m.data))} — ${UI.esc(m.tema || "Mentoria")}${m.consultor ? ` · ${UI.esc(m.consultor)}` : ""}</div>`).join("")
              : '<div class="muted">Nenhuma mentoria registrada.</div>'
          }</div>
          ${s.dataDiagnostico ? `<div class="startup-card-sub">Último diagnóstico em ${UI.esc(fmt.dataBr(s.dataDiagnostico))}</div>` : ""}
        </div>
      </article>`;
  }

  // ------------------------------------------------------------ Início

  const filtros = { busca: "", ciclo: "", responsavel: "", atencao: false, agrupar: false };
  const abertos = new Set();

  function startupsFiltradas(I) {
    const idx = cicloIndex(I);
    const busca = filtros.busca.trim().toLocaleLowerCase("pt-BR");
    return I.startups
      .filter((s) => !busca || `${s.nome} ${s.setor} ${s.responsavel}`.toLocaleLowerCase("pt-BR").includes(busca))
      .filter((s) => !filtros.ciclo || s.cicloAtual === filtros.ciclo)
      .filter((s) => !filtros.responsavel || s.responsavel === filtros.responsavel)
      .filter((s) => !filtros.atencao || s.precisaAtencao)
      .sort((a, b) => (b.precisaAtencao - a.precisaAtencao) || ((idx[a.cicloAtual] ?? 99) - (idx[b.cicloAtual] ?? 99)) || a.nome.localeCompare(b.nome, "pt-BR"));
  }

  function listaStartupsHtml(I) {
    const lista = startupsFiltradas(I);
    const contador = `<div class="lista-contador">Mostrando <strong>${fmt.num(lista.length)}</strong> de ${fmt.num(I.startups.length)} startups ativas</div>`;
    if (!lista.length) return contador + '<div class="vazio">Nenhuma startup com esses filtros.</div>';
    if (!filtros.agrupar) return contador + `<div class="startup-grid">${lista.map((s) => startupCard(I, s, abertos.has(s.id))).join("")}</div>`;
    return (
      contador +
      I.ciclos
        .map((c, i) => {
          const doCiclo = lista.filter((s) => s.cicloAtual === c.nome);
          if (!doCiclo.length) return "";
          return `
          <section class="grupo-ciclo">
            <h3><span class="pill pill-navy">Ciclo ${fmt.num(i + 1)}</span> ${UI.esc(c.nome)} <span class="muted">· ${UI.esc(c.semanas)} · ${fmt.num(doCiclo.length)}</span></h3>
            <div class="startup-grid">${doCiclo.map((s) => startupCard(I, s, abertos.has(s.id))).join("")}</div>
          </section>`;
        })
        .join("")
    );
  }

  function renderInicio() {
    const I = APP_DATA.incubadora;
    const hoje = hojeDe(I);
    const proximas = proximasAgendadas(I);
    const semana = proximas.filter((m) => fmt.diasEntre(hoje, m.data) <= 6);
    // Agenda curta: os próximos 7 dias (ou, se a semana estiver vazia, as 3 próximas).
    const naAgenda = (semana.length ? semana : proximas.slice(0, 3)).slice(0, 8);
    const pendentes = aConfirmar(I);
    const alerta = I.parametros.alertaDiasSemMentoria;

    const kpis =
      UI.kpiCard({
        label: "Startups ativas",
        value: fmt.num(I.kpis.startupsAtivas),
        sub: `em ${fmt.num(I.ciclos.filter((c) => c.empresas > 0).length)} ciclos da jornada · situação em ${fmt.dataBr(hoje)}`,
        hero: true,
      }) +
      UI.kpiCard({
        label: "Mentorias realizadas",
        value: fmt.num(PERIOD.sum(I.serieMensal.mentorias)),
        sub: `${PERIOD.PRESETS[PERIOD.key()].label}`,
        spark: PERIOD.slice(I.serieMensal.mentorias),
      }) +
      UI.kpiCard({
        label: "Mentorias agendadas",
        value: fmt.num(I.kpis.mentoriasAgendadas),
        sub: `${fmt.num(semana.length)} nos próximos 7 dias${pendentes.length ? ` · ${fmt.num(pendentes.length)} a confirmar` : ""}`,
      }) +
      UI.kpiCard({
        label: "Precisam de atenção",
        value: `${I.kpis.startupsPrecisandoAtencao ? "⚠ " : "✓ "}${fmt.num(I.kpis.startupsPrecisandoAtencao)}`,
        sub: `sem mentoria há mais de ${fmt.num(alerta)} dias e nada agendado`,
        id: "kpi-atencao",
      });

    const ciclos = I.ciclos.map((c) => c.nome);
    const responsaveis = unicos(I.startups.map((s) => s.responsavel));

    const agenda = `
      ${
        pendentes.length
          ? `<div class="agenda-alerta"><strong>${fmt.num(pendentes.length)} mentoria(s) a confirmar</strong> — a data já passou e ainda estão como Agendada. Na planilha, troque o status para Realizada ou Cancelada.
             <div class="agenda-lista">${pendentes.map((m) => itemAgenda(m, { mostrarData: true })).join("")}</div></div>`
          : ""
      }
      <div class="agenda-lista">${
        proximas.length
          ? agendaPorDia(naAgenda, hoje, { ocultarAgendada: true })
          : `<div class="vazio">Nenhuma mentoria agendada a partir de hoje.<br/>Para agendar, inclua uma linha na aba <strong>Mentorias</strong> com status <strong>Agendada</strong> (veja "Como usar").</div>`
      }</div>
      ${proximas.length > naAgenda.length ? `<div class="lista-contador">+ ${fmt.num(proximas.length - naAgenda.length)} agendada(s) depois destas</div>` : ""}
      <a class="btn btn-outline w-full agenda-link" href="#/mentorias">📅 Ver cronograma completo</a>`;

    return `
      <div class="grid grid-4 kpi-compacto">${kpis}</div>

      <div class="grid grid-equipe">
        ${UI.sectionCard({
          className: "card-startups",
          eyebrow: `Carteira em ${fmt.dataBr(hoje)}`,
          title: "Startups da incubadora",
          desc: "Toque em uma startup para ver detalhes, histórico de mentorias e próximos passos.",
          bodyHtml: `
            <div class="filtros" id="filtros-startups">
              <input class="input" type="search" id="f-busca" placeholder="🔎 Buscar por nome, setor ou responsável" value="${UI.esc(filtros.busca)}" aria-label="Buscar startup" />
              <select class="select" id="f-ciclo" aria-label="Filtrar por ciclo">${opcoes(ciclos, filtros.ciclo, "Todos os ciclos")}</select>
              <select class="select" id="f-responsavel" aria-label="Filtrar por responsável">${opcoes(responsaveis, filtros.responsavel, "Todos os responsáveis")}</select>
              <button type="button" class="filter-chip ${filtros.atencao ? "is-active" : ""}" id="f-atencao" aria-pressed="${filtros.atencao}" title="Só as que precisam de atenção">⚠ Atenção (${fmt.num(I.kpis.startupsPrecisandoAtencao)})</button>
              <button type="button" class="filter-chip ${filtros.agrupar ? "is-active" : ""}" id="f-agrupar" aria-pressed="${filtros.agrupar}" title="Agrupar os cartões por ciclo da jornada">▦ Por ciclo</button>
            </div>
            <div id="lista-startups">${listaStartupsHtml(I)}</div>`,
        })}
        ${UI.sectionCard({
          className: "card-agenda",
          eyebrow: `A partir de ${fmt.dataCurta(hoje)}`,
          title: semana.length || !proximas.length ? "Próximas mentorias · 7 dias" : "Próximas mentorias",
          desc: "O que está marcado na aba Mentorias da planilha.",
          bodyHtml: agenda,
        })}
      </div>`;
  }

  function mountInicio() {
    const I = APP_DATA.incubadora;
    const alvo = document.getElementById("lista-startups");
    const redesenhar = () => (alvo.innerHTML = listaStartupsHtml(I));

    document.getElementById("f-busca").addEventListener("input", (e) => {
      filtros.busca = e.target.value;
      redesenhar();
    });
    document.getElementById("f-ciclo").addEventListener("change", (e) => {
      filtros.ciclo = e.target.value;
      redesenhar();
    });
    document.getElementById("f-responsavel").addEventListener("change", (e) => {
      filtros.responsavel = e.target.value;
      redesenhar();
    });
    ["atencao", "agrupar"].forEach((chave) => {
      const botao = document.getElementById(`f-${chave}`);
      botao.addEventListener("click", () => {
        filtros[chave] = !filtros[chave];
        botao.classList.toggle("is-active", filtros[chave]);
        botao.setAttribute("aria-pressed", String(filtros[chave]));
        redesenhar();
      });
    });
    // Abre/fecha o detalhe do cartão (delegado: a lista é redesenhada).
    alvo.addEventListener("click", (e) => {
      const head = e.target.closest(".startup-card-head");
      if (!head) return;
      const card = head.closest(".startup-card");
      const id = card.dataset.startup;
      const abrir = !abertos.has(id);
      if (abrir) abertos.add(id);
      else abertos.delete(id);
      card.classList.toggle("is-open", abrir);
      head.setAttribute("aria-expanded", String(abrir));
      card.querySelector(".startup-card-detalhe").hidden = !abrir;
    });
  }

  // ------------------------------------------------------------ Cronograma de mentorias

  const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const SEMANA = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
  const cal = { mes: "", dia: "", consultor: "", startup: "", status: "" };

  function mentoriasFiltradas(I) {
    return (I.mentorias || [])
      .filter((m) => !cal.consultor || m.consultor === cal.consultor)
      .filter((m) => !cal.startup || m.startupId === cal.startup)
      .filter((m) => {
        if (!cal.status) return true;
        if (cal.status === "aConfirmar") return m.aConfirmar;
        return m.status === cal.status && !m.aConfirmar;
      });
  }

  function deslocarMes(ym, delta) {
    const [a, m] = ym.split("-").map(Number);
    const d = new Date(Date.UTC(a, m - 1 + delta, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  function calendarioHtml(I) {
    const hoje = hojeDe(I);
    const [a, m] = cal.mes.split("-").map(Number);
    const doMes = mentoriasFiltradas(I).filter((x) => x.data.startsWith(cal.mes));
    const porDia = new Map();
    doMes.forEach((x) => porDia.set(x.data, [...(porDia.get(x.data) || []), x]));
    const primeiroDiaSemana = (new Date(Date.UTC(a, m - 1, 1)).getUTCDay() + 6) % 7; // segunda = 0
    const diasNoMes = new Date(Date.UTC(a, m, 0)).getUTCDate();
    const celulas = [];
    for (let i = 0; i < primeiroDiaSemana; i++) celulas.push('<div class="cal-dia is-fora"></div>');
    for (let d = 1; d <= diasNoMes; d++) {
      const iso = `${cal.mes}-${String(d).padStart(2, "0")}`;
      const itens = porDia.get(iso) || [];
      const chips = itens
        .slice(0, 3)
        .map((x) => `<span class="cal-chip ${classeMentoria(x)}" title="${UI.esc(`${x.hora} ${x.startup} — ${x.tema}`)}">${x.hora ? `${UI.esc(x.hora)} ` : ""}${UI.esc(x.startup)}</span>`)
        .join("");
      celulas.push(`
        <button type="button" class="cal-dia ${iso === hoje ? "is-hoje" : ""} ${iso === cal.dia ? "is-sel" : ""} ${itens.length ? "tem-itens" : ""}" data-dia="${iso}"
          aria-label="${UI.esc(fmt.dataBr(iso))}: ${fmt.num(itens.length)} mentoria(s)">
          <span class="cal-num">${d}</span>
          <span class="cal-chips">${chips}${itens.length > 3 ? `<span class="cal-mais">+${fmt.num(itens.length - 3)}</span>` : ""}</span>
          ${itens.length ? `<span class="cal-qtd ${itens.some((x) => x.aConfirmar) ? "is-confirmar" : itens.some((x) => x.status === "Agendada") ? "is-agendada" : itens.every((x) => x.status === "Cancelada") ? "is-cancelada" : "is-realizada"}">${fmt.num(itens.length)}</span>` : ""}
        </button>`);
    }
    const resumo = ["Realizada", "Agendada", "Cancelada"].map((s) => `${fmt.num(doMes.filter((x) => x.status === s && !x.aConfirmar).length)} ${s.toLowerCase()}(s)`);
    const pend = doMes.filter((x) => x.aConfirmar).length;
    return `
      <div class="cal-topo">
        <div class="cal-nav">
          <button type="button" class="btn btn-outline" id="cal-ant" aria-label="Mês anterior">‹</button>
          <div class="cal-titulo">${MESES[m - 1]} ${a}</div>
          <button type="button" class="btn btn-outline" id="cal-prox" aria-label="Próximo mês">›</button>
          <button type="button" class="btn btn-ghost" id="cal-hoje">Hoje</button>
        </div>
        <div class="cal-resumo">${resumo.join(" · ")}${pend ? ` · <strong>${fmt.num(pend)} a confirmar</strong>` : ""}</div>
      </div>
      <div class="cal-grade" role="grid">
        ${SEMANA.map((s) => `<div class="cal-semana">${s}</div>`).join("")}
        ${celulas.join("")}
      </div>
      <div class="cal-legenda">
        <span class="cal-chip is-realizada">✓ Realizada</span>
        <span class="cal-chip is-agendada">◷ Agendada</span>
        <span class="cal-chip is-confirmar">! A confirmar</span>
        <span class="cal-chip is-cancelada">✕ Cancelada</span>
      </div>`;
  }

  function listaMesHtml(I) {
    const hoje = hojeDe(I);
    const [a, m] = cal.mes.split("-").map(Number);
    const itens = mentoriasFiltradas(I).filter((x) => (cal.dia ? x.data === cal.dia : x.data.startsWith(cal.mes)));
    const titulo = cal.dia ? `${rotuloDia(cal.dia, hoje)} · ${fmt.dataBr(cal.dia)}` : `${MESES[m - 1]} ${a}`;
    // O que vem pela frente primeiro; o que já passou depois, do mais recente
    // para o mais antigo.
    const futuras = itens.filter((x) => x.data >= hoje);
    const passadas = itens.filter((x) => x.data < hoje).reverse();
    const blocos = [];
    if (futuras.length) blocos.push(`${passadas.length ? '<div class="lista-mes-sub">De hoje em diante</div>' : ""}${agendaPorDia(futuras, hoje)}`);
    if (passadas.length) blocos.push(`${futuras.length ? '<div class="lista-mes-sub">Antes de hoje · mais recentes primeiro</div>' : ""}${agendaPorDia(passadas, hoje)}`);
    return `
      <div class="lista-mes-topo">
        <div class="card-title">${UI.esc(titulo)}</div>
        ${cal.dia ? '<button type="button" class="btn btn-ghost" id="cal-limpar-dia">Ver o mês todo</button>' : ""}
      </div>
      <div class="agenda-lista">${blocos.length ? blocos.join("") : '<div class="vazio">Nenhuma mentoria neste recorte.</div>'}</div>`;
  }

  function atencaoHtml(I) {
    const alerta = I.parametros.alertaDiasSemMentoria;
    const lista = [...I.startups].sort((a, b) => b.diasSemMentoria - a.diasSemMentoria).slice(0, 8);
    return `
      <div class="atencao-lista">
        ${lista
          .map(
            (s) => `
          <div class="atencao-item ${s.precisaAtencao ? "is-atencao" : ""}">
            <div>
              <div class="atencao-nome">${s.precisaAtencao ? "⚠ " : ""}${UI.esc(s.nome)}</div>
              <div class="atencao-meta">${UI.esc(s.responsavel || "sem responsável")} · ${UI.esc(s.cicloAtual)}</div>
            </div>
            <div class="atencao-dias">
              <strong>${s.ultimaMentoria ? UI.esc(fmt.haDias(s.diasSemMentoria)) : "sem mentoria"}</strong>
              <span>${s.proximaMentoria ? `próxima: ${UI.esc(fmt.dataBr(s.proximaMentoria.data))}` : "nada agendado"}</span>
            </div>
          </div>`
          )
          .join("")}
      </div>
      <div class="card-note">⚠ = mais de ${fmt.num(alerta)} dias sem mentoria e nada agendado (limite ajustável na aba Config da planilha).</div>`;
  }

  function renderMentorias() {
    const I = APP_DATA.incubadora;
    if (!cal.mes) cal.mes = hojeDe(I).slice(0, 7);
    const consultores = unicos((I.mentorias || []).map((m) => m.consultor));
    const startups = [...I.startups].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    const noPeriodo = realizadasNoPeriodo(I);
    const horas = noPeriodo.reduce((s, m) => s + (m.horas || 0), 0);
    const proximas = proximasAgendadas(I);

    const kpis =
      UI.kpiCard({ label: "Realizadas no período", value: fmt.num(noPeriodo.length), sub: PERIOD.PRESETS[PERIOD.key()].label, hero: true, spark: PERIOD.slice(I.serieMensal.mentorias) }) +
      UI.kpiCard({ label: "Horas de mentoria", value: fmt.num1(horas), sub: "no período, somando a coluna horas" }) +
      UI.kpiCard({ label: "Agendadas", value: fmt.num(proximas.length), sub: proximas.length ? `próxima: ${rotuloDia(proximas[0].data, hojeDe(I))}${proximas[0].hora ? ` às ${proximas[0].hora}` : ""}` : "nada agendado ainda" }) +
      UI.kpiCard({ label: "A confirmar", value: fmt.num(I.kpis.mentoriasAConfirmar), sub: "data passou e segue como Agendada" });

    return `
      <div class="grid grid-4 kpi-compacto">${kpis}</div>

      <div class="card filtros-card">
        <div class="filtros">
          <select class="select" id="m-consultor" aria-label="Filtrar por consultor">${opcoes(consultores, cal.consultor, "Todos os consultores")}</select>
          <select class="select" id="m-startup" aria-label="Filtrar por startup">
            <option value="">Todas as startups</option>
            ${startups.map((s) => `<option value="${UI.esc(s.id)}" ${s.id === cal.startup ? "selected" : ""}>${UI.esc(s.nome)}</option>`).join("")}
          </select>
          <select class="select" id="m-status" aria-label="Filtrar por situação">
            ${[["", "Todas as situações"], ["Agendada", "Agendadas"], ["Realizada", "Realizadas"], ["aConfirmar", "A confirmar"], ["Cancelada", "Canceladas"]]
              .map(([v, r]) => `<option value="${v}" ${v === cal.status ? "selected" : ""}>${r}</option>`)
              .join("")}
          </select>
        </div>
      </div>

      <div class="grid grid-equipe">
        <div class="card card-calendario">
          <div id="calendario">${calendarioHtml(I)}</div>
          <div id="lista-mes" class="lista-mes">${listaMesHtml(I)}</div>
        </div>
        <div class="coluna-lateral">
          ${UI.sectionCard({
            eyebrow: "Acompanhamento",
            title: "Há mais tempo sem mentoria",
            desc: "As 8 startups ativas com a última mentoria mais antiga.",
            bodyHtml: atencaoHtml(I),
          })}
          ${UI.sectionCard({
            eyebrow: "No período selecionado",
            title: "Mentorias realizadas por consultor",
            bodyHtml: UI.chartBox("chart-mentorias-consultor", Math.max(160, 44 * Math.max(1, unicos(noPeriodo.map((m) => m.consultor)).length) + 40)),
          })}
        </div>
      </div>`;
  }

  function mountMentorias({ registerChart }) {
    const I = APP_DATA.incubadora;
    const elCal = document.getElementById("calendario");
    const elLista = document.getElementById("lista-mes");
    const redesenhar = () => {
      elCal.innerHTML = calendarioHtml(I);
      elLista.innerHTML = listaMesHtml(I);
    };
    elCal.addEventListener("click", (e) => {
      if (e.target.closest("#cal-ant")) {
        cal.mes = deslocarMes(cal.mes, -1);
        cal.dia = "";
      } else if (e.target.closest("#cal-prox")) {
        cal.mes = deslocarMes(cal.mes, 1);
        cal.dia = "";
      } else if (e.target.closest("#cal-hoje")) {
        cal.mes = hojeDe(I).slice(0, 7);
        cal.dia = hojeDe(I);
      } else {
        const dia = e.target.closest(".cal-dia[data-dia]");
        if (!dia) return;
        cal.dia = cal.dia === dia.dataset.dia ? "" : dia.dataset.dia;
      }
      redesenhar();
      if (cal.dia && window.matchMedia("(max-width: 860px)").matches) elLista.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    elLista.addEventListener("click", (e) => {
      if (!e.target.closest("#cal-limpar-dia")) return;
      cal.dia = "";
      redesenhar();
    });
    [["m-consultor", "consultor"], ["m-startup", "startup"], ["m-status", "status"]].forEach(([id, chave]) => {
      document.getElementById(id).addEventListener("change", (e) => {
        cal[chave] = e.target.value;
        redesenhar();
      });
    });

    // Barras horizontais, série única (o título nomeia a série; sem legenda).
    const porConsultor = {};
    realizadasNoPeriodo(I).forEach((m) => (porConsultor[m.consultor || "Sem consultor"] = (porConsultor[m.consultor || "Sem consultor"] || 0) + 1));
    const ordenado = Object.entries(porConsultor).sort((a, b) => a[1] - b[1]);
    const chart = registerChart(echarts.init(document.getElementById("chart-mentorias-consultor")));
    chart.setOption({
      color: [T.SERIES_PALETTE[0]],
      tooltip: T.tooltipDefaults({ trigger: "item", formatter: (p) => `${UI.esc(p.name)}<br/><b>${fmt.num(p.value)}</b> mentoria(s) realizada(s)` }),
      grid: T.baseGrid({ top: 6, right: 34, bottom: 4 }),
      xAxis: T.valueAxis({ minInterval: 1 }),
      yAxis: T.categoryAxis(ordenado.map(([nome]) => nome), { axisLabel: { ...T.axisText(), interval: 0 } }),
      series: [
        {
          type: "bar",
          data: ordenado.map(([, n]) => n),
          barMaxWidth: 18,
          itemStyle: { borderRadius: T.barRadius("horizontal") },
          label: { show: true, position: "right", formatter: (p) => fmt.num(p.value), color: T.COLORS.gray700, fontSize: 11, fontWeight: 700 },
        },
      ],
    });
  }

  window.VIEW_EQUIPE_INICIO = {
    title: "Startups & mentorias",
    subtitle: "O dia a dia da incubadora: quem está em cada etapa e o que está agendado",
    render: renderInicio,
    mount: mountInicio,
  };

  window.VIEW_MENTORIAS = {
    title: "Cronograma de mentorias",
    subtitle: "Calendário da equipe — realizadas, agendadas e a confirmar",
    render: renderMentorias,
    mount: mountMentorias,
  };
})();
