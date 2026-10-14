// Shared styling for every chart.
// Serif titles; sans-serif labels and axes.
const sharedConfig = {
  font: "Inter",

  view: {
    stroke: null
  },

  title: {
    font: "Newsreader",
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

// Chart 1: Horticulture waffle chart
vegaEmbed("#chart01", "charts/01-waffle.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart01", "charts/01-waffle.json", error)
);

// Chart 2: Horticulture slope chart
vegaEmbed("#chart02", "charts/02-slope.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart02", "charts/02-slope.json", error)
);

// Chart 3: Australian production map
vegaEmbed("#chart03", "charts/03-australia-map.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart03", "charts/03-australia-map.json", error)
);

// Chart 4: State ranking bump chart
vegaEmbed("#chart04", "charts/04-bump.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart04", "charts/04-bump.json", error)
);

// Chart 5: International flower trade flow map
vegaEmbed("#chart05", "charts/05-flow-map.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart05", "charts/05-flow-map.json", error)
);

// Chart 6: International supplier map
vegaEmbed("#chart06", "charts/06-supplier-map.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart06", "charts/06-supplier-map.json", error)
);

// Chart 7: Imported flower varieties treemap
vegaEmbed("#chart07", "charts/07-treemap.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart07", "charts/07-treemap.json", error)
);

// Chart 8: Import source heatmap
vegaEmbed("#chart08", "charts/08-import-heatmap.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig
}).catch(error =>
  handleChartError("#chart08", "charts/08-import-heatmap.json", error)
);
