// Camada de integração real (funções serverless em /api) para as fontes que
// já têm API no sistema de origem — hoje só Agenda e O.S. (ver README.md §
// "Como isto vira sistema real"). Busca /api/agenda e /api/os antes do boot
// da aplicação (chamado por app.js); se a fonte não estiver configurada, a
// chamada falhar ou estourar o tempo limite, mantém o que data/agenda.js e
// data/os.js já popularam de forma síncrona em window.APP_DATA — a tela
// nunca fica sem dado por causa desta camada.
(function () {
  const TIMEOUT_MS = 2500;

  function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
  }

  // body.configured === false (sem credencial ainda) ou body.ok === false
  // (credencial configurada, mas a chamada real falhou): em ambos os casos,
  // não mexe em window.APP_DATA — o mock que já está lá continua valendo.
  async function loadSource(endpoint, key) {
    try {
      const res = await fetchWithTimeout(endpoint);
      if (!res.ok) return;
      const body = await res.json();
      if (body && body.ok && body.data) {
        window.APP_DATA[key] = body.data;
      }
    } catch (err) {
      console.warn(`Integração real de "${key}" indisponível, usando dados ilustrativos:`, err);
    }
  }

  async function loadRemoteData() {
    // file:// (modo de apresentação offline) nunca tem função serverless para
    // responder — pular aqui evita o ruído de CORS/rede no console sem mudar
    // o resultado (o fetch cairia no mesmo catch de qualquer forma).
    if (window.location.protocol === "file:") return;
    await Promise.all([loadSource("/api/agenda", "agenda"), loadSource("/api/os", "os")]);
  }

  window.loadRemoteData = loadRemoteData;
})();
