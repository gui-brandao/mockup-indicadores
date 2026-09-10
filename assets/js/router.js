// Hash router simples — troca a view ativa, descarta instâncias ECharts
// da view anterior (evita vazamento/gráfico fantasma) e atualiza a sidebar.
(function () {
  const routes = {};
  let activeCharts = [];
  let activeRoute = null;
  let periodUnsub = null;

  function register(path, view) {
    routes[path] = view;
  }

  function registerChart(instance) {
    activeCharts.push(instance);
    return instance;
  }

  function teardown() {
    activeCharts.forEach((c) => {
      try {
        c.dispose();
      } catch (e) {
        /* no-op */
      }
    });
    activeCharts = [];
  }

  function currentPath() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    return hash || "visao-geral";
  }

  // Preenche todo .chart-box que ficou sem conteúdo com um aviso legível.
  function markChartsFailed(scope, err) {
    scope.querySelectorAll(".chart-box").forEach((box) => {
      if (box.children.length) return;
      box.classList.add("chart-box-failed");
      box.innerHTML =
        '<div class="chart-fallback">' +
        "<strong>Gráfico indisponível</strong>" +
        "<span>Não foi possível carregar a biblioteca de gráficos nesta rede.</span>" +
        (err && err.message ? `<code>${String(err.message).slice(0, 120)}</code>` : "") +
        "</div>";
    });
  }

  function render() {
    teardown();
    const path = currentPath();
    const view = routes[path] || routes["visao-geral"];
    activeRoute = path in routes ? path : "visao-geral";

    const main = document.getElementById("view");
    main.innerHTML = view.render();

    // Se o mount falhar (ex.: biblioteca de gráficos ausente), a falha precisa
    // ficar VISÍVEL. Antes, uma exceção aqui deixava todos os boxes de gráfico
    // em branco sem nenhum aviso — foi exatamente o defeito que chegou à produção.
    if (view.mount) {
      try {
        view.mount({ registerChart });
      } catch (err) {
        console.error("Falha ao montar os gráficos da tela:", err);
        markChartsFailed(main, err);
      }
    }

    document.querySelectorAll(".nav-item").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.route === activeRoute);
    });

    const topbarTitle = document.getElementById("topbar-title");
    const topbarSub = document.getElementById("topbar-sub");
    if (topbarTitle) topbarTitle.textContent = view.title || "";
    if (topbarSub) topbarSub.textContent = view.subtitle || "";

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function resizeCharts() {
    activeCharts.forEach((c) => {
      try {
        c.resize();
      } catch (e) {
        /* no-op */
      }
    });
  }

  function init() {
    window.addEventListener("hashchange", render);
    window.addEventListener("resize", resizeCharts);
    if (PERIOD && !periodUnsub) {
      PERIOD.onChange(() => render());
      periodUnsub = true;
    }
    render();
  }

  window.ROUTER = { register, init, render, resizeCharts, currentPath };
})();
