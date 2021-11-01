const chart = {
  chart: {
    polar: true,
    // type: "arearange",
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
    text: `caption`,
    floating: true,
    align: "left",
    verticalAlign: "top",
    useHTML: true,
    x: 20,
  },

  legend: {
    floating: true,
    align: "left",
    layout: "vertical",
    verticalAlign: "bottom",
    title: {
      text: "Sea State",
    },
  },

  xAxis: [
    {
      min: 0,
      max: 360,
      labels: {
        //format: '{value}°',
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
      //lineWidth: 20,

      //tickColor: "black",
      tickInterval: 10,
      //minorTickInterval: 10,

      gridLineColor: "rgba(255, 255, 255, .4)",
      gridZIndex: 9999,
    },
  ],

  yAxis: [
    {
      min: 0,
      max: 40,
      tickInterval: 10,
      //showFirstLabel: false,
      //showLastLabel: true,
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
    //innerSize: "54px",
    background: [
      {
        outerRadius: "105%",
      },
    ],
    //gridZIndex: 9999,
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
      showInLegend: false,
      marker: {
        enabled: true,
      },
      dataLabels: {
        enabled: true,
        color: "white",
        x: -1,
        y: 10,
      },
    },
    arearange: {
      showInLegend: true,
      marker: {
        enabled: false,
      },
    },
    bubble: {
      showInLegend: false,
      minSize: 54,
    },
    polygon: {
      showInLegend: false,
      marker: {
        enabled: false,
      },
    },
  },

  series: [],
};

function renderChart(datas) {
  let series = [],
    text = "",
    style = "";
  for (let type in datas) {
    switch (type) {
      case "arearange":
      case "polygon":
        datas[type].forEach((data) => {
          series.push({
            type,
            ...data,
          });
        });
        break;
      case "scatter":
        text += `<div class="mission__subtitle">`;
        style += `.${type} image { transform-origin: center; transform-box: fill-box;}`;
        style += `.${type} text { transform-origin: center; transform-box: fill-box;}`;

        datas[type].forEach((data, index) => {
          const {
            id,
            data: [[x, y]],
            marker: { symbol },
          } = data;
          series.push({
            type,
            className: `${type} ${id}`,
            ...data,
          });
          style += `.${type}.${id} image { transform: translate(-30px, -25px) rotate(${
            x + 180
          }deg); }`;
          style += `.${type}.${id} text { transform: rotate(${
            x + (x > 180 ? 0 : 180) + 90
          }deg); }`;

          text += `
            <div style="background-image: ${symbol}; top: ${index * 50}px">
              <span>
                ${id}
              </span>
            </div>
          `;
        });

        text += `</div>`;
        break;
      case "bubble":
        break;
    }
  }

  const newChart = {
    ...chart,
    series,
    subtitle: {
      ...chart.subtitle,
      text,
    },
  };

  console.log(newChart);
  return {
    newChart,
    style,
  };
}

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
