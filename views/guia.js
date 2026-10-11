// Tela "Como usar" do painel da equipe: tutorial da planilha para quem não é
// técnico. Os exemplos usam as startups, ciclos e datas reais do momento
// (APP_DATA.incubadora) — o texto ensina, os dados de exemplo nunca envelhecem.
// As colunas citadas aqui são as que api/_lib/montar-incubadora.js lê.
(function () {
  function somarDias(iso, n) {
    const d = new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86400000);
    return d.toISOString().slice(0, 10);
  }

  // Mini "planilha": cabeçalho igual à 1ª linha da aba + a linha de exemplo.
  function planilhaMini(aba, colunas, linhas) {
    const head = colunas.map((c) => `<th>${UI.esc(c)}</th>`).join("");
    const body = linhas
      .map((l, i) => `<tr><td class="pm-n">${i + 2}</td>${colunas.map((c) => `<td>${UI.esc(l[c] ?? "")}</td>`).join("")}</tr>`)
      .join("");
    return `
      <div class="planilha-mini">
        <div class="pm-aba">Aba <strong>${UI.esc(aba)}</strong></div>
        <div class="pm-scroll"><table><thead><tr><th class="pm-n">1</th>${head}</tr></thead><tbody>${body}</tbody></table></div>
      </div>`;
  }

  function tarefa({ id, icone, titulo, aba, quando, passos, exemplo, painel, aberta }) {
    return `
      <details class="tarefa" id="${id}" ${aberta ? "open" : ""}>
        <summary>
          <span class="tarefa-icone" aria-hidden="true">${icone}</span>
          <span class="tarefa-titulo">${UI.esc(titulo)}<span class="tarefa-quando">${UI.esc(quando)}</span></span>
          <span class="pill pill-navy">aba ${UI.esc(aba)}</span>
        </summary>
        <div class="tarefa-corpo">
          <ol class="passos">${passos.map((p) => `<li>${p}</li>`).join("")}</ol>
          ${exemplo || ""}
          <div class="tarefa-painel"><strong>Onde aparece no painel:</strong> ${painel}</div>
        </div>
      </details>`;
  }

  function render() {
    const I = APP_DATA.incubadora;
    const hoje = I.dataReferencia;
    const s = I.startups[0] || { id: "STU-01", nome: "Nome da startup", responsavel: "Consultor(a)", setor: "EdTech", cicloAtual: "Entrada" };
    const ciclos = I.ciclos.map((c) => c.nome);
    const proximoCiclo = ciclos[Math.min(ciclos.indexOf(s.cicloAtual) + 1, ciclos.length - 1)] || ciclos[0] || "";
    const alerta = I.parametros ? I.parametros.alertaDiasSemMentoria : 21;
    const b = (t) => `<strong>${UI.esc(t)}</strong>`;
    const col = (t) => `<code>${UI.esc(t)}</code>`;
    const dataAg = fmt.dataBr(somarDias(hoje, 3));
    const ontem = fmt.dataBr(somarDias(hoje, -1));
    const COL_MENTORIA = ["data", "startup_id", "consultor", "fase", "tema", "horas", "hora", "formato", "status"];

    const abrir = I.planilhaUrl
      ? `<a class="btn btn-primary" href="${UI.esc(I.planilhaUrl)}" target="_blank" rel="noopener">📄 Abrir a planilha da Incubadora</a>`
      : `<span class="pill pill-gray">A planilha ainda não está conectada a este painel — os dados mostrados são de exemplo.</span>`;

    const tarefas = [
      tarefa({
        id: "agendar",
        icone: "📅",
        titulo: "Agendar uma mentoria",
        quando: "sempre que marcar um horário com uma startup",
        aba: "Mentorias",
        aberta: true,
        passos: [
          `Abra a aba ${b("Mentorias")} e vá até a primeira linha vazia (no fim da lista).`,
          `Em ${col("data")}, digite a data do encontro (ex.: ${UI.esc(dataAg)}) e em ${col("hora")} o horário (ex.: 14:00).`,
          `Em ${col("startup_id")}, escolha a startup na lista suspensa (o código está na aba ${b("Startups")}).`,
          `Preencha ${col("consultor")}, ${col("tema")}, ${col("formato")} (Presencial ou Online) e a duração prevista em ${col("horas")}.`,
          `Em ${col("status")}, escolha ${b("Agendada")}. Pronto — em até 1 minuto ela aparece na agenda.`,
        ],
        exemplo: planilhaMini("Mentorias", COL_MENTORIA, [
          { data: dataAg, startup_id: s.id, consultor: s.responsavel, fase: "S2", tema: "Pitch de Validação", horas: "1,5", hora: "14:00", formato: "Presencial", status: "Agendada" },
        ]),
        painel: `Início → "Próximas mentorias"; Mentorias → calendário; e no cartão da startup, em "Próxima".`,
      }),
      tarefa({
        id: "realizada",
        icone: "✅",
        titulo: "Registrar que a mentoria aconteceu (ou foi cancelada)",
        quando: "no mesmo dia ou no dia seguinte",
        aba: "Mentorias",
        passos: [
          `Encontre a linha da mentoria que estava ${b("Agendada")} (use Ctrl+F com o nome ou o código da startup).`,
          `Troque ${col("status")} para ${b("Realizada")} — ou ${b("Cancelada")}, se não aconteceu. Ajuste ${col("horas")} se durou diferente.`,
          `Mentoria que aconteceu sem ter sido agendada? Inclua a linha direto com status ${b("Realizada")}.`,
          `Se esquecer, a mentoria aparece como ${b("A confirmar")} no painel e na faixa amarela até alguém atualizar.`,
        ],
        exemplo: planilhaMini("Mentorias", COL_MENTORIA, [
          { data: ontem, startup_id: s.id, consultor: s.responsavel, fase: "S2", tema: "Pitch de Validação", horas: "1,5", hora: "14:00", formato: "Presencial", status: "Realizada" },
        ]),
        painel: `KPI "Mentorias realizadas", gráfico de cadência, "Última mentoria" do cartão e o alerta de ${fmt.num(alerta)} dias sem mentoria.`,
      }),
      tarefa({
        id: "nova-startup",
        icone: "🚀",
        titulo: "Cadastrar uma nova startup",
        quando: "quando a startup entra na incubadora",
        aba: "Startups",
        passos: [
          `Na aba ${b("Startups")}, use a primeira linha vazia.`,
          `Crie um ${col("id")} novo seguindo a sequência (ex.: se o último é STU-39, use STU-40). ${b("Nunca reaproveite um código.")}`,
          `Preencha ${col("nome")}, ${col("setor")} (lista), ${col("descricao")} (uma frase sobre o que a startup faz) e ${col("responsavel")}.`,
          `Em ${col("ciclo_atual")} escolha ${b(ciclos[0] || "Entrada")}, em ${col("status")} escolha ${b("Ativa")} e em ${col("data_entrada")} a data de hoje.`,
          `Deixe ${col("data_saida")} ${b("vazia")} — ela só é preenchida quando a startup gradua ou sai.`,
        ],
        exemplo: planilhaMini("Startups", ["id", "nome", "setor", "descricao", "ciclo_atual", "status", "data_entrada", "data_saida", "responsavel"], [
          { id: "STU-40", nome: "Nova Startup Ltda", setor: s.setor, descricao: "O que a startup faz, em uma frase", ciclo_atual: ciclos[0] || "Entrada", status: "Ativa", data_entrada: fmt.dataBr(hoje), data_saida: "", responsavel: s.responsavel },
        ]),
        painel: "Início (novo cartão), Kanban e trilho dos ciclos, setores, KPI de startups ativas.",
      }),
      tarefa({
        id: "mudar-ciclo",
        icone: "➡️",
        titulo: "Avançar a startup para o próximo ciclo",
        quando: "quando ela conclui a entrega do ciclo atual",
        aba: "Startups",
        passos: [
          `Na aba ${b("Startups")}, encontre a linha da startup.`,
          `Troque ${col("ciclo_atual")} pelo próximo ciclo da lista (a ordem dos ciclos está na aba ${b("Ciclos")}).`,
          "Não mexa nas outras colunas. O painel move o cartão sozinho.",
        ],
        exemplo: planilhaMini("Startups", ["id", "nome", "ciclo_atual", "status"], [{ id: s.id, nome: s.nome, ciclo_atual: `${s.cicloAtual} → ${proximoCiclo}`, status: "Ativa" }]),
        painel: "Barra de jornada do cartão, Kanban, trilho e distribuição por etapa.",
      }),
      tarefa({
        id: "saida",
        icone: "🎓",
        titulo: "Graduar ou desligar uma startup",
        quando: "no fim da jornada ou se ela sair do programa",
        aba: "Startups",
        passos: [
          `Troque ${col("status")} para ${b("Graduada")} ou ${b("Desligada")}.`,
          `Preencha ${col("data_saida")} com a data em que isso aconteceu (tem de ser ${b("depois")} da data de entrada).`,
          `Anote o motivo em ${col("observacoes")}. ${b("Não apague a linha")}: ela mantém o histórico dos meses em que a startup esteve ativa.`,
        ],
        exemplo: planilhaMini("Startups", ["id", "nome", "status", "data_entrada", "data_saida", "observacoes"], [
          { id: s.id, nome: s.nome, status: "Graduada", data_entrada: fmt.dataBr(s.dataEntrada || hoje), data_saida: fmt.dataBr(hoje), observacoes: "Concluiu a jornada" },
        ]),
        painel: "Sai do Kanban e dos ativos de hoje, mas continua contando nos meses anteriores.",
      }),
      tarefa({
        id: "diagnostico",
        icone: "🧭",
        titulo: "Registrar um diagnóstico de maturidade",
        quando: "na entrada e a cada reavaliação",
        aba: "Diagnosticos",
        passos: [
          `Uma linha por avaliação, com ${col("data")}, ${col("startup_id")} e ${col("avaliador")}.`,
          "Dê uma nota de 0 a 100 em cada uma das 6 dimensões.",
          "Não apague diagnósticos antigos — o painel sempre usa o mais recente de cada startup.",
        ],
        exemplo: planilhaMini("Diagnosticos", ["data", "startup_id", "avaliador", "modelo_negocio", "solucao_tecnologia", "time_gestao", "mercado_clientes", "financeiro", "propriedade_intelectual"], [
          { data: fmt.dataBr(hoje), startup_id: s.id, avaliador: s.responsavel, modelo_negocio: 60, solucao_tecnologia: 55, time_gestao: 50, mercado_clientes: 45, financeiro: 40, propriedade_intelectual: 30 },
        ]),
        painel: "Radar de maturidade (Indicadores) e nota de maturidade no cartão da startup.",
      }),
      tarefa({
        id: "fomento",
        icone: "💰",
        titulo: "Registrar fomento captado",
        quando: "quando um recurso é aprovado ou recebido",
        aba: "Fomento",
        passos: [
          `Uma linha por captação: ${col("data")}, ${col("startup_id")}, ${col("fonte")} (lista), ${col("descricao")} e ${col("valor")}.`,
          `Em ${col("valor")} digite só o número (ex.: 50000) — sem "R$" e sem pontos.`,
        ],
        exemplo: planilhaMini("Fomento", ["data", "startup_id", "fonte", "descricao", "valor"], [{ data: fmt.dataBr(hoje), startup_id: s.id, fonte: "Edital FINEP", descricao: "Subvenção aprovada", valor: "50000" }]),
        painel: "KPI de fomento (no período e acumulado), fomento por setor e no cartão da startup.",
      }),
      tarefa({
        id: "empregos",
        icone: "👥",
        titulo: "Registrar contratações e desligamentos",
        quando: "quando a startup contrata ou desliga alguém",
        aba: "Empregos",
        passos: [
          `Uma linha por movimento: ${col("variacao")} = ${b("+1")} para cada contratação, ${b("-1")} para cada desligamento (pode ser +3, -2…).`,
          `Use ${col("observacao")} para o cargo ou o motivo.`,
        ],
        exemplo: planilhaMini("Empregos", ["data", "startup_id", "variacao", "observacao"], [{ data: fmt.dataBr(hoje), startup_id: s.id, variacao: "2", observacao: "Contratação de 2 desenvolvedores" }]),
        painel: "KPI de empregos gerados e famílias atingidas (Indicadores) e no cartão da startup.",
      }),
      tarefa({
        id: "aulas",
        icone: "🎓",
        titulo: "Aulas coletivas: material pronto e aula dada",
        quando: "ao terminar o material e no dia da aula",
        aba: "AulasColetivas",
        passos: [
          `Quando o material estiver pronto, troque ${col("material_pronto")} para ${b("Sim")}.`,
          `Depois que a aula acontecer, preencha ${col("data_realizada")} com a data. Sem essa data, a aula não conta como ministrada.`,
        ],
        exemplo: planilhaMini("AulasColetivas", ["fase", "semana", "formato", "atividade", "material_pronto", "data_realizada"], [{ fase: "S2", semana: 4, formato: "Presencial", atividade: "Modelagem de Negócios", material_pronto: "Sim", data_realizada: fmt.dataBr(hoje) }]),
        painel: "KPI de aulas ministradas, gráfico de cadência e tabela de material pronto por fase.",
      }),
      tarefa({
        id: "plano",
        icone: "🗂️",
        titulo: "Atualizar o plano de trabalho",
        quando: "quando uma tarefa do plano muda de situação",
        aba: "PlanoTrabalho",
        passos: [`Troque ${col("status")} da tarefa para ${b("Concluída")}, ${b("Em execução")} ou ${b("Não iniciada")}.`],
        painel: 'KPI "Entregas do plano concluídas" (Indicadores).',
      }),
    ].join("");

    const avisos = [
      ["startup_id \"STU-99\" não existe na aba Startups", "O código foi digitado errado ou a startup não foi cadastrada. Use a lista suspensa."],
      ["data inválida", "Digite a data como 14/10/2026 (dia/mês/ano). Texto como \"amanhã\" não funciona."],
      ["agendada para … já passou", "A mentoria aconteceu? Troque o status para Realizada. Não aconteceu? Cancelada."],
      ["está Ativa mas tem data_saida", "Startup ativa não tem data de saída: apague a data, ou troque o status para Graduada/Desligada."],
      ["data_saida anterior à data_entrada", "Confira as duas datas — muitas vezes é um arrasto acidental que criou uma sequência de datas."],
      ["notas devem ser números de 0 a 100", "Em Diagnosticos, cada nota tem de ser um número entre 0 e 100."],
    ];

    return `
      <div class="card guia-hero">
        <div class="guia-fluxo">
          <div class="guia-passo"><span>1</span><div><strong>Você registra na planilha</strong><p>Cada acontecimento vira uma linha: uma mentoria, uma startup nova, uma captação.</p></div></div>
          <div class="guia-seta" aria-hidden="true">→</div>
          <div class="guia-passo"><span>2</span><div><strong>O painel lê sozinho</strong><p>Em até 1 minuto. Não precisa exportar, enviar nem avisar ninguém.</p></div></div>
          <div class="guia-seta" aria-hidden="true">→</div>
          <div class="guia-passo"><span>3</span><div><strong>Todos veem o mesmo número</strong><p>Totais, gráficos e alertas são calculados — nunca digitados.</p></div></div>
        </div>
        <div class="guia-acoes">${abrir}</div>
      </div>

      ${UI.sectionCard({
        eyebrow: "Antes de começar",
        title: "5 regras de ouro",
        bodyHtml: `
          <ul class="regras">
            <li><span>1</span><div><strong>Uma linha = um registro.</strong> Não junte duas mentorias na mesma linha; não escreva totais em lugar nenhum.</div></li>
            <li><span>2</span><div><strong>Nunca mude o nome das abas nem a 1ª linha (cabeçalho).</strong> É por eles que o painel encontra os dados. Colunas extras, à direita, podem.</div></li>
            <li><span>3</span><div><strong>Use as listas suspensas</strong> (a setinha na célula) para startup, ciclo, status, setor e consultor — evita erro de digitação.</div></li>
            <li><span>4</span><div><strong>Datas sempre como dia/mês/ano</strong> (14/10/2026). Cuidado ao arrastar o canto de uma célula de data: o Sheets cria uma sequência (14/10, 15/10, 16/10…).</div></li>
            <li><span>5</span><div><strong>Não apague o histórico.</strong> Startup que saiu muda de status; mentoria que não aconteceu vira Cancelada.</div></li>
          </ul>`,
      })}

      ${UI.sectionCard({
        eyebrow: "Passo a passo",
        title: "Tarefas do dia a dia",
        desc: "Toque em uma tarefa para abrir as instruções. Os exemplos usam dados reais do painel.",
        bodyHtml: `<div class="tarefas">${tarefas}</div>`,
      })}

      <div class="grid grid-2">
        ${UI.sectionCard({
          eyebrow: "Faixa amarela no topo",
          title: "O painel avisou algo? Veja como resolver",
          desc: "A linha com problema fica de fora dos números até ser corrigida — o resto do painel continua funcionando. O aviso diz a aba e o número da linha.",
          bodyHtml: `<div class="avisos-guia">${avisos.map(([m, r]) => `<div><div class="aviso-msg">“…${UI.esc(m)}…”</div><div>${UI.esc(r)}</div></div>`).join("")}</div>`,
        })}
        ${UI.sectionCard({
          eyebrow: "Dúvidas comuns",
          title: "Perguntas frequentes",
          bodyHtml: `
            <div class="faq">
              <details><summary>Editei a planilha e o painel não mudou.</summary><p>Espere 1 minuto e recarregue a página (F5 ou puxe a tela para baixo no celular). Se continuar, veja se apareceu algo na faixa amarela.</p></details>
              <details><summary>O que é "precisa de atenção"?</summary><p>Startup ativa sem mentoria realizada há mais de ${fmt.num(alerta)} dias e sem nenhuma agendada. Esse limite fica na aba <strong>Config</strong> (alerta_dias_sem_mentoria).</p></details>
              <details><summary>Posso usar filtros e ordenar a planilha?</summary><p>Pode. Prefira "Criar visualização com filtro" (Dados → Visualizações de filtro), que não bagunça a tela dos colegas.</p></details>
              <details><summary>Posso apagar uma linha?</summary><p>Só se ela foi digitada por engano. Para startups e mentorias reais, mude o status em vez de apagar.</p></details>
              <details><summary>A mentoria não teve horário definido.</summary><p>Tudo bem: <code>hora</code>, <code>formato</code> e <code>horas</code> são opcionais. Sem <code>status</code>, o painel considera Realizada se a data já passou e Agendada se ainda vai acontecer.</p></details>
              <details><summary>Quem pode ver o painel?</summary><p>Quem tem o link do painel. Os dados só vêm da planilha, que continua privada — compartilhe a planilha apenas com a equipe.</p></details>
            </div>`,
        })}
      </div>`;
  }

  window.VIEW_GUIA = {
    title: "Como usar a planilha",
    subtitle: "Guia rápido para a equipe — o que registrar, onde e quando",
    render,
  };
})();
