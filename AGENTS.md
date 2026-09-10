# AGENTS.md

Mockup estático (HTML/CSS/JS puro, sem build) de um painel de indicadores para um
Parque Tecnológico. Sem backend, sem `package.json`, sem testes automatizados —
os "dados" são objetos JS literais em `data/*.js`.

## Rodando o projeto

Não há instalação nem build.

- Abrir `index.html` direto no navegador (`file://`), ou
- `python3 -m http.server 8080` na raiz e acessar `http://localhost:8080`

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

## Documentação de referência

- [README.md](README.md) — o que é o projeto, roteiro de apresentação, origem
  dos dados, plano de integração real.
- [ARCHITECTURE.md](ARCHITECTURE.md) — contratos entre camadas (dados, período,
  router, views, tema), ordem de carregamento, como adicionar uma tela nova.
