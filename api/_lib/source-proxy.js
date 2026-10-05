// Helper comum às funções serverless de integração real (api/agenda.js,
// api/os.js, api/incubadora.js e futuras fontes) — evita repetir em cada
// arquivo a mesma política de "sem credencial configurada" e "erro na chamada
// real", ambas sempre respondidas como 200 (nunca um HTTP de erro) para que
// assets/js/data-loader.js trate as duas como "mantenha o mock atual" sem
// precisar de tratamento especial por código de status.
//
// fetchReal(env) recebe as variáveis exigidas e devolve { data, avisos? }:
// `data` no mesmo formato de window.APP_DATA.<fonte>; `avisos` são
// inconsistências não fatais, que o data-loader mostra no console.
//
// Arquivos/pastas prefixados com "_" dentro de /api não viram rota própria
// no Vercel — por isso este helper fica em _lib, e não em api/source-proxy.js.
async function handleSource(res, { requiredEnv, fetchReal, cacheSeconds }) {
  const env = {};
  for (const nome of requiredEnv) env[nome] = process.env[nome];

  if (requiredEnv.some((nome) => !env[nome])) {
    res.status(200).json({ configured: false });
    return;
  }

  try {
    const { data, avisos = [] } = await fetchReal(env);
    // Cache no CDN do Vercel: evita estourar a cota da API de origem a cada
    // carregamento de página. Só em sucesso — falha nunca fica em cache.
    if (cacheSeconds && res.setHeader) {
      res.setHeader("Cache-Control", `public, s-maxage=${cacheSeconds}, stale-while-revalidate`);
    }
    res.status(200).json({ configured: true, ok: true, data, avisos });
  } catch (err) {
    res.status(200).json({ configured: true, ok: false, error: String((err && err.message) || err) });
  }
}

module.exports = { handleSource };
