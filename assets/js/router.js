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

  function render() {
    teardown();
    const path = currentPath();
    const view = routes[path] || routes["visao-geral"];
    activeRoute = path in routes ? path : "visao-geral";

    const main = document.getElementById("view");
    main.innerHTML = view.render();

    if (view.mount) {
      view.mount({ registerChart });
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
