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
      console.log(datas);

      if (datas) this.missionChart.setOption(datas, { replaceMerge: "series" });
    }
  };

  this.resize = function (width, height) {
    this.missionChart.resize({
      width,
      height,
    });
  };

  function getData(datas) {
    console.log("getData... ", datas);
    this.missionChart.setOption(datas, { replaceMerge: "series" });
    console.log(this.missionChart.getOption());
  }
};
