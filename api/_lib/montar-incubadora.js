// Converte as abas da planilha da Incubadora no objeto window.APP_DATA.incubadora
// (mesmo formato de data/incubadora.js). Função pura — sem rede, sem env — para
// poder ser conferida contra o mock (ver docs/planilha-incubadora/).
//
// Entrada: { NomeDaAba: [ { coluna: valor, ... }, ... ] }, com colunas em
// snake_case minúsculo (como no cabeçalho da planilha). Valores podem vir como
// número/texto da Sheets API ou só texto (CSV).
//
// O que é derivado aqui (nunca digitado na planilha): startupsAtivas, empresas
// por ciclo, setores, mentoriasRealizadas, aulasMinistradas, entregasConcluidas.
// Inconsistências entre abas viram `avisos` — não derrubam a tela.

const ABAS_OBRIGATORIAS = ["Startups", "Ciclos", "Fases", "AulasColetivas", "PlanoTrabalho", "Maturidade", "Mensal", "Parametros"];
const MESES = 9;

function texto(v) {
  return v === null || v === undefined ? "" : String(v).trim();
}

// Aceita número, "1234", "1234,5" e "1.234,5" (pt-BR).
function numero(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = texto(v).replace(/\s/g, "");
  if (!s) return null;
  const normal = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normal);
  return Number.isFinite(n) ? n : null;
}

// Aceita "2026-09-10", "10/09/2026" e o número serial do Google Sheets.
function dataIso(v) {
  if (typeof v === "number") {
    return new Date(Date.UTC(1899, 11, 30) + v * 86400000).toISOString().slice(0, 10);
  }
  const s = texto(v);
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (br) return `${br[3]}-${br[2].padStart(2, "0")}-${br[1].padStart(2, "0")}`;
  return s;
}

function soma(arr) {
  return arr.reduce((s, v) => s + v, 0);
}

