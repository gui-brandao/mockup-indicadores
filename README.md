# Painel Consolidado — Parque Tecnológico

Mockup de apresentação de um **painel único** que consolida o que acontece no Parque
Tecnológico, reunindo a leitura de sistemas hoje separados: **Sistema de Agenda**,
**Sistema de O.S.**, **Zoho CRM** (onde atendimento = interação), **AVA** e o plano de
trabalho **FINEP** da incubadora.

> ⚠️ **Isto é um mockup, não um sistema integrado.** Não há backend, API nem automação
> entre sistemas — os dados vivem em arquivos `.js` estáticos (`/data`). Números reais
> extraídos dos prints e das planilhas do projeto convivem com estimativas plausíveis
> onde ainda não existe integração ou histórico. O objetivo é validar a ideia do produto
> antes de investir em integração real.

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
index.html              shell único (sidebar + topbar + área de conteúdo)
assets/css/tokens.css    variáveis da identidade visual (cores, raios, sombras)
assets/css/app.css       layout, componentes, responsivo, modo apresentação
assets/js/vendor/        ECharts 5.5.1 (UMD), vendorizado — funciona offline
assets/js/theme.js       paleta e defaults de gráfico compartilhados
assets/js/format.js      formatação pt-BR (número, %, data)
assets/js/components.js  kpiCard, sectionCard, progressBar, dataTable, etc.
assets/js/period.js      estado do seletor de período + agregação das séries mensais
assets/js/router.js      hash router (troca de tela sem reload)
assets/js/app.js         bootstrap: sidebar, período, apresentação, exportar
data/*.js                dados mockados de cada fonte (ver tabela acima)
views/*.js               uma view por tela, cada uma com render() + mount()
```

Cada dataset guarda **séries mensais** (Jan–Set/2026); nenhum KPI é digitado como total
fixo — tudo é somado em runtime pelo `period.js` conforme o período escolhido, então os
números nunca divergem entre a Visão Geral e as telas de detalhe.

## Como isto vira sistema real

| Bloco do mockup | Fonte real a integrar |
|---|---|
| Espaços & Agenda | API do Sistema de Agenda (já expõe indicadores — ver chip "API" no header do sistema atual) |
| Operação (O.S.) | Banco/API do Sistema de O.S. (mesmos indicadores já calculados hoje) |
| Relacionamento (CRM) | Zoho CRM API/COQL — módulo de Interações e Deals |
| Educação & Visitas | Export do AVA + planilha de roteiros pedagógicos, migrando para banco próprio |
| Incubadora & Jornada | Planilha `Ações dos consultores` e `Cronograma Incubadora` migrando para um board (Zoho Projects ou similar), com webhook para o painel |
| Metas FINEP | Planilha `Acompanhamento de Metas` migrando para uma base única, com fórmula de "realizado" vindo dos módulos acima (evita preenchimento manual) |
| Catraca | Integração direta com o controlador de acesso físico do Parque |

O próximo passo natural é priorizar 1–2 integrações (Agenda e O.S. já têm API, então são
o caminho mais curto) e manter o restante como "mockup" até termos volume que justifique
a integração automatizada.
