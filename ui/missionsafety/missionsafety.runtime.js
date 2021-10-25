TW.Runtime.Widgets.missionsafety = function () {
  const maxSeries = 360;
  const maxYValue = 40;

  function getRandomValue(limit = 10) {
    const max = parseInt(Math.random() * limit, 0);
    const min = parseInt(Math.random() * limit, 0);
    return {
      max: max > min ? max : min,
      min: max < min ? max : min,
    };
  }

  function getSeaStates() {
    const state1 = [];
    const state2 = [];
    const state3 = [];

    for (let i = 0; i < maxSeries; i++) {
      state1.push([maxYValue, 0]);

      const state2Values = getRandomValue(maxYValue);
      //state2.push([state2Values.max, state2Values.min]);
      state2.push([30, 10]);

      const state3Values = getRandomValue(maxYValue);
      //state3.push([state3Values.max, state3Values.min]);
      state3.push([20, 15]);
    }
    return {
      state1,
      state2,
      state3,
    };
  }

  function setStyles(options) {
    const { STW, Wave, Current, Wind, styleTag } = options;
    styleTag.innerText = `
    .widget-content.widget-missionsafety .title img {
      transform: rotate(${STW}deg);
    } 
    .widget-content.widget-missionsafety .moving image {
      transform: translate(-10px, -30px) rotate(${STW}deg);
    }
    .widget-content.widget-missionsafety .arrow_scatter.wave image {
      transform: translate(-30px, -25px) rotate(${Wave + 180}deg);
    }
    .widget-content.widget-missionsafety .arrow_scatter.wave text {
      transform: rotate(${Wave + (Wave > 180 ? 0 : 180) + 90}deg);
    }
    .widget-content.widget-missionsafety .arrow_scatter.current image {
      transform: translate(-30px, -25px) rotate(${Current + 180}deg);
    }
    .widget-content.widget-missionsafety .arrow_scatter.current text {
      transform: rotate(${Current + (Current > 180 ? 0 : 180) + 90}deg);
    }
    .widget-content.widget-missionsafety .arrow_scatter.wind image {
      transform: translate(-30px, -25px) rotate(${Wind + 180}deg);
    }
    .widget-content.widget-missionsafety .arrow_scatter.wind text {
      transform: rotate(${Wind + (Wind > 180 ? 0 : 180) + 90}deg);
    }
    `;
  }

  function getMarkers(options) {
    if (options) {
      setStyles(options);
      return {
        stw: [[options.STW, 20]],
        wave: [[options.Wave, 15]],
        current: [[options.Current, 25]],
        wind: [[options.Wind, 35]],
      };
    } else {
      return {
        stw: [],
        wave: [],
        current: [],
        wind: [],
      };
    }
  }

  function getChart(options) {
    const { state1, state2, state3 } = getSeaStates();

    const { stw, wave, current, wind } = getMarkers(options);

    const chart = {
      chart: {
        polar: true,
        type: "arearange",
      },

      title: {
        text: `
			  <div class="title">
				  <img src="../Common/extensions/missionsafety/ui/missionsafety/images/main.png">
			  </div>
			  `,
        floating: true,
        align: "center",
        verticalAlign: "middle",
        useHTML: true,
        //x: -27,
        //y: -16
      },

      caption: {
        text: `
			  <div class="arrow_legends">
          <div class="wave">
            Wave
          </div>
          <div class="current">
            Current
          </div>
          <div class="wind">
            Wind
          </div>
			  </div>
			  `,
        floating: true,
        align: "left",
        verticalAlign: "top",
        useHTML: true,
        //margin: 30,
      },

      subtitle: {
        text: `
			  <div class="currentSituation">
          <div class="label">
            Current Situation
          </div>
          <div class="value wind">
            4
          </div>
			  </div>
			  `,
        floating: true,
        align: "right",
        verticalAlign: "bottom",
        useHTML: true,
        y: 40,
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

          plotLines: [
            {
              id: "moving_dash",
              value: stw.length ? stw[0][0] : null,
              color: "yellow",
              dashStyle: "longdash",
              width: 5,
              zIndex: 9999,
            },
          ],
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

          marker: {
            enabled: false,
          },
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

      series: [
        {
          id: "state1",
          name: "9 ~",
          data: state1,
          color: "brown",
        },
        {
          id: "state2",
          name: "6 ~ 9",
          data: state2,
          color: "coral",
        },
        {
          id: "state3",
          name: "0 ~ 5",
          data: state3,
          color: "green",
        },
        {
          id: "band",
          data: [],
          type: "arearange",
          color: "white",
          connectNulls: true,
          tooltip: {
            enabled: true,
          },
          yAxis: 0,
          showInLegend: false,
          visible: false,
        },
        {
          id: "moving",
          type: "scatter",
          color: "yellow",
          showInLegend: false,
          className: "moving",
          data: stw,
          marker: {
            symbol:
              "url(../Common/extensions/missionsafety/ui/missionsafety/images/moving.png)",
            width: 20,
            height: 60,
            fillColor: "white",
            radius: 25,
          },
        },
        {
          id: "wave",
          type: "scatter",
          color: "yellow",
          showInLegend: false,
          className: "arrow_scatter wave",
          data: wave,
          marker: {
            symbol:
              "url(../Common/extensions/missionsafety/ui/missionsafety/images/arrow_blue_up.png)",
            width: 60,
            height: 50,
          },
          dataLabels: {
            enabled: true,
            color: "white",
            format: "15m/s",
            x: -1,
            y: 10,
          },
        },
        {
          id: "current",
          type: "scatter",
          color: "yellow",
          showInLegend: false,
          className: "arrow_scatter current",
          data: current,
          marker: {
            symbol:
              "url(../Common/extensions/missionsafety/ui/missionsafety/images/arrow_green_up.png)",
            width: 60,
            height: 50,
          },
          dataLabels: {
            enabled: true,
            color: "white",
            format: "0m/s",
            position: "center",
            x: -1,
            y: 10,
          },
        },
        {
          id: "wind",
          type: "scatter",
          color: "yellow",
          showInLegend: false,
          className: "arrow_scatter wind",
          data: wind,
          marker: {
            symbol:
              "url(../Common/extensions/missionsafety/ui/missionsafety/images/arrow_orange_up.png)",
            width: 60,
            height: 50,
          },
          dataLabels: {
            enabled: true,
            color: "white",
            format: "15m/s",
            x: -1,
            y: 10,
          },
        },
      ],
    };

    return chart;
  }

  async function render(Id, options) {
    const { default: charts } = await import(
      "https://code.highcharts.com/es-modules/masters/highcharts.src.js"
    );
    await import(
      "https://code.highcharts.com/es-modules/masters/highcharts-more.src.js"
    );

    charts.chart(Id, getChart(options));
  }

  this.runtimeProperties = function () {
    return {
      supportsAutoResize: true,
    };
  };

  this.renderHtml = function () {
    return `
		<div class="widget-content widget-missionsafety">
      <style></style>
			<div id="${this.getProperty("Id")}" class="container"></div>
		</div>
		`;
  };

  this.afterRender = function () {
    const Id = this.getProperty("Id");
    render(Id);
  };

  this.updateProperty = function (updatePropertyInfo) {
    //console.log(updatePropertyInfo);
    const { TargetProperty, RawSinglePropertyValue } = updatePropertyInfo;

    this.setProperty(TargetProperty, RawSinglePropertyValue);

    const { Id, STW, Wave, Current, Wind } = this.properties;
    const styleTag = this.jqElement.get(0).querySelector("style");

    render(Id, { STW, Wave, Current, Wind, styleTag });
    //window.missionsafety = this;
  };
};