function montarIncubadora(abas) {
  const avisos = [];
  for (const nome of ABAS_OBRIGATORIAS) {
    if (!Array.isArray(abas[nome])) throw new Error(`Aba "${nome}" não encontrada na planilha da Incubadora`);
  }
  const num0 = (v) => numero(v) ?? 0;

  const ciclosBase = abas.Ciclos.slice()
    .sort((a, b) => num0(a.ordem) - num0(b.ordem))
    .map((c) => ({ nome: texto(c.nome), semanas: texto(c.semanas), entrega: texto(c.entrega) }));
  const nomesCiclo = new Set(ciclosBase.map((c) => c.nome));

  const vistos = new Set();
  const startups = [];
  abas.Startups.forEach((r, i) => {
    const linha = i + 2;
    const id = texto(r.id);
    const nome = texto(r.nome);
    if (!nome) {
      if (Object.values(r).some((v) => texto(v))) avisos.push(`Startups, linha ${linha}: sem nome — linha ignorada`);
      return;
    }
    if (id && vistos.has(id)) avisos.push(`Startups, linha ${linha}: id "${id}" repetido`);
    vistos.add(id);
    const ciclo = texto(r.ciclo_atual);
    if (!nomesCiclo.has(ciclo)) avisos.push(`Startups, linha ${linha}: ciclo_atual "${ciclo}" não existe na aba Ciclos`);
    startups.push({
      id,
      nome,
      setor: texto(r.setor),
      descricaoAtual: texto(r.descricao_atual),
      cicloAtual: ciclo,
      fomentoCaptado: num0(r.fomento_captado),
      dataEntrada: dataIso(r.data_entrada),
      responsavel: texto(r.responsavel),
      empregosGerados: num0(r.empregos_gerados),
    });
  });

  const ciclos = ciclosBase.map((c) => ({ ...c, empresas: startups.filter((s) => s.cicloAtual === c.nome).length }));

  const setores = [];
  startups.forEach((s) => {
    const existente = setores.find((x) => x.setor === s.setor);
    if (existente) existente.valor++;
    else setores.push({ setor: s.setor, valor: 1 });
  });

  const mensal = abas.Mensal.slice().sort((a, b) => num0(a.mes) - num0(b.mes));
  if (mensal.length !== MESES) avisos.push(`Mensal: ${mensal.length} linhas (o painel espera ${MESES}, Jan–Set)`);
  const serie = (coluna) => mensal.map((r) => num0(r[coluna]));
  const mentorias = serie("mentorias");
  const aulas = serie("aulas");
  const startupsAtivasMensal = serie("startups_ativas");
  const empregosGeradosMensal = serie("empregos_gerados");
  const familiasAtingidasMensal = serie("familias_atingidas");
  const fomentoCaptadoMensal = serie("fomento_captado_acum");

  const ultimo = (arr) => arr[arr.length - 1];
  if (ultimo(startupsAtivasMensal) !== startups.length) {
    avisos.push(`Mensal: startups_ativas do último mês (${ultimo(startupsAtivasMensal)}) difere do nº de linhas em Startups (${startups.length})`);
  }
  const fomentoTotal = soma(startups.map((s) => s.fomentoCaptado));
  if (ultimo(fomentoCaptadoMensal) !== fomentoTotal) {
    avisos.push(`Mensal: fomento_captado_acum do último mês (${ultimo(fomentoCaptadoMensal)}) difere da soma em Startups (${fomentoTotal})`);
  }
  const empregosTotal = soma(startups.map((s) => s.empregosGerados));
  if (ultimo(empregosGeradosMensal) !== empregosTotal) {
    avisos.push(`Mensal: empregos_gerados do último mês (${ultimo(empregosGeradosMensal)}) difere da soma em Startups (${empregosTotal})`);
  }

  const plano = { concluida: 0, emExecucao: 0, naoIniciada: 0, semStatus: 0 };
  abas.PlanoTrabalho.forEach((r) => {
    const chave = texto(r.status);
    if (chave in plano) plano[chave] = num0(r.quantidade);
    else if (chave) avisos.push(`PlanoTrabalho: status "${chave}" desconhecido (use concluida, emExecucao, naoIniciada ou semStatus)`);
  });

  const parametros = {};
  abas.Parametros.forEach((r) => {
    if (texto(r.chave)) parametros[texto(r.chave)] = numero(r.valor);
  });
  const parametro = (chave) => {
    if (parametros[chave] === undefined || parametros[chave] === null) {
      avisos.push(`Parametros: "${chave}" ausente — usando 0`);
      return 0;
    }
    return parametros[chave];
  };

  const data = {
    fases: abas.Fases.map((f) => ({
      id: texto(f.id),
      nome: texto(f.nome),
      estagio: texto(f.estagio),
      individual: num0(f.individual),
      coletivo: num0(f.coletivo),
    })),
    acoesTransversais: parametro("acoesTransversais"),
    totalAcoesIndividual: parametro("totalAcoesIndividual"),
    totalAcoesColetivo: parametro("totalAcoesColetivo"),
    ciclos,
    aulasColetivas: abas.AulasColetivas.map((a) => ({ fase: texto(a.fase), total: num0(a.total), prontas: num0(a.prontas) })),
    kpis: {
      startupsAtivas: startups.length,
      mentoriasRealizadas: soma(mentorias),
      aulasMinistradas: soma(aulas),
      entregasConcluidas: plano.concluida,
      graduandasPrevistas: parametro("graduandasPrevistas"),
    },
    planoTrabalho: plano,
    setores,
    maturidade: abas.Maturidade.map((m) => ({ dimensao: texto(m.dimensao), valor: num0(m.valor) })),
    serieMensal: { mentorias, aulas, startupsAtivas: startupsAtivasMensal },
    startups,
    empregosGeradosMensal,
    familiasAtingidasMensal,
    fomentoCaptadoMensal,
  };

  return { data, avisos };
}

module.exports = { montarIncubadora, ABAS_OBRIGATORIAS };
