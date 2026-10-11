// Bootstrap do shell: sidebar, seletor de período, modo apresentação e
// as ações "de mentira" (exportar) que só existem para a demonstração.
//
// Cada página define window.APP_CONFIG antes deste script (ver equipe.html);
// sem isso vale a configuração da apresentação completa (index.html).
(function () {
  const TODAS_AS_ROTAS = [
    ["visao-geral", "VIEW_VISAO_GERAL"],
    ["incubadora", "VIEW_INCUBADORA"],
    ["espacos", "VIEW_ESPACOS"],
    ["operacao", "VIEW_OPERACAO"],
    ["relacionamento", "VIEW_RELACIONAMENTO"],
    ["educacao", "VIEW_EDUCACAO"],
    ["metas", "VIEW_METAS"],
    ["parcerias", "VIEW_PARCERIAS"],
    ["monitoramento-uso", "VIEW_MONITORAMENTO_USO"],
    ["eventos", "VIEW_EVENTOS"],
    ["posatendimento", "VIEW_POSATENDIMENTO"],
    ["laboratorios", "VIEW_LABORATORIOS"],
  ];

  // rotas: [rota, global da view]; rotaInicial: tela sem hash;
  // fontes: o que data-loader.js busca em /api; periodoDe: fonte cujos meses
  // definem o seletor de período (vazio = Jan–Set/2026 do mock);
  // seloDe: fonte que define o selo "dados ilustrativos / planilha".
  const CONFIG = Object.assign(
    { rotas: TODAS_AS_ROTAS, rotaInicial: "visao-geral", fontes: ["agenda", "os"], periodoDe: null, seloDe: null },
    window.APP_CONFIG || {}
  );

  function initSidebar() {
    const shell = document.getElementById("app-shell");
    const toggle = document.getElementById("sidebar-toggle");
    toggle.addEventListener("click", () => {
      shell.classList.toggle("is-collapsed");
      toggle.textContent = shell.classList.contains("is-collapsed") ? "›" : "‹";
      setTimeout(ROUTER.resizeCharts, 210);
    });
  }

  // O período segue os meses que a fonte trouxe (no painel da equipe, a
  // planilha: Jan até o mês corrente). Precisa rodar antes do seletor.
  function configurarPeriodo() {
    const dados = CONFIG.periodoDe && APP_DATA[CONFIG.periodoDe];
    if (dados && dados.periodo && dados.monthLabels) {
      PERIOD.configurar({ ano: dados.periodo.ano, monthLabels: dados.monthLabels });
    }
  }

  function initPeriodSelect() {
    const select = document.getElementById("period-select");
    Object.entries(PERIOD.PRESETS).forEach(([key, preset]) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = preset.label;
      select.appendChild(opt);
    });
    select.value = PERIOD.key();
    select.addEventListener("change", () => PERIOD.set(select.value));
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function initExportButtons() {
    const excel = document.getElementById("btn-export-excel");
    const pdf = document.getElementById("btn-export-pdf");
    if (excel) excel.addEventListener("click", () => showToast("Exportação em Excel disponível na versão integrada."));
    if (pdf) pdf.addEventListener("click", () => showToast("Exportação em PDF disponível na versão integrada."));
  }

  function initPresentMode() {
    const shell = document.getElementById("app-shell");
    const enter = () => {
      shell.classList.add("is-presenting");
      setTimeout(ROUTER.resizeCharts, 210);
    };
    const exit = () => {
      shell.classList.remove("is-presenting");
      setTimeout(ROUTER.resizeCharts, 210);
    };
    document.getElementById("btn-present").addEventListener("click", enter);
    document.getElementById("btn-exit-present").addEventListener("click", exit);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && shell.classList.contains("is-presenting")) exit();
      if ((e.key === "p" || e.key === "P") && !e.metaKey && !e.ctrlKey) {
        const tag = (document.activeElement && document.activeElement.tagName) || "";
        if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
        shell.classList.contains("is-presenting") ? exit() : enter();
      }
    });
  }

  // Registra as views no router. Cada registro é isolado: se o script de uma
  // view falhar ao carregar (ex.: arquivo bloqueado na rede), a referência
  // global (VIEW_X) fica indefinida e lançaria ReferenceError — sem o
  // try/catch aqui, isso abortava o restante do boot (inclusive ROUTER.init())
  // e derrubava a navegação inteira, não só a tela problemática.
  function registerViews() {
    CONFIG.rotas.forEach(([route, globalName]) => {
      try {
        const view = window[globalName];
        if (!view) throw new Error(`${globalName} indisponível — script da tela não carregou.`);
        ROUTER.register(route, view);
      } catch (err) {
        console.error(`Falha ao registrar a tela "${route}":`, err);
        ROUTER.register(route, {
          title: "Tela indisponível",
          subtitle: "Falha ao carregar esta tela",
          render: () =>
            '<div class="card"><div class="chart-fallback"><strong>Esta tela não carregou.</strong>' +
            "<span>Recarregue a página; se persistir, pode ser bloqueio de rede a um dos arquivos do painel.</span></div></div>",
        });
      }
    });
  }

  // Selo do topo e lista de inconsistências da planilha: a equipe precisa ver,
  // sem abrir o console, se o painel está com dado real e o que conferir.
  function atualizarSelo() {
    if (!CONFIG.seloDe) return;
    const fonte = (window.APP_FONTES || {})[CONFIG.seloDe] || { origem: "ilustrativo", avisos: [] };
    const dados = APP_DATA[CONFIG.seloDe] || {};
    const selo = document.querySelector(".mock-badge");
    if (selo) {
      if (fonte.origem === "real") {
        const [a, m, d] = String(dados.dataReferencia || "").split("-");
        selo.textContent = `● PLANILHA DA INCUBADORA · ${d}/${m}/${a}`;
        selo.title = "Dados lidos agora da planilha Google Sheets da Incubadora (atualização a cada 1 minuto).";
        selo.classList.add("is-real");
      } else {
        selo.textContent = fonte.erro ? "● DADOS ILUSTRATIVOS — falha ao ler a planilha" : "● DADOS ILUSTRATIVOS — planilha não conectada";
        selo.title = fonte.erro
          ? `A leitura da planilha falhou: ${fonte.erro}`
          : "A planilha ainda não está conectada (variáveis de ambiente no Vercel) — exibindo dados de exemplo.";
      }
    }
    const botaoPlanilha = document.getElementById("btn-planilha");
    if (botaoPlanilha && fonte.origem === "real" && dados.planilhaUrl) {
      botaoPlanilha.href = dados.planilhaUrl;
      botaoPlanilha.hidden = false;
    }
    if (fonte.avisos && fonte.avisos.length) {
      const aviso = document.createElement("div");
      aviso.className = "load-warning";
      aviso.innerHTML =
        `<details><summary><strong>A planilha tem ${fmt.num(fonte.avisos.length)} ponto(s) a conferir</strong> — ` +
        "linhas ignoradas ou dados inconsistentes. Clique para ver.</summary><ul>" +
        fonte.avisos.map((a) => `<li>${UI.esc(a)}</li>`).join("") +
        "</ul></details>";
      document.querySelector(".content").prepend(aviso);
    }
  }

  // A biblioteca de gráficos é servida pelo próprio site (assets/js/vendor).
  // Se por qualquer motivo ela não carregar, avisa em vez de exibir um painel
  // com todos os boxes vazios — o modo de falha que chegou à produção antes.
  function checkChartsLibrary() {
    if (typeof window.echarts !== "undefined") return;
    const banner = document.createElement("div");
    banner.className = "load-warning";
    banner.innerHTML =
      "<strong>Atenção:</strong> a biblioteca de gráficos não carregou — os indicadores numéricos " +
      "seguem corretos, mas os gráficos não serão desenhados. Recarregue a página; se persistir, " +
      "pode ser bloqueio de rede ao arquivo <code>assets/js/vendor/echarts.min.js</code>.";
    document.querySelector(".content").prepend(banner);
  }

  // Cada etapa do boot é isolada: uma falha em qualquer uma (ex.: elemento
  // ausente, script externo bloqueado) não pode impedir ROUTER.init() de
  // rodar — sem isso, um único erro travava a navegação inteira do painel.
  function safeBoot(fn, label) {
    try {
      fn();
    } catch (err) {
      console.error(`Falha ao inicializar "${label}":`, err);
    }
  }

  // Variante async do safeBoot acima, só para a etapa que precisa esperar
  // (busca das fontes com integração real em assets/js/data-loader.js).
  async function safeBootAsync(fn, label) {
    try {
      await fn();
    } catch (err) {
      console.error(`Falha ao inicializar "${label}":`, err);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    safeBoot(initSidebar, "sidebar");
    safeBoot(initExportButtons, "botões de exportação");
    safeBoot(initPresentMode, "modo apresentação");
    // Espera aqui (com timeout embutido em loadRemoteData) para que as fontes
    // reais já cheguem no primeiro render(); se a função não existir
    // (data-loader.js não carregou) ou falhar, segue com o mock de data/*.js.
    await safeBootAsync(
      () => (typeof window.loadRemoteData === "function" ? window.loadRemoteData(CONFIG.fontes) : Promise.resolve()),
      "integração real"
    );
    safeBoot(configurarPeriodo, "período");
    safeBoot(initPeriodSelect, "seletor de período");
    safeBoot(registerViews, "registro de telas");
    safeBoot(atualizarSelo, "selo da fonte de dados");
    safeBoot(checkChartsLibrary, "verificação do ECharts");
    safeBoot(() => ROUTER.init({ rotaInicial: CONFIG.rotaInicial }), "inicialização do roteador");
  });
})();
