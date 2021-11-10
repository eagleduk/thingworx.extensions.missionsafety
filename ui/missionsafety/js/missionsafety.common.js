const renderItem = (params, api) => {
  const values = [api.value(0), api.value(1)];
  const coord = api.coord(values);
  const size = api.size([1, 1], values);

  return {
    type: "sector",
    shape: {
      // r0: coord[2] - size[0] / 2,
      // r: coord[2] + size[0] / 2,
      //   startAngle: -(coord[3] + size[1] / 2),
      //   endAngle: -(coord[3] - size[1] / 2),
      cx: params.coordSys.cx,
      cy: params.coordSys.cy,
      r0: coord[2] - size[0],
      r: coord[2],
      startAngle: -coord[3],
      endAngle: -(coord[3] - size[1]),
    },
    style: api.style({
      fill: api.visual("color"),
    }),
  };
};

const chart = {
  animation: false,
  title: {
    text: "Current Situation",
    subtext: "0",
    textAlign: "center",
    right: -60,
    bottom: 20,
    subtextStyle: {
      fontSize: 80,
      color: "green",
    },
  },
  legend: {
    // data: ["9 ~ ", "6 ~ 8", "0 ~ 5"],
    // top: "bottom",
    // left: "left",
    orient: "vertical",
    icon: "circle",
    left: 10,
    bottom: 20,
  },
  polar: [
    {
      id: "polar1",
      center: ["50%", "50%"],
      radius: [25, "90%"],
    },
    {
      id: "polar2",
      center: ["50%", "50%"],
      radius: [0, "90%"],
    },
  ],
  tooltip: {
    show: false,
  },
  angleAxis: [
    {
      polarIndex: 0,
      type: "value",
      min: 0,
      max: 36,
      margin: 10,
      axisLabel: {
        formatter: (value, index) => {
          value *= 10;
          let result;
          if (value === 0) result = "N";
          else if (value === 90) result = "E";
          else if (value === 180) result = "S";
          else if (value === 270) result = "W";
          else result = value + "°";
          return " " + result + " ";
        },
      },

      splitLine: {
        show: true,
        lineStyle: {
          color: "#ddd",
        },
        interval: 30,
      },
      axisLine: {
        show: true,
      },
      zlevel: 1,
      z: 1,
    },
    {
      polarIndex: 1,
      type: "value",
      min: 0,
      max: 36,
      margin: 10,
      axisLabel: {
        show: false,
      },
    },
  ],

  radiusAxis: [
    {
      polarId: "polar1",
      polarIndex: 0,
      type: "value",
      min: 0,
      max: 20,
      interval: 6,
      axisLabel: {
        showMaxLabel: false,
        showMinLabel: false,
        color: "white",
        formatter: (value, index) => {
          return value * 5 + " NM";
        },
        align: "center",
        overflow: "truncate",
        lineOverflow: "truncate",
      },
      splitLine: {
        show: true,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      zlevel: 1,
      z: 1,
    },
    {
      polarId: "polar2",
      polarIndex: 1,
      type: "value",
      min: 0,
      max: 20,
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
  ],
  graphic: [
    {
      type: "group",
      y: 10,
      silent: true,
      children: [
        {
          type: "image",
          style: {
            image:
              "../Common/extensions/missionsafety/ui/missionsafety/images/arrow_blue.png",
            width: 100,
            height: 50,
          },
        },
        {
          type: "text",
          x: 25,
          y: -15,
          style: {
            fill: "#fff",
            text: "Wave",
            font: "18px",
          },
        },
      ],
    },
    {
      type: "group",
      y: 60,
      silent: true,
      children: [
        {
          type: "image",
          style: {
            image:
              "../Common/extensions/missionsafety/ui/missionsafety/images/arrow_green.png",
            width: 100,
            height: 50,
          },
        },
        {
          type: "text",
          x: 25,
          y: -15,
          style: {
            fill: "#fff",
            text: "Current",
            font: "18px",
          },
        },
      ],
    },
    {
      type: "group",
      y: 110,
      silent: true,
      children: [
        {
          type: "image",
          style: {
            image:
              "../Common/extensions/missionsafety/ui/missionsafety/images/arrow_orange.png",
            width: 100,
            height: 50,
          },
        },
        {
          type: "text",
          x: 25,
          y: -15,
          style: {
            fill: "#fff",
            text: "Wind",
            font: "18px",
          },
        },
      ],
    },
    {
      id: "main",
      type: "image",
      style: {
        image:
          "../Common/extensions/missionsafety/ui/missionsafety/images/main.png",
        width: 50,
        height: 50,
      },
      left: "center",
      top: "middle",
      rotation: 0,
      z: 5,
    },
  ],
  series: [
    {
      id: "state1",
      type: "custom",
      coordinateSystem: "polar",
      itemStyle: {
        color: "brown",
      },
      renderItem,
      silent: true,
    },
    {
      id: "state2",
      type: "custom",
      coordinateSystem: "polar",
      itemStyle: {
        color: "orange",
      },
      renderItem,
      silent: true,
    },
    {
      id: "state3",
      type: "custom",
      coordinateSystem: "polar",
      itemStyle: {
        color: "green",
      },
      renderItem,
      silent: true,
    },
    {
      id: "main",
      type: "effectScatter",
      coordinateSystem: "polar",
      symbolSize: 50,
      symbolRotate: 0,
      showEffectOn: "emphasis",
      polarIndex: 1,
      data: [
        {
          value: [0, 0],
          symbol:
            "image://../Common/extensions/missionsafety/ui/missionsafety/images/main.png",
        },
      ],
      label: {
        show: false,
      },
      silent: true,
      zlevel: 10,
      z: 10,
    },
    {
      id: "forecast",
      polarIndex: 0,
      type: "effectScatter",
      coordinateSystem: "polar",
      symbolSize: 40,
      symbolRotate: 0,
      showEffectOn: "emphasis",
      symbol:
        "image://../Common/extensions/missionsafety/ui/missionsafety/images/moving.png",
      data: [],
      silent: true,
      zlevel: 10,
      z: 10,
      // z: 3,
    },
    {
      id: "route",
      type: "line",
      coordinateSystem: "polar",
      showSymbol: false,
      itemStyle: {
        color: "red",
      },
      data: [],
      lineStyle: {
        width: 4,
        type: "dashed",
      },
      silent: true,
      zlevel: 10,
      z: 10,
    },
    {
      id: "wave",
      type: "scatter",
      coordinateSystem: "polar",
      symbolSize: 60,
      symbol:
        "image://../Common/extensions/missionsafety/ui/missionsafety/images/arrow_blue_up.png",
      symbolRotate: 0,
      data: [],
      label: {
        show: true,
        fontSize: 15,
        rotate: 0,
      },
      silent: true,
      zlevel: 10,
      z: 10,
    },
    {
      id: "current",
      type: "scatter",
      coordinateSystem: "polar",
      symbolSize: 60,
      symbol:
        "image://../Common/extensions/missionsafety/ui/missionsafety/images/arrow_green_up.png",
      symbolRotate: 0,
      data: [],
      label: {
        show: true,
        fontSize: 15,
        rotate: 0,
      },
      silent: true,
      zlevel: 10,
      z: 10,
    },
    {
      id: "wind",
      type: "scatter",
      coordinateSystem: "polar",
      symbolSize: 60,
      symbol:
        "image://../Common/extensions/missionsafety/ui/missionsafety/images/arrow_orange_up.png",
      symbolRotate: 0,
      data: [],
      label: {
        show: true,
        fontSize: 15,
        rotate: 0,
      },
      silent: true,
      zlevel: 10,
      z: 10,
    },
  ],
};
