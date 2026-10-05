# Painel Consolidado — Parque Tecnológico

Mockup de apresentação de um **painel único** que consolida o que acontece no Parque
Tecnológico, reunindo a leitura de sistemas hoje separados: **Sistema de Agenda**,
**Sistema de O.S.**, **Zoho CRM** (onde atendimento = interação), **AVA** e o plano de
trabalho **FINEP** da incubadora.

> ⚠️ **Isto é um mockup, não um sistema integrado.** A maior parte dos dados vive em
> arquivos `.js` estáticos (`/data`); Espaços & Agenda, Operação (O.S.) e Incubadora já
> têm o encaixe de uma integração real pronto (`/api` + `assets/js/data-loader.js`, ver
> "Como isto vira sistema real" abaixo), mas ainda **sem credencial configurada** —
> na prática, hoje o painel inteiro roda 100% com dado ilustrativo. Números reais
> extraídos dos prints e das planilhas do projeto convivem com estimativas plausíveis
> onde ainda não existe integração ou histórico. O objetivo é validar a ideia do produto
> antes de investir mais fundo na integração real.

📐 Para a arquitetura técnica (camadas, contratos entre dados/período/views/gráficos,
como adicionar uma tela nova), veja [ARCHITECTURE.md](ARCHITECTURE.md).

## Como abrir

Não precisa de servidor nem de `npm install`: é HTML/CSS/JS puro com o ECharts
vendorizado localmente em `assets/js/vendor/`.

- **Mais simples:** dê duplo clique em `index.html` — abre em `file://` e funciona
  offline, ideal para levar num notebook para a reunião com a outra incubadora.
- **Alternativa:** `python3 -m http.server 8080` na raiz do projeto e acesse
  `http://localhost:8080`.

## Roteiro sugerido de apresentação

1. **Visão Geral** — abra por aqui. Mostra o consolidado (todas as origens somadas),
   a composição por área e as 5 fontes de dados já em produção — é o argumento de
   maturidade de gestão.
2. **Incubadora & Jornada** — a metodologia: 9 ciclos (Entrada → Graduação, 52 semanas)
   e as 511 ações mapeadas em 6 fases (S1 Sentir → S6 Ampliar). É o que se replica com
   uma incubadora parceira.
3. **Espaços & Agenda** — espelha o sistema já em uso hoje; mostra volume de uso da
   infraestrutura física (salas, laboratórios, auditório).
4. **Operação (O.S.)** — mostra a capacidade de atendimento interno e a fila operacional.
5. **Relacionamento (CRM)** — como o relacionamento com empreendedores e parceiros é
   rastreado, incluindo o quadro de parcerias (ponto de partida natural para a conversa
   de fomento ao ecossistema com a incubadora visitante).
6. **Educação & Visitas** — alcance social: AVA, roteiros pedagógicos, visitas técnicas.
7. **Metas FINEP** — feche por aqui: as 25 metas do plano de trabalho, com % de execução
   por eixo. Mostra prestação de contas e compromisso institucional.

Use o botão **Modo apresentação** (ou tecla `P`) para esconder o menu lateral e ampliar
tipografia e gráficos ao projetar em tela cheia. O **seletor de período** no topo
(Acumulado 2026 / 3º trimestre / Setembro) recalcula todos os KPIs e gráficos — é
funcional de verdade, não decorativo.

## Origem dos dados

| Fonte no painel | Base usada | Situação |
|---|---|---|
| Sistema de Agenda | Números reais dos prints enviados (156 agendamentos, 1.178 inscrições, 946 presenças, 133 espaços em setembro/2026) | Real (mês) + série mensal estimada |
| Sistema de O.S. | Números reais do print ("últimos 30 dias": 144 registros, 135 em aberto, 9 finalizados, urgência 2,8%) | Real (snapshot) + tendência mensal estimada |
| Incubadora & Jornada | `Ações dos consultores na Incubadora.xlsx` — 511 ações em 6 fases + planilha `Planilha2` (9 ciclos) e `aula coletiva` (material pronto) | Real |
| Metas FINEP | `BI Atendimento Empreendedorismo.xlsx`, aba `Acompanhamento de Metas` — 25 metas anuais em 4 eixos | Real (metas) + realizado estimado onde a planilha não tinha "Realizado" preenchido |
| Educação & AVA | Aba `Atendimento Diagnótico` (17 temas reais) + metas 3.x | Real (catálogo e metas) + série mensal estimada |
| Zoho CRM | — | Estimado (sem export do CRM disponível); "atendimentos" tratados como "interações", conforme orientação do usuário |
| Catraca | — | Estimado a partir das presenças da Agenda |

