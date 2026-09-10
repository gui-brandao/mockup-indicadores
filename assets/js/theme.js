// Tema ECharts compartilhado — paleta, fontes e defaults de tooltip/grid,
// alinhado aos tokens de assets/css/tokens.css.
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
  };

  const SERIES_PALETTE = [
    COLORS.navy600,
    COLORS.yellow500,
    COLORS.green600,
    COLORS.navy400,
    COLORS.red500,
    COLORS.navy900,
  ];

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

  window.APP_THEME = {
    COLORS,
    SERIES_PALETTE,
    FONT,
    baseGrid,
    axisText,
    tooltipDefaults,
    categoryAxis,
    valueAxis,
    legendDefaults,
  };
})();
