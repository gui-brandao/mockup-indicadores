// Bootstrap do shell: sidebar, seletor de período, modo apresentação e
// as ações "de mentira" (exportar) que só existem para a demonstração.
(function () {
  function initSidebar() {
    const shell = document.getElementById("app-shell");
    const toggle = document.getElementById("sidebar-toggle");
    toggle.addEventListener("click", () => {
      shell.classList.toggle("is-collapsed");
      toggle.textContent = shell.classList.contains("is-collapsed") ? "›" : "‹";
      setTimeout(ROUTER.resizeCharts, 210);
    });
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
    document.getElementById("btn-export-excel").addEventListener("click", () => {
      showToast("Exportação em Excel disponível na versão integrada.");
    });
    document.getElementById("btn-export-pdf").addEventListener("click", () => {
      showToast("Exportação em PDF disponível na versão integrada.");
    });
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
    const views = [
      ["visao-geral", "VIEW_VISAO_GERAL"],
      ["incubadora", "VIEW_INCUBADORA"],
      ["espacos", "VIEW_ESPACOS"],
      ["operacao", "VIEW_OPERACAO"],
      ["relacionamento", "VIEW_RELACIONAMENTO"],
      ["educacao", "VIEW_EDUCACAO"],
      ["metas", "VIEW_METAS"],
    ];
    views.forEach(([route, globalName]) => {
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

  document.addEventListener("DOMContentLoaded", () => {
    safeBoot(initSidebar, "sidebar");
    safeBoot(initPeriodSelect, "seletor de período");
    safeBoot(initExportButtons, "botões de exportação");
    safeBoot(initPresentMode, "modo apresentação");
    safeBoot(registerViews, "registro de telas");
    safeBoot(checkChartsLibrary, "verificação do ECharts");
    safeBoot(() => ROUTER.init(), "inicialização do roteador");
  });
})();
