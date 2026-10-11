// Tela "Tarefas" do painel da equipe: quadro A fazer / Fazendo / Pendente /
// Feito, lido da aba Tarefas da planilha. Cada cartão traz só o essencial
// (título, startup, responsável, prazo, prioridade); o registro completo fica
// no Zoho CRM (botão "Abrir no Zoho").
//
// Conversa com as telas de startups: "#/tarefas?tarefa=TAR-001" abre e
// destaca uma tarefa; "#/tarefas?startup=STU-05" filtra as de uma startup.
(function () {
  const COLUNAS = [
    ["A fazer", "afazer", "Ainda não começou"],
    ["Fazendo", "fazendo", "Em andamento agora"],
    ["Pendente", "pendente", "Parada, esperando algo ou alguém"],
    ["Feito", "feito", "Concluídas"],
  ];
  const PRIORIDADE = {
    Alta: '<span class="pill pill-red">▲ Alta</span>',
    "Média": '<span class="pill pill-yellow">■ Média</span>',
    Baixa: '<span class="pill pill-gray">▼ Baixa</span>',
  };
  const PESO_PRIORIDADE = { Alta: 0, "Média": 1, Baixa: 2, "": 3 };
  const DIAS_FEITAS_RECENTES = 30;

  const filtros = { busca: "", responsavel: "", startup: "", prioridade: "", atrasadas: false, todasFeitas: false };
  let aberta = "";
  let destaque = "";
  let ultimoHash = "";

  function tarefasDe(I) {
    return I.tarefas || [];
  }

  function unicos(lista) {
    return [...new Set(lista.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  function opcoes(valores, selecionado, rotuloTodos) {
    return (
      `<option value="">${UI.esc(rotuloTodos)}</option>` +
      valores.map(([v, r]) => `<option value="${UI.esc(v)}" ${v === selecionado ? "selected" : ""}>${UI.esc(r)}</option>`).join("")
    );
  }

  // Lê os parâmetros do endereço uma vez por navegação (o router também
  // redesenha a tela quando o período muda — aí os filtros da pessoa ficam).
  function aplicarParametros() {
    if (window.location.hash === ultimoHash) return;
    ultimoHash = window.location.hash;
    const p = ROUTER.params();
    if (p.get("tarefa")) {
      Object.assign(filtros, { busca: "", responsavel: "", startup: "", prioridade: "", atrasadas: false, todasFeitas: true });
      aberta = destaque = p.get("tarefa");
    } else if (p.get("startup")) {
      Object.assign(filtros, { busca: "", responsavel: "", prioridade: "", atrasadas: false, startup: p.get("startup") });
      destaque = "";
    } else {
      destaque = "";
    }
  }

  function prazoTexto(t, hoje) {
    if (t.status === "Feito") return t.concluidaEm ? `concluída em ${fmt.dataBr(t.concluidaEm).slice(0, 5)}` : "concluída";
    if (!t.prazo) return "sem prazo";
    const d = fmt.diasEntre(hoje, t.prazo);
    if (d < 0) return `atrasada ${d === -1 ? "1 dia" : `${fmt.num(-d)} dias`}`;
    if (d === 0) return "vence hoje";
    if (d === 1) return "vence amanhã";
    return `vence em ${fmt.num(d)} dias · ${fmt.dataBr(t.prazo).slice(0, 5)}`;
  }

  function filtradas(I) {
    const busca = filtros.busca.trim().toLocaleLowerCase("pt-BR");
    return tarefasDe(I)
      .filter((t) => !busca || `${t.titulo} ${t.startup} ${t.responsavel} ${t.observacao} ${t.id}`.toLocaleLowerCase("pt-BR").includes(busca))
      .filter((t) => !filtros.responsavel || t.responsavel === filtros.responsavel)
      .filter((t) => !filtros.startup || t.startupId === filtros.startup)
      .filter((t) => !filtros.prioridade || t.prioridade === filtros.prioridade)
      .filter((t) => !filtros.atrasadas || t.atrasada);
  }

  function ordenar(a, b) {
    return (b.atrasada - a.atrasada) || (PESO_PRIORIDADE[a.prioridade] - PESO_PRIORIDADE[b.prioridade]) || (a.prazo || "9999").localeCompare(b.prazo || "9999");
  }

  function cartao(t, hoje) {
    const aberto = aberta === t.id;
    return `
      <article class="tarefa-card ${t.atrasada ? "is-atrasada" : ""} ${aberto ? "is-open" : ""} ${destaque === t.id ? "is-destaque" : ""}" data-tarefa="${UI.esc(t.id)}">
        <button type="button" class="tarefa-card-head" aria-expanded="${aberto}">
          <span class="tarefa-card-titulo">${UI.esc(t.titulo)}</span>
          <span class="startup-card-toggle" aria-hidden="true">▾</span>
        </button>
        <div class="tarefa-card-meta">
          ${t.prioridade ? PRIORIDADE[t.prioridade] : ""}
          ${t.startup ? `<a class="tarefa-card-startup" href="#/tarefas?startup=${encodeURIComponent(t.startupId)}" title="Ver as tarefas desta startup">🚀 ${UI.esc(t.startup)}</a>` : '<span class="muted">Tarefa interna</span>'}
        </div>
        <div class="tarefa-card-rodape">
          <span>👤 ${t.responsavel ? UI.esc(t.responsavel) : '<span class="muted">sem responsável</span>'}</span>
          <span class="tarefa-card-prazo">${t.atrasada ? "⚠ " : ""}${UI.esc(prazoTexto(t, hoje))}</span>
        </div>
        <div class="tarefa-card-detalhe" ${aberto ? "" : "hidden"}>
          <dl>
            <div><dt>Código</dt><dd>${UI.esc(t.id)}</dd></div>
            <div><dt>Situação</dt><dd>${UI.esc(t.status)}</dd></div>
            <div><dt>Prazo</dt><dd>${t.prazo ? UI.esc(fmt.dataBr(t.prazo)) : "—"}</dd></div>
            ${t.concluidaEm ? `<div><dt>Concluída em</dt><dd>${UI.esc(fmt.dataBr(t.concluidaEm))}</dd></div>` : ""}
          </dl>
          ${t.observacao ? `<p class="tarefa-card-obs">${UI.esc(t.observacao)}</p>` : ""}
          ${
            t.linkZoho
              ? `<a class="btn btn-outline w-full" href="${UI.esc(t.linkZoho)}" target="_blank" rel="noopener">Abrir no Zoho CRM ↗</a>`
              : '<div class="muted tarefa-card-dica">Sem link do Zoho — cole o endereço do registro na coluna link_zoho.</div>'
          }
          <div class="tarefa-card-dica">Para mudar a situação: aba <strong>Tarefas</strong>, linha <strong>${UI.esc(t.id)}</strong>, coluna <code>status</code>.</div>
        </div>
      </article>`;
  }

  function quadroHtml(I) {
    const hoje = I.dataReferencia;
    const lista = filtradas(I);
    let feitasOcultas = 0;
    const colunas = COLUNAS.map(([status, tom, ajuda]) => {
      let doStatus = lista.filter((t) => t.status === status).sort(ordenar);
      if (status === "Feito") {
        doStatus.sort((a, b) => (b.concluidaEm || "").localeCompare(a.concluidaEm || ""));
        if (!filtros.todasFeitas) {
          const recentes = doStatus.filter((t) => !t.concluidaEm || fmt.diasEntre(t.concluidaEm, hoje) <= DIAS_FEITAS_RECENTES);
          feitasOcultas = doStatus.length - recentes.length;
          doStatus = recentes;
        }
      }
      return `
        <section class="quadro-coluna is-${tom}" aria-label="${UI.esc(status)}">
          <header>
            <span class="quadro-dot" aria-hidden="true"></span>
            <span class="quadro-coluna-nome">${UI.esc(status)}</span>
            <span class="kanban-column-count">${fmt.num(doStatus.length)}</span>
          </header>
          <div class="quadro-ajuda">${UI.esc(ajuda)}</div>
          <div class="quadro-coluna-corpo">
            ${doStatus.length ? doStatus.map((t) => cartao(t, hoje)).join("") : '<div class="kanban-empty">Nada aqui</div>'}
            ${status === "Feito" && feitasOcultas ? `<button type="button" class="btn btn-ghost w-full" id="t-todas-feitas">Mostrar mais ${fmt.num(feitasOcultas)} concluída(s) há mais de ${fmt.num(DIAS_FEITAS_RECENTES)} dias</button>` : ""}
          </div>
        </section>`;
    }).join("");
    const startupFiltrada = filtros.startup && I.startups.find((s) => s.id === filtros.startup);
    const total = tarefasDe(I).length;
    return `
      <div class="lista-contador">
        Mostrando <strong>${fmt.num(lista.length)}</strong> de ${fmt.num(total)} tarefas${startupFiltrada ? ` · startup <strong>${UI.esc(startupFiltrada.nome)}</strong> (${UI.esc(startupFiltrada.cicloAtual)})` : ""}
        ${lista.length !== total ? ' · <button type="button" class="link-botao" id="t-limpar">limpar filtros</button>' : ""}
      </div>
      <div class="quadro">${colunas}</div>`;
  }

  function porPessoaHtml(I) {
    const abertas = tarefasDe(I).filter((t) => t.status !== "Feito");
    const pessoas = unicos(abertas.map((t) => t.responsavel || "Sem responsável"));
    if (!pessoas.length) return '<div class="vazio">Nenhuma tarefa aberta.</div>';
    const linhas = pessoas
      .map((p) => {
        const minhas = abertas.filter((t) => (t.responsavel || "Sem responsável") === p);
        const n = (s) => minhas.filter((t) => t.status === s).length;
        const atrasadas = minhas.filter((t) => t.atrasada).length;
        return [
          `<button type="button" class="link-botao" data-pessoa="${UI.esc(p === "Sem responsável" ? "" : p)}">${UI.esc(p)}</button>`,
          fmt.num(n("A fazer")),
          fmt.num(n("Fazendo")),
          fmt.num(n("Pendente")),
          atrasadas ? `<span class="td-alerta">⚠ ${fmt.num(atrasadas)}</span>` : '<span class="muted">0</span>',
        ];
      });
    return UI.dataTable({ columns: ["Pessoa", "A fazer", "Fazendo", "Pendente", "Atrasadas"], rows: linhas, numericCols: [1, 2, 3, 4] });
  }

  function proximosPrazosHtml(I) {
    const hoje = I.dataReferencia;
    const lista = tarefasDe(I)
      .filter((t) => t.status !== "Feito" && t.prazo && fmt.diasEntre(hoje, t.prazo) <= 7)
      .sort((a, b) => a.prazo.localeCompare(b.prazo));
    if (!lista.length) return '<div class="vazio">Nenhum prazo nos próximos 7 dias.</div>';
    return `<div class="prazos-lista">${lista
      .map(
        (t) => `
        <a class="prazo-item ${t.atrasada ? "is-atrasada" : ""}" href="#/tarefas?tarefa=${encodeURIComponent(t.id)}">
          <span class="prazo-data">${UI.esc(fmt.dataCurta(t.prazo))}</span>
          <span class="prazo-info"><strong>${UI.esc(t.titulo)}</strong><span>${UI.esc([t.responsavel, t.startup, t.status].filter(Boolean).join(" · "))}</span></span>
          <span class="prazo-quando">${UI.esc(prazoTexto(t, hoje))}</span>
        </a>`
      )
      .join("")}</div>`;
  }

  function render() {
    const I = APP_DATA.incubadora;
    aplicarParametros();
    const K = I.kpis;
    const tarefas = tarefasDe(I);
    const responsaveis = unicos(tarefas.map((t) => t.responsavel));
    const startups = [...new Map(tarefas.filter((t) => t.startupId).map((t) => [t.startupId, t.startup])).entries()].sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
    const abertas = (K.tarefasAFazer || 0) + (K.tarefasFazendo || 0) + (K.tarefasPendentes || 0);
    const startupsComTarefa = new Set(tarefas.filter((t) => t.status !== "Feito" && t.startupId).map((t) => t.startupId)).size;

    const kpis =
      UI.kpiCard({ label: "Tarefas abertas", value: fmt.num(abertas), sub: `em ${fmt.num(startupsComTarefa)} startups + tarefas internas`, hero: true }) +
      UI.kpiCard({ label: "Fazendo agora", value: fmt.num(K.tarefasFazendo || 0), sub: `${fmt.num(K.tarefasAFazer || 0)} na fila (a fazer)` }) +
      UI.kpiCard({ label: "Pendentes", value: fmt.num(K.tarefasPendentes || 0), sub: "paradas, esperando algo ou alguém" }) +
      UI.kpiCard({ label: "Atrasadas", value: `${K.tarefasAtrasadas ? "⚠ " : "✓ "}${fmt.num(K.tarefasAtrasadas || 0)}`, sub: "prazo vencido e ainda não feitas" });

    if (!tarefas.length) {
      return `
        <div class="grid grid-4 kpi-compacto">${kpis}</div>
        ${UI.sectionCard({
          title: "Quadro de tarefas",
          bodyHtml: '<div class="vazio">Nenhuma tarefa cadastrada ainda. Crie a aba <strong>Tarefas</strong> na planilha (veja "Como usar") e inclua uma linha por tarefa.</div>',
        })}`;
    }

    return `
      <div class="grid grid-4 kpi-compacto">${kpis}</div>

      <div class="card filtros-card">
        <div class="filtros">
          <input class="input" type="search" id="t-busca" placeholder="🔎 Buscar tarefa, startup ou pessoa" value="${UI.esc(filtros.busca)}" aria-label="Buscar tarefa" />
          <select class="select" id="t-responsavel" aria-label="Filtrar por responsável">${opcoes(responsaveis.map((r) => [r, r]), filtros.responsavel, "Todas as pessoas")}</select>
          <select class="select" id="t-startup" aria-label="Filtrar por startup">${opcoes(startups, filtros.startup, "Todas as startups")}</select>
          <select class="select" id="t-prioridade" aria-label="Filtrar por prioridade">${opcoes(["Alta", "Média", "Baixa"].map((p) => [p, `Prioridade ${p.toLowerCase()}`]), filtros.prioridade, "Todas as prioridades")}</select>
          <button type="button" class="filter-chip ${filtros.atrasadas ? "is-active" : ""}" id="t-atrasadas" aria-pressed="${filtros.atrasadas}">⚠ Atrasadas (${fmt.num(K.tarefasAtrasadas || 0)})</button>
        </div>
      </div>

      <div class="card">
        <div id="quadro-tarefas">${quadroHtml(I)}</div>
      </div>

      <div class="grid grid-2">
        ${UI.sectionCard({
          eyebrow: "Carga da equipe",
          title: "Tarefas abertas por pessoa",
          desc: "Toque no nome para ver só as tarefas da pessoa.",
          bodyHtml: `<div id="por-pessoa">${porPessoaHtml(I)}</div>`,
        })}
        ${UI.sectionCard({
          eyebrow: `A partir de ${fmt.dataCurta(I.dataReferencia)}`,
          title: "Prazos dos próximos 7 dias",
          desc: "Inclui as atrasadas. Toque para abrir a tarefa no quadro.",
          bodyHtml: proximosPrazosHtml(I),
        })}
      </div>`;
  }

  function mount() {
    const I = APP_DATA.incubadora;
    const quadro = document.getElementById("quadro-tarefas");
    if (!quadro) return;
    const redesenhar = () => (quadro.innerHTML = quadroHtml(I));
    const sincronizarCampos = () => {
      document.getElementById("t-busca").value = filtros.busca;
      document.getElementById("t-responsavel").value = filtros.responsavel;
      document.getElementById("t-startup").value = filtros.startup;
      document.getElementById("t-prioridade").value = filtros.prioridade;
      const chip = document.getElementById("t-atrasadas");
      chip.classList.toggle("is-active", filtros.atrasadas);
      chip.setAttribute("aria-pressed", String(filtros.atrasadas));
    };

    document.getElementById("t-busca").addEventListener("input", (e) => {
      filtros.busca = e.target.value;
      redesenhar();
    });
    [["t-responsavel", "responsavel"], ["t-startup", "startup"], ["t-prioridade", "prioridade"]].forEach(([id, chave]) => {
      document.getElementById(id).addEventListener("change", (e) => {
        filtros[chave] = e.target.value;
        redesenhar();
      });
    });
    document.getElementById("t-atrasadas").addEventListener("click", () => {
      filtros.atrasadas = !filtros.atrasadas;
      sincronizarCampos();
      redesenhar();
    });
    document.getElementById("por-pessoa").addEventListener("click", (e) => {
      const b = e.target.closest("[data-pessoa]");
      if (!b) return;
      filtros.responsavel = b.dataset.pessoa;
      sincronizarCampos();
      redesenhar();
      quadro.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    quadro.addEventListener("click", (e) => {
      if (e.target.closest("#t-limpar")) {
        Object.assign(filtros, { busca: "", responsavel: "", startup: "", prioridade: "", atrasadas: false });
        sincronizarCampos();
        redesenhar();
        return;
      }
      if (e.target.closest("#t-todas-feitas")) {
        filtros.todasFeitas = true;
        redesenhar();
        return;
      }
      const head = e.target.closest(".tarefa-card-head");
      if (!head) return;
      const card = head.closest(".tarefa-card");
      const id = card.dataset.tarefa;
      aberta = aberta === id ? "" : id;
      quadro.querySelectorAll(".tarefa-card").forEach((c) => {
        const abrir = c.dataset.tarefa === aberta;
        c.classList.toggle("is-open", abrir);
        c.querySelector(".tarefa-card-head").setAttribute("aria-expanded", String(abrir));
        c.querySelector(".tarefa-card-detalhe").hidden = !abrir;
      });
    });

    // Veio de um cartão de startup: leva a tarefa para o centro da tela.
    if (destaque) {
      const alvo = [...quadro.querySelectorAll(".tarefa-card")].find((c) => c.dataset.tarefa === destaque);
      if (alvo) setTimeout(() => alvo.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    }
  }

  window.VIEW_TAREFAS = {
    title: "Quadro de tarefas",
    subtitle: "O que a equipe está fazendo — o detalhe de cada registro fica no Zoho CRM",
    render,
    mount,
  };
})();