## Estrutura do projeto

```
index.html    shell único (sidebar + topbar + área de conteúdo)
assets/css/    identidade visual, layout, responsivo, modo apresentação
assets/js/     utilitários compartilhados (tema, formatação, componentes,
               período, router, data-loader) + ECharts vendorizado em assets/js/vendor/
data/*.js      dados mockados de cada fonte (ver tabela acima)
views/*.js     uma view por tela, cada uma com render() + mount()
api/*.js       funções serverless (Vercel) da integração real (Agenda, O.S.,
               Incubadora via Google Sheets) — sem credencial, não muda nada no mock
docs/          CSVs de partida da planilha da Incubadora
```

Cada dataset guarda **séries mensais** (Jan–Set/2026); nenhum KPI é digitado como total
fixo — tudo é somado em runtime pelo `period.js` conforme o período escolhido, então os
números nunca divergem entre a Visão Geral e as telas de detalhe. Os contratos entre
essas peças (o que cada view precisa implementar, como o router gerencia os gráficos,
como adicionar uma tela nova) estão em [ARCHITECTURE.md](ARCHITECTURE.md).

## Como isto vira sistema real

| Bloco do mockup | Fonte real a integrar |
|---|---|
| Espaços & Agenda | **Arquitetura pronta** (`api/agenda.js` + `assets/js/data-loader.js`) — falta só configurar `AGENDA_API_BASE_URL`/`AGENDA_API_TOKEN` e implementar o `fetchReal()` contra a API do Sistema de Agenda (já expõe indicadores — ver chip "API" no header do sistema atual) |
| Operação (O.S.) | **Arquitetura pronta** (`api/os.js` + `assets/js/data-loader.js`) — falta só configurar `OS_API_BASE_URL`/`OS_API_TOKEN` e implementar o `fetchReal()` contra o Banco/API do Sistema de O.S. (mesmos indicadores já calculados hoje) |
| Relacionamento (CRM) | Zoho CRM API/COQL — módulo de Interações e Deals |
| Educação & Visitas | Export do AVA + planilha de roteiros pedagógicos, migrando para banco próprio |
| Incubadora & Jornada | **Arquitetura pronta** (`api/incubadora.js`, lê uma planilha Google Sheets) — falta criar a planilha e configurar a conta de serviço; ver "Planilha da Incubadora" abaixo |
| Metas FINEP | Planilha `Acompanhamento de Metas` migrando para uma base única, com fórmula de "realizado" vindo dos módulos acima (evita preenchimento manual) |
| Parcerias / Monitoramento de Uso / Eventos / Pós-Atendimento / Laboratórios | Ainda sem fonte real mapeada — hoje são 100% estimativas plausíveis |
| Catraca | Integração direta com o controlador de acesso físico do Parque |

O próximo passo natural é priorizar 1–2 integrações (Agenda e O.S. já têm API, então são
o caminho mais curto) e manter o restante como "mockup" até termos volume que justifique
a integração automatizada.

### Integração real de Agenda e O.S. (arquitetura pronta, credenciais pendentes)

Essas duas fontes já têm o encaixe pronto para dado real, sem nenhuma mudança nas telas:

- `api/agenda.js` e `api/os.js` — funções serverless do Vercel (pasta `/api`, detectada
  automaticamente, sem config extra). Sem `AGENDA_API_BASE_URL`/`AGENDA_API_TOKEN` (ou o
  par equivalente de O.S.) configuradas nas variáveis de ambiente do projeto no Vercel,
  respondem `{ configured: false }` e nada muda visualmente.
