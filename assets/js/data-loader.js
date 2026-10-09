// Camada de integração real (funções serverless em /api). Cada página diz
// quais fontes busca em window.APP_CONFIG.fontes (a apresentação busca Agenda
// e O.S.; o painel da equipe, só a Incubadora — ver README.md § "Como isto
// vira sistema real"). Busca as rotas /api antes do boot (chamado por app.js);
// se a fonte não estiver configurada, a chamada falhar ou estourar o tempo
// limite, mantém o que data/*.js já popularam em window.APP_DATA — a tela
// nunca fica sem dado por causa desta camada.
//
// window.APP_FONTES[<fonte>] registra de onde o dado veio, para o selo da
// página: { origem: "real" | "ilustrativo", avisos: [...], erro? }.
(function () {
  const TIMEOUTS_MS = { agenda: 2500, os: 2500, incubadora: 6000 }; // planilha: token + leitura no Google

  window.APP_FONTES = {};

  function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
  }

  // body.configured === false (sem credencial ainda) ou body.ok === false
  // (credencial configurada, mas a chamada real falhou): em ambos os casos,
  // não mexe em window.APP_DATA — o mock que já está lá continua valendo.
  async function loadSource(key) {
    const fonte = { origem: "ilustrativo", avisos: [] };
    window.APP_FONTES[key] = fonte;
    try {
      const res = await fetchWithTimeout(`/api/${key}`, TIMEOUTS_MS[key] || 2500);
      if (!res.ok) return;
      const body = await res.json();
      if (body && body.ok && body.data) {
        window.APP_DATA[key] = body.data;
        fonte.origem = "real";
        fonte.avisos = body.avisos || [];
        fonte.avisos.forEach((aviso) => console.warn(`Dados de "${key}" — ${aviso}`));
      } else if (body && body.configured && !body.ok) {
        fonte.erro = body.error;
        console.warn(`Integração real de "${key}" falhou, usando dados ilustrativos: ${body.error}`);
      }
    } catch (err) {
      console.warn(`Integração real de "${key}" indisponível, usando dados ilustrativos:`, err);
    }
  }

  async function loadRemoteData(fontes) {
    // file:// (modo de apresentação offline) nunca tem função serverless para
    // responder — pular aqui evita o ruído de CORS/rede no console sem mudar
    // o resultado (o fetch cairia no mesmo catch de qualquer forma).
    if (window.location.protocol === "file:") {
      (fontes || []).forEach((key) => (window.APP_FONTES[key] = { origem: "ilustrativo", avisos: [] }));
      return;
    }
    await Promise.all((fontes || []).map(loadSource));
  }

  window.loadRemoteData = loadRemoteData;
})();
