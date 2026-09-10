// Tema ECharts compartilhado — paleta, fontes e defaults de tooltip/grid,
// alinhado aos tokens de assets/css/tokens.css.
//
// A paleta categórica foi validada (validate_palette.js) para faixa de
// luminosidade, piso de croma, separação para daltonismo em pares adjacentes
// e piso de visão normal. Slot 1 = azul do Parque e slot 4 = dourado
// institucional, preservando a identidade dos sistemas de origem.
// Três slots ficam abaixo de 3:1 de contraste sobre o branco, o que obriga
// "relief": todos os gráficos levam legenda e/ou rótulo direto — nunca cor sozinha.
(function () {
  const COLORS = {
    navy900: "#08293f",
    navy800: "#0c3c60",
    navy700: "#0e4675",
    navy600: "#0b4e86",
    navy500: "#10639f",
    navy400: "#2f7ab8",
    yellow600: "#d9a91c",
    yellow500: "#f2c230",
    yellow300: "#f6d465",
    green700: "#166a3c",
    green600: "#1f8a4d",
    red600: "#b13333",
    red500: "#d64545",
    gray700: "#3d4653",
    gray500: "#6b7480",
    gray300: "#c9ced6",
    gray200: "#e2e5ea",
    gray100: "#eef0f3",
    surface: "#ffffff",
  };

  // Ordem fixa — nunca ciclada. Uma 7ª série vira "Outros" ou um segundo gráfico.
  const SERIES_PALETTE = [
    "#2f7ab8", // 1 azul Parque
    "#eb6834", // 2 laranja
    "#1baf7a", // 3 aqua
    "#d9a91c", // 4 dourado institucional
    "#e87ba4", // 5 magenta
    "#4a3aa7", // 6 violeta
  ];

  // Rampa sequencial (magnitude contínua: mapas de calor) — um único tom,
  // claro → escuro. Nunca arco-íris.
  const SEQUENTIAL = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"];

  // Cores de estado — reservadas, jamais usadas como "série N".
  const STATUS = { good: "#1f8a4d", warning: "#d9a91c", critical: "#d64545", neutral: "#6b7480" };

  const FONT = '"Poppins","Segoe UI",system-ui,-apple-system,sans-serif';

  function baseGrid(overrides) {
    return Object.assign(
      { left: 8, right: 14, top: 36, bottom: 8, containLabel: true },
      overrides || {}
    );
  }

  function axisText() {
    return { color: COLORS.gray500, fontFamily: FONT, fontSize: 11 };
  }

  function tooltipDefaults(overrides) {
    return Object.assign(
      {
        trigger: "axis",
        backgroundColor: COLORS.navy900,
        borderWidth: 0,
        padding: [10, 14],
        textStyle: { color: "#fff", fontFamily: FONT, fontSize: 12 },
        confine: true,
      },
      overrides || {}
    );
  }

  function categoryAxis(data, overrides) {
    return Object.assign(
      {
        type: "category",
        data: data,
        axisLine: { lineStyle: { color: COLORS.gray200 } },
        axisTick: { show: false },
        axisLabel: axisText(),
      },
      overrides || {}
    );
  }

  function valueAxis(overrides) {
    return Object.assign(
      {
        type: "value",
        splitLine: { lineStyle: { color: COLORS.gray100 } },
        axisLabel: axisText(),
        axisLine: { show: false },
        axisTick: { show: false },
      },
      overrides || {}
    );
  }

  function legendDefaults(overrides) {
    return Object.assign(
      {
        top: 0,
        left: 0,
        icon: "circle",
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: COLORS.gray700, fontFamily: FONT, fontSize: 11.5 },
      },
      overrides || {}
    );
  }

  // Barra: extremidade de dado arredondada em 4px, ancorada na linha de base.
  function barRadius(dir) {
    return dir === "horizontal" ? [0, 4, 4, 0] : [4, 4, 0, 0];
  }

  // Segmentos empilhados separados por 2px da cor da superfície (nunca borda escura).
  function stackedItemStyle() {
    return { borderColor: COLORS.surface, borderWidth: 2 };
  }

  function lineSeriesDefaults(overrides) {
    return Object.assign(
      { type: "line", symbol: "circle", symbolSize: 8, lineStyle: { width: 2 }, smooth: 0.25 },
      overrides || {}
    );
  }

  // Base de radar na identidade — eixos recessivos, área translúcida.
  function radarBase(indicators, overrides) {
    return Object.assign(
      {
        indicator: indicators,
        shape: "polygon",
        radius: "66%",
        center: ["50%", "56%"],
        axisName: { color: COLORS.gray700, fontFamily: FONT, fontSize: 11 },
        splitLine: { lineStyle: { color: COLORS.gray200 } },
        splitArea: { areaStyle: { color: ["rgba(255,255,255,0)", "rgba(238,240,243,0.55)"] } },
        axisLine: { lineStyle: { color: COLORS.gray200 } },
      },
      overrides || {}
    );
  }

  // Escala sequencial contínua para mapas de calor.
  function heatVisualMap(max, overrides) {
    return Object.assign(
      {
        min: 0,
        max: max,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        itemWidth: 12,
        itemHeight: 90,
        textStyle: { color: COLORS.gray500, fontFamily: FONT, fontSize: 10.5 },
        inRange: { color: SEQUENTIAL },
      },
      overrides || {}
    );
  }

  window.APP_THEME = {
    COLORS,
    SERIES_PALETTE,
    SEQUENTIAL,
    STATUS,
    FONT,
    baseGrid,
    axisText,
    tooltipDefaults,
    categoryAxis,
    valueAxis,
    legendDefaults,
    barRadius,
    stackedItemStyle,
    lineSeriesDefaults,
    radarBase,
    heatVisualMap,
  };
})();