- `assets/js/data-loader.js` — busca essas duas rotas antes do boot da aplicação; se a
  fonte não estiver configurada, a chamada falhar ou estourar o tempo (2,5s), mantém o
  mock que `data/agenda.js`/`data/os.js` já populou — a tela nunca fica sem dado por causa
  desta camada, e o modo `file://`/servidor local continua funcionando exatamente como hoje.
- `.env.example` documenta as variáveis esperadas.

Para ativar de verdade: preencher `fetchReal()` em `api/agenda.js`/`api/os.js` com a
chamada real (endpoint e autenticação do sistema de origem), moldando a resposta para o
mesmo formato que `data/agenda.js`/`data/os.js` já usam hoje (documentado em comentário
no topo de cada função), e configurar as variáveis de ambiente no Vercel.

### Planilha da Incubadora (Google Sheets, somente leitura)

A tela **Incubadora & Jornada** pode ler uma planilha Google Sheets em vez de
`data/incubadora.js` (que continua como mock/fallback). A equipe edita no Google Sheets; o
painel só lê. Totais que dá para derivar (nº de startups, empresas por ciclo, setores,
mentorias, aulas) **não são digitados** — `api/_lib/montar-incubadora.js` calcula a partir
das linhas e avisa no console se as séries mensais não baterem com a aba `Startups`.

Passo a passo:

1. **Criar a planilha** no Google Sheets e importar cada CSV de
   [`docs/planilha-incubadora/`](docs/planilha-incubadora/) como uma aba com o **mesmo nome
   do arquivo** (Arquivo → Importar → "Inserir nova planilha"). Os CSVs vêm do mock atual,
   então servem de ponto de partida; depois é só substituir pelos dados reais.
2. **Conta de serviço**: no Google Cloud, criar um projeto, ativar a *Google Sheets API*,
   criar uma conta de serviço e baixar a chave JSON.
3. **Compartilhar a planilha** (como *Leitor*) com o e-mail da conta de serviço.
4. **Variáveis no Vercel** (Settings → Environment Variables): `INCUBADORA_SHEET_ID`
   (trecho entre `/d/` e `/edit` da URL), `GOOGLE_SERVICE_ACCOUNT_EMAIL` (`client_email`
   do JSON) e `GOOGLE_SERVICE_ACCOUNT_KEY` (`private_key` do JSON).
5. Abrir `/api/incubadora` no site publicado: `"ok": true` e `avisos` vazio = tudo certo.

| Aba | Colunas (1ª linha = cabeçalho, em minúsculas) | Observação |
|---|---|---|
| `Startups` | id, nome, setor, descricao_atual, ciclo_atual, fomento_captado, data_entrada, responsavel, empregos_gerados | uma linha por startup; `ciclo_atual` deve ser um nome da aba `Ciclos`; data como `2026-09-10` |
| `Ciclos` | ordem, nome, semanas, entrega | nº de empresas por ciclo é contado em `Startups` |
| `Fases` | id, nome, estagio, individual, coletivo | S1–S6 |
| `AulasColetivas` | fase, total, prontas | |
| `PlanoTrabalho` | status, quantidade | status: `concluida`, `emExecucao`, `naoIniciada`, `semStatus` |
| `Maturidade` | dimensao, valor | 0 a 100 |
| `Mensal` | mes, startups_ativas, mentorias, aulas, empregos_gerados, familias_atingidas, fomento_captado_acum | **9 linhas** (mês 1–9, Jan–Set); `fomento_captado_acum` e `empregos_gerados` são acumulados do ano |
| `Parametros` | chave, valor | `acoesTransversais`, `totalAcoesIndividual`, `totalAcoesColetivo`, `graduandasPrevistas` |

> ⚠️ **O site é público.** Com a credencial configurada, `/api/incubadora` entrega nomes de
> startups e valores de fomento a qualquer pessoa com a URL. Ative a proteção de acesso do
> Vercel (senha ou SSO) **antes** de configurar as variáveis. O cache do endpoint é de 60 s
> (a planilha pode levar até 1 minuto para refletir uma edição).

## Documentação relacionada

- [ARCHITECTURE.md](ARCHITECTURE.md) — arquitetura técnica: camadas, contratos entre
  dados/período/views/gráficos, decisões deliberadas.
- [AGENTS.md](AGENTS.md) — convenções para quem (humano ou agente) for editar o código.
