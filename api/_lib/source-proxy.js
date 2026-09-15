// Helper comum às funções serverless de integração real (api/agenda.js,
// api/os.js e futuras fontes) — evita repetir em cada arquivo a mesma
// política de "sem credencial configurada" e "erro na chamada real", ambas
// sempre respondidas como 200 (nunca um HTTP de erro) para que
// assets/js/data-loader.js trate as duas como "mantenha o mock atual" sem
// precisar de tratamento especial por código de status.
//
// Arquivos/pastas prefixados com "_" dentro de /api não viram rota própria
// no Vercel — por isso este helper fica em _lib, e não em api/source-proxy.js.
async function handleSource(res, { baseUrlEnv, tokenEnv, fetchReal }) {
  const baseUrl = process.env[baseUrlEnv];
  const token = process.env[tokenEnv];

  if (!baseUrl || !token) {
    res.status(200).json({ configured: false });
    return;
  }

  try {
    const data = await fetchReal(baseUrl, token);
    res.status(200).json({ configured: true, ok: true, data });
  } catch (err) {
    res.status(200).json({ configured: true, ok: false, error: String((err && err.message) || err) });
  }
}

module.exports = { handleSource };
