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
    subtext: "4",
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
  polar: {
    center: ["50%", "50%"],
  },
  tooltip: {
    show: false,
  },
  angleAxis: {
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
      // padding: 10,
    },

    splitLine: {
      show: true,
      lineStyle: {
        color: "#ddd",
        // type: "dashed",
      },
      interval: 30,
    },
    axisLine: {
      show: true,
    },
    zlevel: 1,
    z: 1,
    // axisTick: {
    //   length: 13,
    // },
  },

  radiusAxis: {
    type: "value",
    min: 0,
    max: 20,
    interval: 6,
    axisLabel: {
      showMaxLabel: false,
      showMinLabel: false,
      color: "white",
      formatter: (value, index) => {
        // return value;
        // return value + " NM";
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
          y: 18,
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
          y: 18,
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
          y: 18,
          style: {
            fill: "#fff",
            text: "Wind",
            font: "18px",
          },
        },
      ],
    },
  ],
  series: [],
};
