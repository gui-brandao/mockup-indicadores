// Converte a planilha operacional da Incubadora no objeto window.APP_DATA.incubadora
// (mesmo formato de data/incubadora.js). Função pura — sem rede, sem relógio:
// a data de referência ("hoje") é parâmetro, para o resultado ser reproduzível.
//
// A planilha só tem cadastros e registros (startups, mentorias, aulas,
// diagnósticos, captações de fomento, contratações, metodologia, plano de
// trabalho). Todo número do painel — contagens, médias, séries mensais — é
// calculado aqui; nada é digitado como total. Inconsistências viram `avisos`
// (a linha problemática é ignorada), nunca derrubam a tela.
//
// Entrada: { NomeDaAba: [ { coluna: valor } ] } com colunas em snake_case
// minúsculo (cabeçalho da planilha). Valores podem vir como número/texto da
// Sheets API (datas como número serial) ou só texto (CSV).

const ABAS_OBRIGATORIAS = [
  "Startups", "Ciclos", "Fases", "Metodologia", "AulasColetivas", "PlanoTrabalho",
  "Mentorias", "Diagnosticos", "Fomento", "Empregos",
];
const ABAS_OPCIONAIS = ["Config", "Listas"];

const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES_LONGOS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const DIMENSOES = [
  ["modelo_negocio", "Modelo de negócio"],
  ["solucao_tecnologia", "Solução / Tecnologia"],
  ["time_gestao", "Time e gestão"],
  ["mercado_clientes", "Mercado e clientes"],
  ["financeiro", "Financeiro"],
  ["propriedade_intelectual", "Propriedade intelectual"],
];
const STATUS_STARTUP = ["Ativa", "Graduada", "Desligada"];
const STATUS_MENTORIA = ["Realizada", "Agendada", "Cancelada"];
const FORMATOS_MENTORIA = ["Presencial", "Online"];
const ALERTA_DIAS_PADRAO = 21;
const STATUS_PLANO = { "concluida": "concluida", "em execucao": "emExecucao", "nao iniciada": "naoIniciada" };
const MAX_AVISOS = 60;

function texto(v) {
  return v === null || v === undefined ? "" : String(v).trim();
}

