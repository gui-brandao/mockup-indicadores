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

  // Registra as views no router.
  function registerViews() {
    ROUTER.register("visao-geral", VIEW_VISAO_GERAL);
    ROUTER.register("incubadora", VIEW_INCUBADORA);
    ROUTER.register("espacos", VIEW_ESPACOS);
    ROUTER.register("operacao", VIEW_OPERACAO);
    ROUTER.register("relacionamento", VIEW_RELACIONAMENTO);
    ROUTER.register("educacao", VIEW_EDUCACAO);
    ROUTER.register("metas", VIEW_METAS);
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

  document.addEventListener("DOMContentLoaded", () => {
    initSidebar();
    initPeriodSelect();
    initExportButtons();
    initPresentMode();
    registerViews();
    checkChartsLibrary();
    ROUTER.init();
  });
})();
