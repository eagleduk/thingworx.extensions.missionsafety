TW.Runtime.Widgets.missionsafety = function () {
  this.runtimeProperties = function () {
    return {
      supportsAutoResize: true,
    };
  };

  this.renderHtml = function () {
    return `
		<div id="${this.getProperty("Id")}" class="widget-content widget-missionsafety">
		</div>
		`;
  };

  this.afterRender = function () {
    const id = this.getProperty("Id");
    const width = this.getProperty("Width");
    const height = this.getProperty("Height");

    const dom = this.jqElement[0];
    this.missionChart = echarts.init(dom, null, {
      renderer: "svg",
    });
    this.missionChart.setOption(chart);
  };

  this.updateProperty = function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === "DATA") {
      const datas = updatePropertyInfo.RawDataFromInvoke;

      const maxY = this.getProperty("maxY");
      const scaleX = this.getProperty("scaleX");
      const scaleY = this.getProperty("scaleY");

      if (datas) {
        (datas.radiusAxis = [
          {
            max: maxY / scaleY,
            axisLabel: {
              formatter: (value, index) => {
                return value * scaleY + " NM";
              },
            },
          },
          {
            max: maxY / scaleY,
          },
        ]),
          (datas.angleAxis = [{ max: 360 / scaleX }, { max: 360 / scaleX }]);

        this.missionChart.setOption(datas, { replaceMerge: "series" });
      }
    } else if (
      updatePropertyInfo.TargetProperty === "maxY" ||
      updatePropertyInfo.TargetProperty === "scaleX" ||
      updatePropertyInfo.TargetProperty === "scaleY"
    ) {
      const value = updatePropertyInfo.RawSinglePropertyValue;
      this.setProperty(updatePropertyInfo.TargetProperty, value);
    }
  };

  this.resize = function (width, height) {
    this.missionChart.resize({
      width,
      height,
    });
  };
};
