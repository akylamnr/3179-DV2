// Shared styling for every chart.
// Serif titles; sans-serif labels and axes.
const sharedConfig = {
  font: "Inter",

  view: {
    stroke: null
  },

  title: {
    font: "Inter",
    fontWeight: 700,
    color: "#1f382f",
    fontSize: 20,
    anchor: "start",
    offset: 12,
    subtitleFont: "Inter",
    subtitleFontSize: 14,
    subtitlePadding: 4,
    subtitleColor: "#74686D"
  },

  axis: {
    labelFont: "Inter",
    titleFont: "Inter",
    labelFontSize: 13,
    titleFontSize: 13,
    labelColor: "#5B4E49",
    titleColor: "#5B4E49",
    titleFontWeight: 600
  },

  legend: {
    labelFont: "Inter",
    titleFont: "Inter",
    labelFontSize: 13,
    titleFontSize: 13,
    labelColor: "#5B4E49",
    titleColor: "#5B4E49",
    titleFontWeight: 600
  }
};


// Custom tooltip: borderless, matches the page background, and takes its
// accent colour from the hovered mark (e.g. a country's colour).
const COUNTRY_COLOURS = {
  Malaysia: "#329481", Kenya: "#EE9F27", Ecuador: "#B695C9",
  Colombia: "#8A6E3B", China: "#A64470", Vietnam: "#B7C75E"
};

function tooltipAccent(item, value) {
  const country = value && (value.Partner || value.Country);
  if (country && COUNTRY_COLOURS[country]) return COUNTRY_COLOURS[country];

  const toRgb = value => {
    if (typeof value !== "string") return null;
    let m = value.match(/^#([0-9a-f]{6})$/i);
    if (m) return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16));
    m = value.match(/^#([0-9a-f]{3})$/i);
    if (m) return [...m[1]].map(c => parseInt(c + c, 16));
    m = value.match(/^rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)/i);
    return m ? [+m[1], +m[2], +m[3]] : null;
  };

  for (const value of [item && item.fill, item && item.stroke]) {
    const rgb = toRgb(value);
    if (!rgb) continue;
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    if (luminance < 0.7) return "rgb(" + rgb.join(",") + ")";
  }
  return "#28483D";
}

const escapeHtml = text =>
  String(text).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

function chartTooltip(handler, event, item, value) {
  let el = document.getElementById("chart-tooltip");
  if (!el) {
    el = document.createElement("div");
    el.id = "chart-tooltip";
    el.className = "chart-tooltip";
    el.setAttribute("role", "tooltip");
    document.body.appendChild(el);
  }

  const entries = value && typeof value === "object"
    ? Object.entries(value).filter(([key]) => !key.startsWith("_"))
    : value != null && value !== "" ? [["", value]] : [];

  if (!entries.length) {
    el.classList.remove("is-visible");
    return;
  }

  const [[headKey, headValue], ...rest] = entries;
  const keyIndex = rest.findIndex(([, v]) => /\d/.test(String(v)));
  const rows = rest.map(([key, v], i) =>
    '<tr' + (i === keyIndex ? ' class="key-row"' : '') + '><td>' +
    escapeHtml(key) + '</td><td>' + escapeHtml(v) + '</td></tr>'
  ).join("");

  el.style.setProperty("--tip-accent", tooltipAccent(item, value));
  el.innerHTML =
    '<div class="tip-title">' + escapeHtml(headValue) + '</div>' +
    (rows ? '<table>' + rows + '</table>' : (headKey ? '<div class="tip-sub">' + escapeHtml(headKey) + '</div>' : ""));
  el.classList.add("is-visible");

  const pad = 14;
  const box = el.getBoundingClientRect();
  let x = event.clientX + pad;
  let y = event.clientY + pad;
  if (x + box.width > window.innerWidth - 8) x = event.clientX - box.width - pad;
  if (y + box.height > window.innerHeight - 8) y = event.clientY - box.height - pad;
  el.style.left = Math.max(8, x) + "px";
  el.style.top = Math.max(8, y) + "px";
}

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
  config: sharedConfig,
  tooltip: chartTooltip
}).catch(error =>
  handleChartError("#chart01", "charts/01-waffle.json", error)
);

// Chart 2: Australian cut-flower choropleth 
vegaEmbed("#chart02", "charts/02-choropleth.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch(error =>
  handleChartError("#chart02", "charts/02-choropleth.json", error)
);



// Chart 3: Horticulture slope chart 
vegaEmbed("#chart04", "charts/04-slope.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch(error =>
  handleChartError("#chart04", "charts/04-slope.json", error)
);



vegaEmbed("#chart05", "charts/05-sankey.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).then(result => {
  // Scale the fixed-size diagram down to fit its column.
  const svg = result.view.container().querySelector("svg");
  const w = svg.getAttribute("width");
  const h = svg.getAttribute("height");
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
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
      config: sharedConfig,
  tooltip: chartTooltip
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
  config: sharedConfig,
  tooltip: chartTooltip
}).catch((error) =>
  handleChartError("#chart07", "charts/07-import-bump-chart.json", error)
);

vegaEmbed("#chart08", "charts/08-prop-symbol.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch(error =>
  handleChartError("#chart08", "charts/08-prop-symbol.json", error)
);

vegaEmbed("#chart09", "charts/09-price-per-kg.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch((error) =>
  handleChartError("#chart09", "charts/09-price-per-kg.json", error)
);

vegaEmbed("#chart10", "charts/10-flower-imports-by-variety.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch((error) =>
  handleChartError("#chart10", "charts/10-flower-imports-by-variety.json", error)
);

vegaEmbed("#chart11", "charts/11-cut-flower-import-calendar.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch((error) =>
  handleChartError("#chart11", "charts/11-cut-flower-import-calendar.json", error)
);

vegaEmbed("#chart16", "charts/16-overseas-workers-dumbbell.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch(error =>
  handleChartError("#chart16", "charts/16-overseas-workers-dumbbell.json", error)
);

vegaEmbed("#chart17", "charts/17-labour-state-diverging.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch(error =>
  handleChartError("#chart17", "charts/17-labour-state-diverging.json", error)
);

vegaEmbed("#chart18", "charts/18-labour-peak-month-map.json", {
  actions: false,
  renderer: "svg",
  config: sharedConfig,
  tooltip: chartTooltip
}).catch(error =>
  handleChartError("#chart18", "charts/18-labour-peak-month-map.json", error)
);

// Chapter navigation: highlight the section in view and fade content in on scroll.
const chapterLinks = document.querySelectorAll(".chapter-nav a");
const chapterSections = [...chapterLinks].map(link =>
  document.querySelector(link.getAttribute("href"))
);

function updateActiveChapter() {
  const marker = window.innerHeight * 0.35;
  let active = null;
  chapterSections.forEach((section, i) => {
    if (section && section.getBoundingClientRect().top <= marker) active = i;
  });
  chapterLinks.forEach((link, i) =>
    link.classList.toggle("is-active", i === active)
  );
}

window.addEventListener("scroll", updateActiveChapter, { passive: true });
updateActiveChapter();

if ("IntersectionObserver" in window) {
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document
    .querySelectorAll("main section .chart-card, main .chart-with-story, main .section-lead, main .demand-barriers, main .conclusion-text")
    .forEach(el => {
      el.classList.add("reveal");
      revealer.observe(el);
    });
}
