const chart = {
  chart: {
    polar: true,
    type: "arearange",
    margin: 0,
    spacing: [0, 0, 0, 0],
    // events: {
    //   render: (e) => {
    //     console.log("render", e);
    //     e.target.reflow();
    //   },
    //   load: (e) => {
    //     console.log("load", e);
    //     e.target.reflow();
    //   },
    //   redraw: (e) => {
    //     console.log("redraw", e);
    //   },
    // },
  },
  title: {
    text: `
    <div class="currentSituation">
    <div class="label">
      Current Situation
    </div>
    <div class="value">
      0
    </div>
    </div>
    `,
    floating: true,
    align: "right",
    verticalAlign: "bottom",
    useHTML: true,
    y: -120,
  },
  subtitle: {
    text: ``,
    floating: true,
    align: "left",
    verticalAlign: "top",
    useHTML: true,
    x: 20,
  },
  xAxis: [
    {
      min: 0,
      max: 360,
      labels: {
        distance: 30,
        formatter: function () {
          let result = this.value;
          if (result === 0) result = "N";
          else if (result === 90) result = "E";
          else if (result === 180) result = "S";
          else if (result === 270) result = "W";
          else result += "°";
          return result;
        },
      },
      lineColor: "black",
      tickInterval: 10,
      gridLineColor: "rgba(255, 255, 255, .4)",
      gridZIndex: 9999,
    },
  ],
  yAxis: [
    {
      min: 0,
      max: 40,
      tickInterval: 10,
      labels: {
        format: "{value:.1f} kn",
        color: "rgba(0, 0, 0, 1)",
        align: "center",
        style: {},
      },
      tickColor: "black",
      gridLineColor: "rgba(255, 255, 255, .4)",
      gridZIndex: 9999,
      pane: 0,
    },
  ],
  pane: {
    startAngle: 0,
    endAngle: 360,
    center: ["50%", "50%"],
    size: "85%",
    background: [
      {
        outerRadius: "105%",
      },
    ],
  },
  legend: {
    floating: true,
    align: "left",
    layout: "vertical",
    title: {
      text: "Sea State",
    },
  },
  tooltip: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    series: {
      pointStart: 0,
      pointInterval: 1,
      enableMouseTracking: false,
      opacity: 1,
      animation: false,
    },
    scatter: {
      marker: {
        enabled: true,
      },
    },
  },
  series: [],
};

function getSubtitle(statedefinition) {
  const {
    content: { stateDefinitions },
  } = TW.getStateDefinition(statedefinition);

  let text = `<div class="mission__subtitle">`;

  stateDefinitions.forEach(
    ({ defaultValue, displayString, defaultStyleDefinition }, index) => {
      if (defaultValue) {
        const { image } = TW.getStyleFromStyleDefinition(
          defaultStyleDefinition
        );
        text += `
            <div style="background-image: url('${image}'); top: ${
          index * 50
        }px">
              <span>
                ${displayString}
              </span>
            </div>
          `;
      }
    }
  );

  text += `</div>`;
  return text;
}

function getSeriesState(statedefinition) {
  const {
    content: { stateDefinitions },
  } = TW.getStateDefinition(statedefinition);

  const series = [];
  stateDefinitions
    .reverse()
    .forEach(
      ({ defaultValue, displayString, defaultStyleDefinition }, index) => {
        const { backgroundColor: color } = TW.getStyleFromStyleDefinition(
          defaultStyleDefinition
        );
        series.push({
          id: `state${defaultValue}`,
          name: displayString,
          data: [],
          color,
        });
      }
    );

  return series;
}

function getShipState(statedefinition) {
  const {
    content: { stateDefinitions },
  } = TW.getStateDefinition(statedefinition);

  let series = {};
  stateDefinitions
    .reverse()
    .forEach(({ defaultValue, defaultStyleDefinition }, index) => {
      if (!defaultValue) {
        const { image } = TW.getStyleFromStyleDefinition(
          defaultStyleDefinition
        );
        series = {
          id: "center",
          type: "scatter",
          showInLegend: false,
          data: [[0, 0]],
          marker: {
            symbol: `url(${image})`,
            width: 54,
            height: 54,
          },
          zIndex: 9999,
        };
      }
    });

  return series;
}

async function getHighcharts() {
  let charts = undefined;

  if (!charts) {
    const hh = await import(
      "https://code.highcharts.com/es-modules/masters/highcharts.src.js"
    );
    charts = hh.default;
    await import(
      "https://code.highcharts.com/es-modules/masters/highcharts-more.src.js"
    );
  }

  return charts;
}
