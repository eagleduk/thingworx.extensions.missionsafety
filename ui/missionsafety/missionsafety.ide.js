TW.IDE.Widgets.missionsafety = function () {
  this.widgetIconUrl = function () {
    return "'../Common/extensions/missionsafety/ui/missionsafety/default_widget_icon.ide.png'";
  };

  this.widgetProperties = function () {
    return {
      name: "Mission Safety Sample",
      description: "",
      category: ["Common"],
      isContainer: true,
      supportsAutoResize: true,
      properties: {
        STW: {
          baseType: "NUMBER",
          isBindingTarget: true,
          defaultValue: 0,
        },
        Wave: {
          baseType: "NUMBER",
          isBindingTarget: true,
          defaultValue: 0,
        },
        Current: {
          baseType: "NUMBER",
          isBindingTarget: true,
          defaultValue: 0,
        },
        Wind: {
          baseType: "NUMBER",
          isBindingTarget: true,
          defaultValue: 0,
        },
      },
    };
  };

  this.afterSetProperty = function (name, value) {
    var refreshHtml = false;
    return refreshHtml;
  };

  this.renderHtml = function () {
    return `
	<div class='widget-content widget-missionsafety'>
		<div id="${this.getProperty("Id")}"></div>
	</div>
	`;
  };

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
        data: [],
        color: "brown",
      },
      {
        id: "state2",
        name: "6 ~ 9",
        data: [],
        color: "coral",
      },
      {
        id: "state3",
        name: "0 ~ 5",
        data: [],
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
        data: [],
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
        data: [],
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
          y: 7,
        },
      },
      {
        id: "current",
        type: "scatter",
        color: "yellow",
        showInLegend: false,
        className: "arrow_scatter current",
        data: [],
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
          y: 7,
        },
      },
      {
        id: "wind",
        type: "scatter",
        color: "yellow",
        showInLegend: false,
        className: "arrow_scatter wind",
        data: [],
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
          y: 7,
        },
      },
    ],
  };

  this.afterRender = async function () {
    const id = this.getProperty("Id");
    const { default: charts } = await import(
      "https://code.highcharts.com/es-modules/masters/highcharts.src.js"
    );
    await import(
      "https://code.highcharts.com/es-modules/masters/highcharts-more.src.js"
    );

    charts.chart(id, chart);
  };
};
