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
index.html    apresentação: shell com as 12 telas (sidebar + topbar + conteúdo)
assets/css/    identidade visual, layout, responsivo, modo apresentação
assets/js/     utilitários compartilhados (tema, formatação, componentes,
               período, router, data-loader) + ECharts vendorizado em assets/js/vendor/
data/*.js      dados mockados de cada fonte (ver tabela acima)
views/*.js     uma view por tela, cada uma com render() + mount()
api/*.js       funções serverless (Vercel) da integração real (Agenda, O.S.,
               Incubadora via Google Sheets) — sem credencial, não muda nada no mock
equipe.html   painel da equipe: só a tela Incubadora, lendo a planilha Google Sheets
docs/          CSVs com o modelo da planilha da Incubadora
```

Cada dataset guarda **séries mensais** (Jan–Set/2026 no mock; no painel da equipe, Jan até o
mês corrente, vindo da planilha); nenhum KPI é digitado como total
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
| Incubadora & Jornada | **Planilha pronta** (`api/incubadora.js` lê a planilha Google Sheets da equipe; `equipe.html` é o painel de uso diário) — falta só a conta de serviço e as variáveis no Vercel; ver "Planilha da Incubadora" abaixo |
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

### Planilha da Incubadora e painel da equipe (Google Sheets, somente leitura)

A tela **Incubadora & Jornada** tem uma versão de uso diário para a equipe,
[`equipe.html`](equipe.html), que mostra **só essa tela** e lê tudo de uma planilha Google
Sheets. `index.html` (a apresentação com as 12 telas) continua 100% ilustrativo e **não**
busca a planilha, para não misturar dado real com dado de exemplo.

**Princípio: a planilha só tem cadastros e registros, nunca totais.** Cada número, gráfico,
cartão do Kanban e texto variável da tela é calculado em `api/_lib/montar-incubadora.js` a
partir das linhas: registrou uma mentoria, o KPI, o gráfico de cadência e o filtro de período
mudam juntos; mudou o ciclo de uma startup, o trilho, o Kanban e a distribuição por etapa
acompanham. Não há aba de "resumo" para manter em dia.

**Período = calendário real.** O seletor vai de janeiro do ano até o mês corrente (fuso de
São Paulo): "Acumulado {ano}", "Últimos 3 meses" e o mês atual. Para olhar um ano anterior,
preencha `ano` na aba `Config`.

| Aba | Colunas (1ª linha = cabeçalho) | O que alimenta no painel |
|---|---|---|
| `Startups` | id, nome, cnpj, setor, descricao, ciclo_atual, status, data_entrada, data_saida, responsavel, observacoes | Kanban (só `status` = Ativa), trilho e distribuição por ciclo, setores, KPI e série mensal de startups ativas (entrada ≤ fim do mês < saída), graduandas previstas (ativas no último ciclo) |
| `Mentorias` | data, startup_id, consultor, fase, tema, horas | KPI "Mentorias realizadas" e gráfico de cadência (por mês) |
| `AulasColetivas` | fase, semana, formato, atividade, elaborador, prazo_material, material_pronto, data_realizada | tabela de material pronto por fase; KPI "Aulas ministradas" e cadência contam `data_realizada` |
| `Diagnosticos` | data, startup_id, avaliador + 6 notas 0–100 (modelo_negocio, solucao_tecnologia, time_gestao, mercado_clientes, financeiro, propriedade_intelectual) | radar de maturidade: média do diagnóstico **mais recente** de cada startup ativa |
| `Fomento` | data, startup_id, fonte, descricao, valor | KPI de fomento (no período + acumulado do ano), fomento por setor, valor em cada cartão |
| `Empregos` | data, startup_id, variacao (+contratação / −desligamento), observacao | KPI de empregos e famílias atingidas (empregos × `multiplicador_familias`) |
| `PlanoTrabalho` | cod_finep, tarefa, responsavel, status, inicio, termino, prioridade | KPI "Entregas do plano concluídas" (contagem por status) |
| `Metodologia` | fase, semana, acao, tipo, periodicidade | gráfico de ações por fase (Individual × Coletivo) e nº de ações mapeadas |
| `Ciclos` | ordem, nome, semana_inicio, semana_fim, entrega | colunas do Kanban, trilho, cronograma de entregas, duração da jornada |
| `Fases` | id, nome, estagio, objetivo | nomes das fases S1–S6 |
| `Equipe` | nome, funcao, email, ativo | lista suspensa de consultor/responsável |
| `Listas` *(opcional)* | setores, status_startup, fontes_fomento, formatos_aula, status_tarefa, sim_nao | listas suspensas e ordem dos setores no painel |
| `Config` *(opcional)* | chave, valor, descricao | `ano` (vazio = ano atual), `multiplicador_familias` (padrão 1,6) |

Linhas inconsistentes (startup inexistente, ciclo ou status fora da lista, nota fora de
0–100, data futura, Ativa com data de saída, id repetido…) **não derrubam o painel**: a
linha é ignorada e aparece numa faixa amarela "A planilha tem N ponto(s) a conferir" no
topo do `equipe.html`, com aba e número da linha. O selo do topo mostra
"PLANILHA DA INCUBADORA · data" quando o dado é real, ou "DADOS ILUSTRATIVOS" (não conectada
/ falha ao ler) quando o painel caiu no mock de `data/incubadora.js`.

Os CSVs em [`docs/planilha-incubadora/`](docs/planilha-incubadora/) são o mesmo modelo
(com os nomes de responsáveis do plano de trabalho apagados) — servem para recriar a
planilha do zero, importando cada um como uma aba com o **mesmo nome do arquivo**. As abas
`Metodologia`, `Ciclos`, `Fases`, `AulasColetivas` e `PlanoTrabalho` vêm das planilhas
reais do projeto; `Startups`, `Mentorias`, `Diagnosticos`, `Fomento` e `Empregos` são
**exemplos coerentes**, para a equipe substituir.

Para ligar o painel à planilha:

1. **Conta de serviço**: no Google Cloud, criar um projeto, ativar a *Google Sheets API*,
   criar uma conta de serviço e baixar a chave JSON.
2. **Compartilhar a planilha** (como *Leitor*) com o e-mail da conta de serviço.
3. ⚠️ **Proteger o site antes**: ative a proteção de acesso do Vercel (senha ou SSO). O
   site é público e, com a credencial, `/api/incubadora` entrega nomes de startups e
   valores de fomento a qualquer pessoa com a URL.
4. **Variáveis no Vercel** (Settings → Environment Variables): `INCUBADORA_SHEET_ID`
   (trecho entre `/d/` e `/edit` da URL), `GOOGLE_SERVICE_ACCOUNT_EMAIL` (`client_email`
   do JSON) e `GOOGLE_SERVICE_ACCOUNT_KEY` (`private_key` do JSON). Fazer um redeploy.
5. Abrir `/api/incubadora` no site publicado (`"ok": true`) e depois `/equipe.html` — o selo
   deve ficar verde. O cache é de 60 s: uma edição na planilha aparece em até 1 minuto.

## Documentação relacionada

- [ARCHITECTURE.md](ARCHITECTURE.md) — arquitetura técnica: camadas, contratos entre
  dados/período/views/gráficos, decisões deliberadas.
- [AGENTS.md](AGENTS.md) — convenções para quem (humano ou agente) for editar o código.