function semAcento(s) {
  return texto(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Aceita número, "1234", "1234,5" e "1.234,5" (pt-BR). Vazio/inválido → null.
function numero(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = texto(v).replace(/\s/g, "").replace(/^R\$/, "");
  if (!s) return null;
  const normal = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normal);
  return Number.isFinite(n) ? n : null;
}

// Aceita "2026-09-10", "10/09/2026" e o número serial do Google Sheets.
// Devolve "AAAA-MM-DD" ou "" se vazio/inválido.
function dataIso(v) {
  if (typeof v === "number" && Number.isFinite(v)) {
    return new Date(Date.UTC(1899, 11, 30) + Math.round(v) * 86400000).toISOString().slice(0, 10);
  }
  const s = texto(v);
  if (!s) return "";
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (br) return `${br[3]}-${br[2].padStart(2, "0")}-${br[1].padStart(2, "0")}`;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? `${iso[1]}-${iso[2]}-${iso[3]}` : "";
}

// Aceita "14:00", "14h", "14h30", 14 e a fração de dia do Google Sheets
// (0,5833 = 14:00; também data+hora). Devolve "HH:MM", "" se vazio ou null
// se inválido.
function hora(v) {
  const doisDigitos = (n) => String(n).padStart(2, "0");
  if (typeof v === "number" && Number.isFinite(v)) {
    if (Number.isInteger(v)) return v >= 0 && v <= 23 ? `${doisDigitos(v)}:00` : null;
    const minutos = Math.round((v - Math.floor(v)) * 1440) % 1440;
    return `${doisDigitos(Math.floor(minutos / 60))}:${doisDigitos(minutos % 60)}`;
  }
  const s = texto(v).toLowerCase().replace(/\s/g, "");
  if (!s) return "";
  const m = s.match(/^(\d{1,2})(?:[:h](\d{2}))?(?::\d{2})?h?$/);
  if (!m || Number(m[1]) > 23 || Number(m[2] || 0) > 59) return null;
  return `${doisDigitos(Number(m[1]))}:${m[2] || "00"}`;
}

function dataBr(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function diasEntre(deIso, ateIso) {
  return Math.round((Date.parse(`${ateIso}T00:00:00Z`) - Date.parse(`${deIso}T00:00:00Z`)) / 86400000);
}

function fimDoMes(ano, mes) {
  return new Date(Date.UTC(ano, mes, 0)).toISOString().slice(0, 10);
}

function montarIncubadora(abas, hoje) {
  const avisos = [];
  const avisar = (msg) => avisos.push(msg);
  for (const nome of ABAS_OBRIGATORIAS) {
    if (!Array.isArray(abas[nome])) throw new Error(`Aba "${nome}" não encontrada na planilha da Incubadora`);
  }
  for (const nome of ABAS_OPCIONAIS) if (!Array.isArray(abas[nome])) abas[nome] = [];
  const hojeIso = dataIso(hoje);
  if (!hojeIso) throw new Error("Data de referência inválida");

  // ---------------------------------------------------------------- período
  const config = {};
  abas.Config.forEach((r) => {
    if (texto(r.chave)) config[texto(r.chave)] = r.valor;
  });
  const anoHoje = Number(hojeIso.slice(0, 4));
  let ano = numero(config.ano) || anoHoje;
  if (ano > anoHoje) {
    avisar(`Config: ano ${ano} ainda não começou — usando ${anoHoje}`);
    ano = anoHoje;
  }
  const mesReferencia = ano === anoHoje ? Number(hojeIso.slice(5, 7)) : 12;
  const inicioAno = `${ano}-01-01`;
  // Corte de cada mês: último dia do mês, ou hoje no mês corrente.
  const cortes = Array.from({ length: mesReferencia }, (_, i) => {
    const fim = fimDoMes(ano, i + 1);
    return fim > hojeIso ? hojeIso : fim;
  });
  const mesDe = (iso) => (iso >= inicioAno && iso <= cortes[cortes.length - 1] ? Number(iso.slice(5, 7)) - 1 : -1);
  const multiplicadorFamilias = numero(config.multiplicador_familias) ?? 1.6;
  const alertaDiasSemMentoria = numero(config.alerta_dias_sem_mentoria) || ALERTA_DIAS_PADRAO;

  // ---------------------------------------------------------------- listas
  const setoresLista = abas.Listas.map((r) => texto(r.setores)).filter(Boolean);
  const fontesLista = abas.Listas.map((r) => texto(r.fontes_fomento)).filter(Boolean);

  // ---------------------------------------------------------------- ciclos e fases
  const ciclosBase = abas.Ciclos.filter((c) => texto(c.nome))
    .sort((a, b) => (numero(a.ordem) ?? 0) - (numero(b.ordem) ?? 0))
    .map((c) => {
      const ini = numero(c.semana_inicio);
      const fim = numero(c.semana_fim) ?? ini;
      const semanas = ini === null ? "" : ini === fim ? `Semana ${ini}` : `Semanas ${ini} a ${fim}`;
      return { nome: texto(c.nome), semanas, entrega: texto(c.entrega) };
    });
  const nomesCiclo = new Set(ciclosBase.map((c) => c.nome));
  const ultimoCiclo = ciclosBase.length ? ciclosBase[ciclosBase.length - 1].nome : "";

  const fasesBase = abas.Fases.filter((f) => texto(f.id)).map((f) => ({
    id: texto(f.id).toUpperCase(),
    nome: texto(f.nome),
    estagio: texto(f.estagio),
  }));
  const fasesJornada = fasesBase.filter((f) => f.id !== "TRANSVERSAL");
  const idsFase = new Set(fasesBase.map((f) => f.id));

  // ---------------------------------------------------------------- startups
  const porId = new Map();
  abas.Startups.forEach((r, i) => {
    const linha = `Startups, linha ${i + 2}`;
    const nome = texto(r.nome);
    if (!nome) {
      if (Object.values(r).some((v) => texto(v))) avisar(`${linha}: sem nome — linha ignorada`);
      return;
    }
    const id = texto(r.id);
    if (!id) return avisar(`${linha}: "${nome}" sem id — linha ignorada`);
    if (porId.has(id)) return avisar(`${linha}: id "${id}" repetido — linha ignorada`);
    const entrada = dataIso(r.data_entrada);
    if (!entrada) return avisar(`${linha}: "${nome}" sem data_entrada válida — linha ignorada`);
    if (entrada > hojeIso) return avisar(`${linha}: "${nome}" com data_entrada no futuro — linha ignorada`);
    let status = STATUS_STARTUP.find((s) => semAcento(s) === semAcento(r.status));
    if (!status) {
      avisar(`${linha}: status "${texto(r.status)}" inválido (use Ativa, Graduada ou Desligada) — tratada como Ativa`);
      status = "Ativa";
    }
    let saida = dataIso(r.data_saida);
    if (status === "Ativa" && saida) {
      avisar(`${linha}: "${nome}" está Ativa mas tem data_saida — data_saida ignorada`);
      saida = "";
    }
    if (status !== "Ativa" && !saida) {
      avisar(`${linha}: "${nome}" está ${status} sem data_saida — fora do histórico de ativas`);
      saida = entrada;
    }
    if (saida && saida < entrada) {
      avisar(`${linha}: "${nome}" tem data_saida (${dataBr(saida)}) anterior à data_entrada (${dataBr(entrada)}) — confira as datas`);
      saida = entrada;
    }
    const ciclo = texto(r.ciclo_atual);
    if (!nomesCiclo.has(ciclo)) avisar(`${linha}: ciclo_atual "${ciclo}" não existe na aba Ciclos`);
    const setor = texto(r.setor);
    if (setoresLista.length && !setoresLista.includes(setor)) avisar(`${linha}: setor "${setor}" fora da lista da aba Listas`);
    porId.set(id, {
      id, nome, setor, status, entrada, saida, cicloAtual: ciclo,
      descricaoAtual: texto(r.descricao),
      responsavel: texto(r.responsavel),
      fomentoCaptado: 0,
      empregosGerados: 0,
      mentoriasRealizadas: 0,
      ultimaMentoria: "",
      proximaMentoria: null,
    });
  });
  const startupsTodas = [...porId.values()];
  const ativas = startupsTodas.filter((s) => s.status === "Ativa");

  // Registro válido de uma aba ligada a startup: data no passado e id conhecido.
  function registros(aba, aoLer) {
    abas[aba].forEach((r, i) => {
      if (!Object.values(r).some((v) => texto(v))) return;
      const linha = `${aba}, linha ${i + 2}`;
      const data = dataIso(r.data);
      if (!data) return avisar(`${linha}: data inválida — linha ignorada`);
      if (data > hojeIso) return avisar(`${linha}: data no futuro (${data}) — linha ignorada`);
      const startup = porId.get(texto(r.startup_id));
      if (!startup) return avisar(`${linha}: startup_id "${texto(r.startup_id)}" não existe na aba Startups — linha ignorada`);
      aoLer(r, data, startup, linha);
    });
  }

  // ---------------------------------------------------------------- mentorias
  // Uma linha por mentoria, realizada ou agendada (é o cronograma da equipe).
  // Sem status: data até hoje = Realizada, data futura = Agendada. Só as
  // realizadas contam nos indicadores; agendadas montam a agenda.
  const mentorias = new Array(mesReferencia).fill(0);
  const agenda = [];
  abas.Mentorias.forEach((r, i) => {
    if (!Object.values(r).some((v) => texto(v))) return;
    const linha = `Mentorias, linha ${i + 2}`;
    const data = dataIso(r.data);
    if (!data) return avisar(`${linha}: data inválida — linha ignorada`);
    const startup = porId.get(texto(r.startup_id));
    if (!startup) return avisar(`${linha}: startup_id "${texto(r.startup_id)}" não existe na aba Startups — linha ignorada`);
    let status = STATUS_MENTORIA.find((s) => semAcento(s) === semAcento(r.status));
    if (texto(r.status) && !status) avisar(`${linha}: status "${texto(r.status)}" inválido (use Agendada, Realizada ou Cancelada) — deduzido pela data`);
    if (!status) status = data <= hojeIso ? "Realizada" : "Agendada";
    if (status === "Realizada" && data > hojeIso) {
      avisar(`${linha}: mentoria de ${startup.nome} marcada como Realizada, mas ${dataBr(data)} ainda não chegou — tratada como Agendada`);
      status = "Agendada";
    }
    const aConfirmar = status === "Agendada" && data < hojeIso;
    if (aConfirmar) avisar(`${linha}: mentoria de ${startup.nome} agendada para ${dataBr(data)} já passou — marque como Realizada ou Cancelada`);
    let horario = hora(r.hora);
    if (horario === null) {
      avisar(`${linha}: hora "${texto(r.hora)}" inválida (use o formato 14:00)`);
      horario = "";
    }
    const formato = FORMATOS_MENTORIA.find((f) => semAcento(f) === semAcento(r.formato)) || texto(r.formato);
    const registro = {
      data,
      hora: horario,
      startupId: startup.id,
      startup: startup.nome,
      consultor: texto(r.consultor),
      fase: texto(r.fase).toUpperCase(),
      tema: texto(r.tema),
      formato,
      horas: numero(r.horas),
      status,
      aConfirmar,
    };
    if (status === "Realizada") {
      const m = mesDe(data);
      if (m >= 0) mentorias[m]++;
      startup.mentoriasRealizadas++;
      if (data > startup.ultimaMentoria) startup.ultimaMentoria = data;
    }
    if (status === "Agendada" && !aConfirmar) {
      const atual = startup.proximaMentoria;
      if (!atual || `${data} ${horario}` < `${atual.data} ${atual.hora}`) {
        startup.proximaMentoria = { data, hora: horario, consultor: registro.consultor, tema: registro.tema, formato };
      }
    }
    // O cronograma leva o ano exibido e tudo o que ainda vai acontecer.
    if (data >= inicioAno || data >= hojeIso) agenda.push(registro);
  });
  agenda.sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`));

  // ---------------------------------------------------------------- fomento
  const fomentoNoAno = [];
  registros("Fomento", (r, data, startup, linha) => {
    const valor = numero(r.valor);
    if (valor === null || valor < 0) return avisar(`${linha}: valor inválido — linha ignorada`);
    if (fontesLista.length && texto(r.fonte) && !fontesLista.includes(texto(r.fonte))) avisar(`${linha}: fonte "${texto(r.fonte)}" fora da lista da aba Listas`);
    startup.fomentoCaptado += valor;
    if (data >= inicioAno) fomentoNoAno.push([data, valor]);
  });
  const fomentoCaptadoMensal = cortes.map((corte) => fomentoNoAno.filter(([d]) => d <= corte).reduce((s, [, v]) => s + v, 0));

  // ---------------------------------------------------------------- empregos
  const movimentos = [];
  registros("Empregos", (r, data, startup, linha) => {
    const variacao = numero(r.variacao);
    if (variacao === null || !Number.isInteger(variacao)) return avisar(`${linha}: variacao deve ser um número inteiro — linha ignorada`);
    startup.empregosGerados += variacao;
    if (data >= inicioAno) movimentos.push([data, variacao]);
  });
  // Acumulado do ano (como o fomento): PERIOD.delta() dá o saldo de qualquer recorte.
  const empregosGeradosMensal = cortes.map((corte) => movimentos.filter(([d]) => d <= corte).reduce((s, [, v]) => s + v, 0));
  const familiasAtingidasMensal = empregosGeradosMensal.map((e) => Math.round(e * multiplicadorFamilias));

  // ---------------------------------------------------------------- diagnósticos (mais recente por startup)
  const ultimoDiag = new Map();
  registros("Diagnosticos", (r, data, startup, linha) => {
    const notas = DIMENSOES.map(([coluna]) => numero(r[coluna]));
    if (notas.some((n) => n === null || n < 0 || n > 100)) return avisar(`${linha}: notas devem ser números de 0 a 100 — linha ignorada`);
    const atual = ultimoDiag.get(startup.id);
    if (!atual || data >= atual.data) ultimoDiag.set(startup.id, { data, notas });
  });
  const diagsAtivas = ativas.map((s) => ultimoDiag.get(s.id)).filter(Boolean);
  const mediaDiag = (d) => Math.round(d.notas.reduce((s, n) => s + n, 0) / d.notas.length);
  const maturidade = DIMENSOES.map(([, rotulo], i) => ({
    dimensao: rotulo,
    valor: diagsAtivas.length ? Math.round(diagsAtivas.reduce((s, d) => s + d.notas[i], 0) / diagsAtivas.length) : 0,
  }));

  // ---------------------------------------------------------------- aulas coletivas
  const aulasPorFase = new Map(fasesJornada.map((f) => [f.id, { total: 0, prontas: 0 }]));
  const aulas = new Array(mesReferencia).fill(0);
  abas.AulasColetivas.forEach((r, i) => {
    if (!texto(r.atividade) && !texto(r.fase)) return;
    const linha = `AulasColetivas, linha ${i + 2}`;
    const fase = texto(r.fase).toUpperCase();
    const contagem = aulasPorFase.get(fase);
    if (!contagem) return avisar(`${linha}: fase "${texto(r.fase)}" não existe na aba Fases — linha ignorada`);
    contagem.total++;
    if (semAcento(r.material_pronto) === "sim") contagem.prontas++;
    const realizada = dataIso(r.data_realizada);
    if (texto(r.data_realizada) && !realizada) avisar(`${linha}: data_realizada inválida`);
    if (realizada > hojeIso) avisar(`${linha}: data_realizada no futuro — não contada como ministrada`);
    else if (realizada && mesDe(realizada) >= 0) aulas[mesDe(realizada)]++;
  });

  // ---------------------------------------------------------------- metodologia
  const acoesPorFase = new Map(fasesBase.map((f) => [f.id, { individual: 0, coletivo: 0, total: 0 }]));
  let totalAcoesIndividual = 0, totalAcoesColetivo = 0, totalAcoes = 0;
  abas.Metodologia.forEach((r, i) => {
    if (!texto(r.acao) && !texto(r.fase)) return;
    const fase = texto(r.fase).toUpperCase();
    const contagem = acoesPorFase.get(fase);
    if (!contagem) return avisar(`Metodologia, linha ${i + 2}: fase "${texto(r.fase)}" não existe na aba Fases — linha ignorada`);
    if (!texto(r.acao)) avisar(`Metodologia, linha ${i + 2}: ação sem descrição (contada mesmo assim)`);
    const tipo = semAcento(r.tipo);
    totalAcoes++;
    contagem.total++;
    if (tipo === "individual") { contagem.individual++; totalAcoesIndividual++; }
    if (tipo === "coletivo") { contagem.coletivo++; totalAcoesColetivo++; }
  });

  // ---------------------------------------------------------------- plano de trabalho
  const planoTrabalho = { concluida: 0, emExecucao: 0, naoIniciada: 0, semStatus: 0 };
  abas.PlanoTrabalho.forEach((r, i) => {
    if (!texto(r.tarefa)) return;
    const status = semAcento(r.status);
    if (!status) planoTrabalho.semStatus++;
    else if (STATUS_PLANO[status]) planoTrabalho[STATUS_PLANO[status]]++;
    else {
      avisar(`PlanoTrabalho, linha ${i + 2}: status "${texto(r.status)}" desconhecido — contado como sem status`);
      planoTrabalho.semStatus++;
    }
  });

  // ---------------------------------------------------------------- séries de startups ativas
  const startupsAtivasMensal = cortes.map((corte) => startupsTodas.filter((s) => s.entrada <= corte && (!s.saida || s.saida > corte)).length);

  const setores = [];
  ativas.forEach((s) => {
    const existente = setores.find((x) => x.setor === s.setor);
    if (existente) existente.valor++;
    else setores.push({ setor: s.setor, valor: 1 });
  });
  const posicao = (setor) => (setoresLista.includes(setor) ? setoresLista.indexOf(setor) : setoresLista.length);
  setores.sort((a, b) => posicao(a.setor) - posicao(b.setor));

  // Acompanhamento: dias desde a última mentoria realizada (ou desde a
  // entrada, se ainda não teve nenhuma). Sem mentoria agendada e acima do
  // limite da aba Config = precisa de atenção.
  const acompanhamento = new Map(ativas.map((s) => {
    const dias = diasEntre(s.ultimaMentoria || s.entrada, hojeIso);
    return [s.id, { dias, atencao: dias > alertaDiasSemMentoria && !s.proximaMentoria }];
  }));

  const soma = (arr) => arr.reduce((s, v) => s + v, 0);
  const data = {
    months: MESES_CURTOS.slice(0, mesReferencia),
    monthLabels: MESES_LONGOS.slice(0, mesReferencia),
    periodo: { ano, mesReferencia },
    dataReferencia: hojeIso,
    fases: fasesJornada.map((f) => ({ id: f.id, nome: f.nome, estagio: f.estagio, ...pick(acoesPorFase.get(f.id), ["individual", "coletivo"]) })),
    acoesTransversais: idsFase.has("TRANSVERSAL") ? acoesPorFase.get("TRANSVERSAL").total : 0,
    totalAcoesIndividual,
    totalAcoesColetivo,
    totalAcoes,
    ciclos: ciclosBase.map((c) => ({ ...c, empresas: ativas.filter((s) => s.cicloAtual === c.nome).length })),
    aulasColetivas: fasesJornada.map((f) => ({ fase: `${f.id} · ${f.estagio}`, ...aulasPorFase.get(f.id) })),
    kpis: {
      startupsAtivas: ativas.length,
      mentoriasRealizadas: soma(mentorias),
      aulasMinistradas: soma(aulas),
      aulasPlanejadas: soma([...aulasPorFase.values()].map((a) => a.total)),
      entregasConcluidas: planoTrabalho.concluida,
      graduandasPrevistas: ativas.filter((s) => s.cicloAtual === ultimoCiclo).length,
      startupsDiagnosticadas: diagsAtivas.length,
      mentoriasAgendadas: agenda.filter((m) => m.status === "Agendada" && !m.aConfirmar).length,
      mentoriasAConfirmar: agenda.filter((m) => m.aConfirmar).length,
      startupsPrecisandoAtencao: [...acompanhamento.values()].filter((a) => a.atencao).length,
    },
    parametros: { alertaDiasSemMentoria },
    planoTrabalho,
    setores,
    maturidade,
    serieMensal: { mentorias, aulas, startupsAtivas: startupsAtivasMensal },
    startups: ativas.map((s) => {
      const diag = ultimoDiag.get(s.id);
      return {
        id: s.id,
        nome: s.nome,
        setor: s.setor,
        descricaoAtual: s.descricaoAtual,
        cicloAtual: s.cicloAtual,
        fomentoCaptado: s.fomentoCaptado,
        dataEntrada: s.entrada,
        responsavel: s.responsavel,
        empregosGerados: s.empregosGerados,
        mentoriasRealizadas: s.mentoriasRealizadas,
        ultimaMentoria: s.ultimaMentoria,
        proximaMentoria: s.proximaMentoria,
        diasSemMentoria: acompanhamento.get(s.id).dias,
        precisaAtencao: acompanhamento.get(s.id).atencao,
        maturidade: diag ? mediaDiag(diag) : null,
        dataDiagnostico: diag ? diag.data : "",
      };
    }),
    mentorias: agenda,
    empregosGeradosMensal,
    familiasAtingidasMensal,
    fomentoCaptadoMensal,
  };

  if (avisos.length > MAX_AVISOS) {
    const resto = avisos.length - MAX_AVISOS;
    avisos.length = MAX_AVISOS;
    avisos.push(`… e mais ${resto} aviso(s)`);
  }
  return { data, avisos };
}

function pick(obj, chaves) {
  return Object.fromEntries(chaves.map((k) => [k, obj[k]]));
}

module.exports = { montarIncubadora, ABAS_OBRIGATORIAS, ABAS_LIDAS: [...ABAS_OBRIGATORIAS, ...ABAS_OPCIONAIS], DIMENSOES };
