// Shared styling for every chart.
// Serif titles; sans-serif labels and axes.
const sharedConfig = {
  font: "Inter",

  view: {
    stroke: null
  },

  title: {
    font: "Inter",
    fontSize: 22,
    anchor: "start",
    subtitleFont: "Inter",
    subtitleFontSize: 14,
    subtitleColor: "#74686D"
  },

  axis: {
    labelFont: "Inter",
    titleFont: "Inter",
    labelFontSize: 12,
    titleFontSize: 13
  },

  legend: {
    labelFont: "Inter",
    titleFont: "Inter",
    labelFontSize: 12,
    titleFontSize: 13
  }
};

// Display a friendly message if a chart has not been created yet.
function handleChartError(id, file, error) {
  console.error("Could not load " + file, error);

  const element = document.querySelector(id);

  if (element) {
    element.classList.add("chart-placeholder");
    element.textContent = "Chart coming soon ";
  }
}

// Chart 1: Horticulture waffle 
vegaEmbed("#chart01", "charts/01-waffle.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart01", "charts/01-waffle.json", error)
);

// Chart 2: Australian cut-flower choropleth 
vegaEmbed("#chart02", "charts/02-choropleth.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart02", "charts/02-choropleth.json", error)
);



// Chart 3: Horticulture slope chart 
vegaEmbed("#chart04", "charts/04-slope.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart04", "charts/04-slope.json", error)
);



vegaEmbed("#chart05", "charts/05-sankey.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart05", "charts/05-sankey.json", error)
);

let tradeFlowView = null;
const resetTradeMapButton = document.querySelector("#resetTradeMap");

resetTradeMapButton.addEventListener("click", async () => {
  if (!tradeFlowView) {
    return;
  }

  await tradeFlowView
    .signal("selectedYear", 2025)
    .signal("zoom", 100)
    .signal("selectedContinent", null)
    .signal("panStart", null)
    .signal("mapTranslate", [tradeFlowView.width() / 2, tradeFlowView.height() / 2])
    .runAsync();
});

async function embedTradeFlowMap() {
  try {
    const response = await fetch("charts/06-flow-map.json");

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const liteSpec = await response.json();
    const spec = vegaLite.compile(liteSpec).spec;
    const projection = spec.projections.find(item => item.name === "projection");

    if (!projection) {
      throw new Error("The trade map has no geographic projection.");
    }

    projection.translate = { signal: "mapTranslate" };
    spec.signals.push(
      {
        name: "panStart",
        value: null,
        on: [
          {
            events: "mousedown",
            update: "[x(), y(), mapTranslate[0], mapTranslate[1]]"
          },
          {
            events: "window:mouseup",
            update: "null"
          }
        ]
      },
      {
        name: "mapTranslate",
        update: "[width / 2, height / 2]",
        on: [
          {
            events: "window:mousemove",
            update: "panStart ? [panStart[2] + x() - panStart[0], panStart[3] + y() - panStart[1]] : mapTranslate"
          }
        ]
      }
    );

    const result = await vegaEmbed("#chart06", spec, {
      mode: "vega",
      actions: false,
      renderer: "svg",
      config: sharedConfig
    });
    tradeFlowView = result.view;
    const tradeMapBindings = document.querySelector("#chart06 .vega-bindings");
    const tradeMapControls = document.querySelector("#tradeMapControls");

    if (!tradeMapBindings || !tradeMapControls) {
      throw new Error("The trade map controls could not be placed.");
    }

    tradeMapControls.prepend(tradeMapBindings);
    resetTradeMapButton.disabled = false;
  } catch (error) {
    handleChartError("#chart06", "charts/06-flow-map.json", error);
  }
}

embedTradeFlowMap();


vegaEmbed("#chart07", "charts/07-import-bump-chart.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch((error) =>
  handleChartError("#chart07", "charts/07-import-bump-chart.json", error)
);

vegaEmbed("#chart08", "charts/08-prop-symbol.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart08", "charts/08-prop-symbol.json", error)
);

vegaEmbed("#chart09", "charts/09-price-per-kg.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch((error) =>
  handleChartError("#chart09", "charts/09-price-per-kg.json", error)
);

vegaEmbed("#chart10", "charts/10-flower-imports-by-variety.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch((error) =>
  handleChartError("#chart10", "charts/10-flower-imports-by-variety.json", error)
);

vegaEmbed("#chart11", "charts/11-cut-flower-import-calendar.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch((error) =>
  handleChartError("#chart11", "charts/11-cut-flower-import-calendar.json", error)
);