# AGENTS.md

Mockup estático (HTML/CSS/JS puro, sem build) de um painel de indicadores para um
Parque Tecnológico. Sem `package.json`, sem testes automatizados — os "dados" são
objetos JS literais em `data/*.js`. Única exceção: `api/*.js` são funções serverless
do Vercel (sem credencial configurada, viram só um `{ configured: false }`, sem
efeito no mock; sem dependências npm) — ver [ARCHITECTURE.md → Integração
real](ARCHITECTURE.md#integração-real-apijs--data-loaderjs).

## Rodando o projeto

Não há instalação nem build.

- Abrir `index.html` direto no navegador (`file://`), ou
- `python3 -m http.server 8080` na raiz e acessar `http://localhost:8080`

São duas páginas sobre o mesmo código: `index.html` (apresentação, 12 telas, sempre
ilustrativo) e `equipe.html` (painel da equipe da Incubadora — startups, quadro de
tarefas, mentorias, indicadores e guia —, lendo a planilha Google Sheets via `/api/incubadora`). O que muda entre elas é o `window.APP_CONFIG` de cada uma
— não duplique view nem lógica por página. Na Incubadora, todo número e texto variável
vem de `APP_DATA.incubadora` (derivado da planilha); não escreva contagem, data ou nome
de mês fixo em `views/incubadora.js`, `views/equipe.js`, `views/tarefas.js` ou
`views/guia.js`. Datas
"AAAA-MM-DD" são formatadas com `fmt.dataBr` / `fmt.dataCurta` / `fmt.haDias` (nunca
`new Date(iso)` local, que mostra o dia anterior no fuso de Brasília). Toda tela nova
precisa caber em 390 px de largura sem rolagem horizontal.

Não sugira `npm install`, bundler ou transpilador — não existe toolchain aqui de
propósito (veja o README, seção "Como abrir").

## Regras universais

- **Idioma:** todo texto de UI, comentário de código e nome de conteúdo visível
  fica em português do Brasil. Nomes de variáveis/funções em inglês, como já é o
  padrão no código existente.
- **Formatação de número/percentual:** sempre via `window.fmt` (`fmt.num`,
  `fmt.num1`, `fmt.pct`, `fmt.compact`) — nunca `toLocaleString` ou template
  string manual. É o que garante pt-BR consistente (`.` de milhar, `,` decimal)
  em todo o painel.
- **Nunca escreva um KPI como total fixo.** Todo número que varia por período
  vem de uma série mensal em `data/*.js`, agregada em runtime por
  `window.PERIOD` (`sum`/`avg`/`last`/`slice`). Ver
  [ARCHITECTURE.md → Camada de dados](ARCHITECTURE.md#camada-de-dados-datajs).
- **Ordem de `<script>` em `index.html` importa.** É tudo script clássico sem
  módulos — um arquivo que lê `APP_DATA`/`APP_THEME`/`UI`/`fmt`/`PERIOD` antes de
  ele ser definido quebra silenciosamente. Ver
  [ARCHITECTURE.md → Adicionando uma nova tela](ARCHITECTURE.md#adicionando-uma-nova-tela).
- **Todo `echarts.init(...)` dentro de `mount()` passa por `registerChart(...)`.**
  Sem isso o router não descarta o gráfico ao trocar de tela. Ver
  [ARCHITECTURE.md → Router](ARCHITECTURE.md#router-assetsjsrouterjs).
- **Cor de gráfico nunca sozinha carregando significado** ("relief"), e a ordem
  de `APP_THEME.SERIES_PALETTE` é fixa — não cicle nem reordene por tela. Ver
  [ARCHITECTURE.md → Tema dos gráficos](ARCHITECTURE.md#tema-dos-gráficos-assetsjsthemejs).
- **Texto livre (nome de evento, cidade etc.) sempre via `UI.esc()`** antes de
  entrar no HTML — não há template engine com escaping automático aqui.
- **Não adicione dark mode.** Tema claro fixo é decisão deliberada (mesma
  leitura dos sistemas de origem em qualquer projetor).
- **Este é um mockup com dados reais e estimados lado a lado.** Antes de
  inventar ou ajustar um número, confira a tabela "Origem dos dados" no
  [README](README.md#origem-dos-dados) — não troque uma estimativa por um
  número "mais bonito" sem essa base.
- **`api/*.js` (agenda, os, incubadora) nunca devem quebrar o boot nem exigir
  credencial.** Sem variável de ambiente configurada, sempre respondem
  `{ configured: false }` (HTTP 200) — nunca lance exceção nem exija token/chave
  para o painel funcionar; erro na chamada real também volta como 200 com
  `ok: false`. Qualquer fonte nova passa por `handleSource`. Se mudar o formato de
  `data/incubadora.js`, atualize junto `api/_lib/montar-incubadora.js` e os CSVs de
  `docs/planilha-incubadora/` (o mock é o contrato). Ver
  [ARCHITECTURE.md → Integração real](ARCHITECTURE.md#integração-real-apijs--data-loaderjs).

## Documentação de referência

- [README.md](README.md) — o que é o projeto, roteiro de apresentação, origem
  dos dados, plano de integração real.
- [ARCHITECTURE.md](ARCHITECTURE.md) — contratos entre camadas (dados, período,
  router, views, tema), ordem de carregamento, como adicionar uma tela nova.
